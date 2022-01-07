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
  let func = () => {}

  switch(msg.command) {
    case 'bingsearch':
      func = inputBingSearch;
      break;
    case 'bgcolor':
      func = reddenPage;
      break;
    case 'bingresult':
      func = getBingSearchResult;
      break;
  }

  var res = chrome.scripting.executeScript({
    target: { tabId: tab[0].id },
    args: [msg.payload],
    function: func
  }, (res) => cb(res[0].result));
});

function bindFunction(func, ...args) {
  return function () { func(...args); };
}
function reddenPage(payload) {
  document.body.style.backgroundColor = payload.color;
  return 'ASAD';
}

function inputBingSearch(payload) {
  var input = document.getElementById('sb_form_q');
  input.value = payload.query;

  setTimeout(() => {
    var search = document.getElementById('search_icon');
    search.click();
  }, 200)
}

function getBingSearchResult() {
  return Array.from(document.getElementsByTagName("h2")).map(x => x.innerText)
}