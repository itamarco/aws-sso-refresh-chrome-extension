const aws_sso_url = "https://getbrew.awsapps.com/start";
// Define the query selector for the link
var linkSelector = "[title='management_accn_poweruser_ps']";

// Define the interval (in milliseconds) between checks for the link
let activated = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "createTab") {
    return createTabs(request.url);
  }
});

function createTabs(url) {
  chrome.tabs.create(
    {
      url: url,
      active: false,
    },
    function (tab) {
      // Close the new tab after 3 seconds
      setTimeout(function () {
        chrome.tabs.remove(tab.id);
      }, 6000);
    }
  );
}
