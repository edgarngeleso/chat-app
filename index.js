const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

const PORT = 4000;


const socketIO = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

let users = [];
let rooms = [];

socketIO.on("connection",(socket)=>{
    console.log(socket.id);

    socket.on("newUser",(newUser)=>{
        console.log(newUser);

        users.push(newUser);

        socket.emit("users",users);
    })

    socket.on("newRoom",(newRoom)=>{
        console.log(newRoom);
        socket.join(newRoom);

        rooms.push(newRoom);

        socket.emit("rooms",rooms);
    })

    socket.on('disconnect', () => {
        socket.disconnect()
        console.log("A user disconnected");
      });
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api",(req,res)=>{
    return res.json({
        "users":users,
        "rooms":rooms
    })
})

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})