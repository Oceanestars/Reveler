// Utilities
//
function log(...s) {
  const string = JSON.stringify(s);
  chrome.devtools.inspectedWindow.eval('console.log(' + string + ')')
};

const messageType = {
  EXECUTE_SCRIPT: 'EXECUTE_SCRIPT',
  RUN_AXS: 'RUN_AXS',
  HIGHLIGHT_WARNING: 'HIGHLIGHT_WARNING',
  UNHIGHLIGHT_WARNING: 'UNHIGHLIGHT_WARNING',
  TRACE_TAB_PATH: 'TRACE_TAB_PATH',
  PNG_TAB_PATH: 'PNG_TAB_PATH',
  CLEAR_AXS: 'CLEAR_AXS'
}

const WARNING_ATTR_NAME = 'chromelens-warning-id';



const runAxsButton = document.getElementById('runAxs');
  const clearAxsButton = document.getElementById('clearAxs');
  runAxsButton.onclick = function() {
    chrome.runtime.sendMessage({
      type: messageType.RUN_AXS,
      data: {
        tabId: chrome.devtools.inspectedWindow.tabId
      }
    })
    clearAxsButton.style.visibility = null;
  };

  clearAxsButton.onclick = function() {
    chrome.runtime.sendMessage({
      type: messageType.CLEAR_AXS,
      data: {
        tabId: chrome.devtools.inspectedWindow.tabId
      }
    })
    const resultRoot = document.getElementById('axs-results');
    removeChildren(resultRoot);
    clearAxsButton.style.visibility = 'hidden';
  }

function removeChildren(el) {
  if (!el) { return; }
  while (el.children.length > 0) {
    el.children[0].remove()
  }
}

function severityNode(severity) {
  var span = document.createElement('span');
  span.classList.add( severity.toLowerCase());
  span.innerText = severity;
  return span;
}

function showAxsResults(idToWarningsMap) {

  var btnSpeak = document.getElementById('runAxs');
  // var synth = window.speechSynthesis;
  // var toSpeak = new SpeechSynthesisUtterance("hello");
  // btnSpeak.addEventListener('click', ()=> {
  //     // var toSpeak = new SpeechSynthesisUtterance(txtInput.value);
  //     synth.speak(toSpeak);
  //     console.log("say hello")
  // });

  const synth = window.speechSynthesis;
  let paragraphs = document.getElementsByTagName('p');
  for (elt of paragraphs){
    console.log("yello");
    const speak = text => {
      if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
      }
      let utterThis = new SpeechSynthesisUtterance(text);
      btnSpeak.addEventListener('click', ()=> {
          // var toSpeak = new SpeechSynthesisUtterance(txtInput.value);
          synth.speak(utterThis);
          console.log("this is voice");
      });
    };
      speak(elt.value);
  };

  const resultRoot = document.querySelector('#axs-results');
  removeChildren(resultRoot);
  if (Object.keys(idToWarningsMap).length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No failures found';
    resultRoot.appendChild(p);
    return;
  }

  const ul = document.createElement('ul');
  for (i in idToWarningsMap) {
    var div = document.createElement('li');
    div.classList.add('result-line');
    div.id = i;

    var s_el = severityNode(idToWarningsMap[i].rule.severity);
    div.appendChild(s_el);
    div.appendChild(document.createTextNode(' '));

    var div_note = idToWarningsMap[i].rule.heading;
    div.appendChild(document.createTextNode(div_note))

    var link = document.createElement('a');
    link.href = idToWarningsMap[i].rule.url;
    link.target = '_blank';
    link.innerText = idToWarningsMap[i].rule.code;

    div.appendChild(document.createTextNode(' '));
    div.appendChild(link);

    div.onmouseover = function() {
      _highlight(this);
      chrome.runtime.sendMessage({
        type: messageType.HIGHLIGHT_WARNING,
        data: {
          tabId: chrome.devtools.inspectedWindow.tabId,
          warningId: i
        }
      });
    };
    div.onmouseout = function() {
      _unhighlight(this);
      chrome.runtime.sendMessage({
        type: messageType.UNHIGHLIGHT_WARNING,
        data: {
          tabId: chrome.devtools.inspectedWindow.tabId,
          warningId: i
        }
      });
    };
    let evalString = `var node = document.querySelector("[${WARNING_ATTR_NAME}='${i}']"); inspect(node)`
    div.onmousedown = function() {
      chrome.devtools.inspectedWindow.eval(evalString)
    };

    ul.appendChild(div);
  }

  resultRoot.appendChild(ul);
}

function highlightReportLine(warningId) {
  const line = document.getElementById(warningId);
  if (line) { _highlight(line); }
}

function unhighlightReportLine(warningId) {
  const line = document.getElementById(warningId);
  if (line) { _unhighlight(line); }
}

function _highlight(lineEl) {
  lineEl.style.border = '2px solid blue';
}

function _unhighlight(lineEl) {
  lineEl.style.border = null;
}


