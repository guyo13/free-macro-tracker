//Classes

//Page
var tabIds = ["goto-overview","goto-foods", "goto-profile", "goto-export", "goto-import"];
var pageController = {
    hasLocalStorage: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e) {
            return false;
        }
    },
    setTabActive: function(tabName) {
        if (tabIds.indexOf(tabName) <0 ) {
            return;
        }
        for (const i in tabIds) {
            let s = "#" + tabIds[i];
            $(s).removeClass("active");
            let areaToHideName = "#" + tabIds[i].split("-")[1];
            $(areaToHideName).hide();
        }
        let active = "#" + tabName;
        $(active).addClass("active");
        let areaName = "#" + tabName.split("-")[1];
        $(areaName).show();
    },
    showOverview: function () {pageController.setTabActive("goto-overview");},
    showFoods: function () {pageController.setTabActive("goto-foods");},
    showExport: function () {pageController.setTabActive("goto-export");},
    showProfile: function () {pageController.setTabActive("goto-profile");},
};
//Main
$(document).ready(function() {
    for (const i in tabIds) {
        let tabId = tabIds[i];
        $("#" + tabId).click(function () {pageController.setTabActive(tabId)});
    }
    pageController.showOverview();
    let hasLocalStorage = pageController.hasLocalStorage();
    if (!hasLocalStorage) {
        document.getElementById("page-title").innerHTML += '<div class="alert alert-danger col-12" role="alert">HTML Local Storage is not supported on this browser. Progress won\'t be saved!</div>';
    }
});