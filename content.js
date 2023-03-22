console.log("excuting aws sso refresh script");
// Define the interval (in milliseconds) between checks for the link
const linkDetectionInterval = 200;
const ssoRefreshInterval = 540000; // 9 minutes
let intervalInvocationId = null;

setInterval(updateLinks, linkDetectionInterval);

function periodicallyOpenNewTab(url) {
  clearInterval(intervalInvocationId)
  let opener = function () {
    console.log("send createTab request");
    try {
      chrome.runtime.sendMessage({
        action: "createTab",
        url: url,
      });
    } catch (e) {
      clearRefreshIcon();
      console.log(e);
    }
  };
  intervalInvocationId = setInterval(opener, ssoRefreshInterval);
  console.log(`Interval ${intervalInvocationId} set for url ${url}`)
}

function updateOnclick(node) {
  node.onclick = function() {
    periodicallyOpenNewTab(node.href)
    clearRefreshIcon()
    addRefreshIcon(node)
  }
}

function addRefreshIcon(node) {
    let image = document.createElement("img");
    image.className = "refresh-icon"
    image.src = chrome.extension.getURL("assets/rotate.png");
    image.style.width = "28px";
    image.style["margin-right"] = "8px";
    node.parentNode.insertBefore(image, node);
}

function clearRefreshIcon() {
  const elements = document.querySelectorAll('.refresh-icon');
  for (let i = 0; i < elements.length; i++) {
    elements[i].parentNode.removeChild(elements[i]);
  }
}

function updateLinks() {
  const allLinks = document.getElementsByTagName("a");
  for (const aTag of allLinks) {
    if (aTag.textContent.trim() === "Management console" && !aTag.updated) {
      updateOnclick(aTag)
      aTag.updated = true;
    }
  }
}
