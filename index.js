const fs = require('fs')

const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const jsonParser = require('body-parser').json()
const cors = require('cors')

app.use('/',express.static('client'));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg)=>{
    io.emit('chat message',msg)
  })
  socket.on('disconnect', ()=> {
      console.log('user disconnected')
  })
});



app.route('/messages')
    .get((req,res)=>{
        
        res.status(200).json(JSON.parse(fs.readFileSync('data/data.json'))) 
            
        
    })
    .post(jsonParser,(req,res)=>{
        let previous = JSON.parse(fs.readFileSync('data/data.json'))
        previous['results'].push(req.body)
        fs.writeFileSync('data/data.json',JSON.stringify(previous))
        res.status(201).json('finished')
        
    })

app.post('/clear',(req,res)=>{
    fs.writeFileSync('data/data.json',JSON.stringify({results:[]}))
    res.status(200).send('cleared')
})

app.use((req,res)=>{
    res.status(404).json('not-found')
})

http.listen(3000, () => {
  console.log('listening on *:3000');
});