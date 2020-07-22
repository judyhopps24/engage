var PORT=process.env.PORT || 4000;
var express=require('express');
var socket= require('socket.io');
//app setup
var app=express();
var server=app.listen(PORT,function(){
    console.log('listening on port 4000');
});

// static files
app.use(express.static('public'));

var io=socket(server);
let rooms=0;

io.on('connection', (socket) => {

    // Create a new game room and notify the creator of game.
    socket.on('createGame', (data) => {        
        socket.join(`room-${++rooms}`);
        console.log(data.name,"has joined",rooms);
        socket.roomID=`room-${rooms}`;
        socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
    });

    // Connect the Player 2 to the room he requested. Show error if room full.
    socket.on('joinGame', function (data) {        
        var room = io.nsps['/'].adapter.rooms[data.room];
        if (room && room.length === 1) {
            socket.join(data.room);
            socket.roomID=data.room;
            socket.broadcast.to(data.room).emit('player1', {});
            socket.emit('player2', { name: data.name, room: data.room })
            io.in(data.room).emit('activateBoard',"activate the board");
        } else {
            socket.emit('err', { message: 'Sorry, The room is full!' });
        }
    });

    //Handle the turn played by either player and notify the other.
    socket.on('playTurn', (data) => {
        socket.broadcast.to(data.room).emit('turnPlayed', {
            tile: data.tile,
            room: data.room
        });
    });
 
    //Notify the players about the victor.
    socket.on('gameEnded', (data) => {
        io.in(data.room).emit('gameEnd', data);
    });

    // clear the board on clicking "the play again button"
    socket.on('clearBoard',data=>{
        io.in(data.room).emit('clearTheBoard',data);
    });

    // if a person disconnects from the room the other person is notified
    socket.on('disconnect',(reason)=>{
        var roomName=socket.roomID;
            socket.broadcast.to(roomName).emit('PlayerLeft',"This game was ended because the other played left");        
    });

});
