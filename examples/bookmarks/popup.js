var socket = io('https://pvawsclienttunnel.azurewebsites.net', { query: "appId=edgeExt" })

var messages = document.getElementById('messages');

const appendMsg = (type, msg) => {
  var item = document.createElement('li');
  item.textContent = `${msg.command}`;
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
  const cmdMap = {
    'bingsearch': inputBingSearch,
    'bgcolor': reddenPage,
    'bingresult': getBingSearchResult,
    'clickbingresult': clickResult,
    'openpva': openPVA,
    'openbing': openBing,
    'editcanvas': editingCanvas,
    'pvatopic': viewTopics,
    'whereami': getWindowURL,
    'managechannel': manageChannels
  };
  const empty = () => {};
  const func = cmdMap[msg.command] || empty;

  var res = chrome.scripting.executeScript({
    target: { tabId: tab[0].id },
    args: [msg.payload],
    function: func,
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

  var search = document.getElementById('search_icon');
  search.click();
}

function getBingSearchResult() {
  return Array.from(document.getElementsByTagName("h2")).map(x => x.innerText).join('|');
}

function openPVA() {
  window.location = "https://web.powerva.microsoft.com/environments/bcad62e7-415a-4940-8146-4248ca94e224/bots/74ad33c6-38c8-45ab-a881-d61d22bb19dc/";
}


function openBing() {
  window.location = "https://www.bing.com";
}

function clickResult(payload) {
  Array.from(document.getElementsByTagName("h2")).find(x => x.firstChild.textContent === payload.text).firstChild.click();
}

function viewTopics() {
  document.querySelector('[data-telemetry-id="ShellSidebarComponent-Topics"]').click();
}

function editingCanvas() {
  window.location = "https://web.powerva.microsoft.com/environments/bcad62e7-415a-4940-8146-4248ca94e224/bots/74ad33c6-38c8-45ab-a881-d61d22bb19dc/dialog/new_topic_74ad33c638c845aba881d61d22bb19dc_8a4964498f83424bb3a86295bf7d0952_startover";
}

function manageChannels() {
  document.querySelector('[data-telemetry-id="ShellSidebarComponent-Manage"]').click();
  document.querySelector('[aria-label="Channels"]').click();
}

function getWindowURL() {
  return window.location.href;
}