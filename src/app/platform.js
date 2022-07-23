/* global FMTPlatformInterface:false */

//Platform Interface
const platformInterface = {};
platformInterface.hasPlatformInterface = false;
platformInterface.platform = null;
platformInterface.userPromptPlatformCallback = null;
platformInterface.FMTShowAlert = function(msg, level) {
  if (platformInterface.platform == "Android") {
    FMTPlatformInterface.FMTShowAlert(msg, level);
  } else if (platformInterface.platform == "IOS") {
    window.webkit.messageHandlers.FMTShowAlert.postMessage({"msg": msg, "level": level});
  }
};
platformInterface.FMTShowAlertBar = function(msg) {
  if (platformInterface.platform == "Android") {
    FMTPlatformInterface.FMTShowAlertBar(msg);
  } else if (platformInterface.platform == "IOS") {
    window.webkit.messageHandlers.FMTShowAlertBar.postMessage({"msg": msg});
  }
};
platformInterface.FMTExportData = function(data, filename) {
  if (platformInterface.platform == "Android") {
    FMTPlatformInterface.FMTExportData(data, filename);
  } else if (platformInterface.platform == "IOS") {
    window.webkit.messageHandlers.FMTExportData.postMessage({"data": data, "filename": filename});
  }
};
platformInterface.FMTImportData = function() {
  if (platformInterface.platform == "Android") {
    FMTPlatformInterface.FMTImportData();
  } else if (platformInterface.platform == "IOS") {
    window.webkit.messageHandlers.FMTImportData.postMessage("");
  }
};
platformInterface.FMTFinishedLoading = function() {
  if (platformInterface.platform == "Android") {
    FMTPlatformInterface.FMTFinishedLoading();
  } else if (platformInterface.platform == "IOS") {
    window.webkit.messageHandlers.FMTFinishedLoading.postMessage("");
  }
};
platformInterface.FMTShowPrompt = function(msg, level) {
  if (platformInterface.platform == "Android") {
    FMTPlatformInterface.FMTShowPrompt(msg, level);
  } else if (platformInterface.platform == "IOS") {
    window.webkit.messageHandlers.FMTShowPrompt.postMessage({"msg": msg, "level": level});
  }
};
export default platformInterface;