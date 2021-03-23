const githubID = 'vagabondms' // 여러분의 아이디로 바꿔주세요

const app = {
  server: `http://localhost:3000/messages`,
  connect: io(),
  init: () => {
      // TODO
    app.clearMessages()
    app.fetch(data=>{
      data.results.forEach(app.renderMessage)
    })
    
    document.querySelector('#send').addEventListener('submit',app.handleSubmit)
  },
  
  //fetch는 데이터를 갖고 와야함.
  fetch: (callback) => {
    // TODO
    return window.fetch(app.server)
    .then(res=>res.json())
    .then(callback)
    //callback 함수를 이용하여 data를 활용할 수 있다.
  },

  send: (message,callback)=> {
    app.connect.emit('chat message',message)  
    window.fetch(app.server,{
      method: 'post',
      body:  JSON.stringify(message),
      headers: {'Content-type': 'application/json'}
    }).then(res => 
      res.json()
    ).then(callback)
  },

  renderMessage: (message) => {

    [wrapper,username,chat,date] = app.createElements('div','span','div','span')
    

    username.textContent = message.username.replace(/<(|\/|[^\/>][^>]+|\/[^>][^>]+)>/g,'')
    username.classList.add('username')
    chat.textContent = message.text.replace(/<(|\/|[^\/>][^>]+|\/[^>][^>]+)>/g,'')
    
    date.textContent = message.date
    date.classList.add('date')
    wrapper.append(username,date,chat)
    wrapper.classList.add('chat')
    

    document.querySelector('#chats').prepend(wrapper)
  },

  clearServer:()=>{
    window.fetch(`http://localhost:3000/clear`,{
      method : 'post'
    }).then(()=>{app.init()})
  },

  clearMessages: () => {
    document.querySelector('#chats').innerHTML=''
  },

  handleSubmit: e=>{
    e.preventDefault()
    app.send({
      username: document.querySelector('.inputUser').value,
      text : document.querySelector('.inputChat').value,
      date : ((x)=>new Date().toISOString())()
    },()=>{})
    
    document.querySelector('.inputUser').value = ''
    document.querySelector('.inputChat').value = ''
    
  },

  createElements: (...args) => {
    return [...args].map(x => document.createElement(x))
  }
};
app.connect.on('chat message', function(msg) {
  app.renderMessage(msg)
});


app.init();

// 테스트를 위한 코드입니다. 아래 내용은 지우지 마세요
if(window.isNodeENV){
  module.exports = app;
}