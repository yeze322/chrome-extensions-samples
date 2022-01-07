const io = require('./socket.io');

function reddenPage() {
  document.body.style.backgroundColor = 'red';
  var socket = io('http://localhost:3000', { query: "appId=edgeExt" })
  socket.on('broadcast', (msg) => {
    window.alert('sss', msg)
  })
}



chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: reddenPage
  });
});
