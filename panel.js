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
    clearAxsButton.style.visibility = 'hidden';
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
var count = 0;
function showAxsResults(idToWarningsMap) {

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
    count++;
    console.log("Count2: "+count);

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
    // div.onmouseover = function() {
    //   _highlight(this);
    //   chrome.runtime.sendMessage({
    //     type: messageType.HIGHLIGHT_WARNING,
    //     data: {
    //       tabId: chrome.devtools.inspectedWindow.tabId,
    //       warningId: i
    //     }
    //   });
    // };
    // div.onmouseout = function() {
    //   _unhighlight(this);
    //   chrome.runtime.sendMessage({
    //     type: messageType.UNHIGHLIGHT_WARNING,
    //     data: {
    //       tabId: chrome.devtools.inspectedWindow.tabId,
    //       warningId: i
    //     }
    //   });
    // };
    let evalString = `var node = document.querySelector("[${WARNING_ATTR_NAME}='${i}']"); inspect(node)`
    div.onmousedown = function() {
      chrome.devtools.inspectedWindow.eval(evalString)
    };
    ul.appendChild(div);
  }
 resultRoot.appendChild(ul);
}
// function highlightReportLine(warningId) {
//   const line = document.getElementById(warningId);
//   if (line) { _highlight(line); }
// }
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
var doTextToSpeech = false;
var toggleCheck = document.getElementById('myCheck');
toggleCheck.addEventListener('click', ()=> {
  toggleCheck.addEventListener('change', function () {
    if (toggleCheck.checked) {
      doTextToSpeech = true;
      console.log('Checked');
    } else {
      console.log('Not checked');
      doTextToSpeech = false;
    }
  });
});

var theGrade = document.getElementById('grade');
function Grade(count){
  console.log("Count in grade: "+count);
  if(count <1){
    theGrade.innerText = "A";

    console.log("Whereami!");
  }
  if (2 < count < 4) {
    theGrade.innerText = "B";
 
    console.log("Whereami!2");
  } 
  if(4 < count < 8){
    theGrade.innerText = "C";
    console.log("Whereami!3");
  }
  if (count > 8){
    theGrade.innerText = "F";
    console.log("Whereami!4");

  }
  

}
var btnSpeak = document.getElementById('runAxs');
var whatWeDo = document.getElementById('onlyHomepage');
var moreInfo1 = document.getElementById("pageAnalysis1");
var moreInfo2 = document.getElementById("pageAnalysis2");
var moreInfo3 = document.getElementById("pageAnalysis3");
var moreInfo4 = document.getElementById("pageAnalysis4");
var moreInfo5 = document.getElementById("pageAnalysis5");

btnSpeak.addEventListener("click", () => {

let paragraphs = document.body.innerText;
var synth = window.speechSynthesis;
var toSpeak = new SpeechSynthesisUtterance(paragraphs);
console.log(paragraphs);
  whatWeDo.style.display = 'none';
  pageAnalysis.style.display ='block';
  setTimeout(function(){
    Grade(count);
},2000);

  // Grade(count);
  if(doTextToSpeech){
    toSpeak.rate = 1;
    synth.speak(toSpeak);
    console.log("doing text to speech");
  }
  else{
    console.log("Not doing text to speech");
  }
});

moreInfo1.addEventListener("click", () => {
  if (categoryInfo1.style.display === "none") {
    categoryInfo1.style.display = "flex";
    moreInfo1.style.textDecoration = "underline";

  } else {
    categoryInfo1.style.display = "none";
    moreInfo1.style.textDecoration = "none";
  }
  console.log("show stuff");
});

moreInfo2.addEventListener("click", () => {
  if (categoryInfo2.style.display === "none") {
    categoryInfo2.style.display = "block";
    moreInfo2.style.textDecoration = "underline";
  } else {
    categoryInfo2.style.display = "none";
    moreInfo2.style.textDecoration = "none";
  }
  console.log("show stuff");
});

moreInfo3.addEventListener("click", () => {
  if (categoryInfo3.style.display === "none") {
    categoryInfo3.style.display = "block";
    moreInfo3.style.textDecoration = "underline";
  } else {
    categoryInfo3.style.display = "none";
    moreInfo3.style.textDecoration = "none";
  }
  console.log("show stuff");
});

moreInfo4.addEventListener("click", () => {
  if (categoryInfo4.style.display === "none") {
    categoryInfo4.style.display = "block";
    moreInfo4.style.textDecoration = "underline";
  } else {
    categoryInfo4.style.display = "none";
    moreInfo4.style.textDecoration = "none";
  }
  console.log("show stuff");
});

moreInfo5.addEventListener("click", () => {
  if (categoryInfo5.style.display === "none") {
    categoryInfo5.style.display = "block";
    moreInfo5.style.textDecoration = "underline";
  } else {
    categoryInfo5.style.display = "none";
    moreInfo5.style.textDecoration = "none";
  }
  console.log("show stuff");
});