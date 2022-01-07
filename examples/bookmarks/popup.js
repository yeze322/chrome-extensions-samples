var socket = io('http://localhost:3000', { query: "appId=edgeExt" })

var messages = document.getElementById('messages');

const appendMsg = (type, msg) => {
  var item = document.createElement('li');
  item.textContent = `(${type})[${new Date().toLocaleString()}]:        ${JSON.stringify(msg)}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

socket.on('broadcast', function (msg) {
  console.log('broadcast received', msg);
  appendMsg('broadcast', msg);
});

socket.on('getdata', function (msg, cb) {
  console.log('getdata received', msg);
  appendMsg('getdata', msg)
  cb(document.getElementById('customInput').value)
});
