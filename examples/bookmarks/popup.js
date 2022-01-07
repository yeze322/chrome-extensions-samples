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

socket.on('getdata', async function (msg, cb) {
  appendMsg('getdata', msg)
  const tab = await chrome.tabs.query({ active: true, currentWindow: true });
  cb(tab.length)
  chrome.scripting.executeScript({
    target: { tabId: tab[0].id },
    function: reddenPage
  });
});

function reddenPage() {
  document.body.style.backgroundColor = 'red';
}