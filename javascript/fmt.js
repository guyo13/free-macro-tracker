$(document).ready(function() {
    let tabIds = ["goto-overview","goto-foods", "goto-profile", "goto-export"];
    let pageController = {
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
            }
            let active = "#" + tabName;
            $(active).addClass("active");
        },
        showOverview: function () {
            pageController.setTabActive("goto-overview");
            $("#export").hide();
            $("#profile").hide();
            $("#foods").hide();
            $("#overview").show();
        },
        showFoods: function () {
            pageController.setTabActive("goto-foods");
            $("#overview").hide();
            $("#profile").hide();
            $("#export").hide();
            $("#foods").show();
        },
        showExport: function () {
            pageController.setTabActive("goto-export");
            $("#overview").hide();
            $("#profile").hide();
            $("#foods").hide();
            $("#export").show();
        },
        showProfile: function () {
            pageController.setTabActive("goto-profile");
            $("#overview").hide();
            $("#foods").hide();
            $("#export").hide();
            $("#profile").show();
        },
    };
    $("#goto-foods").click(pageController.showFoods);
    $("#goto-overview").click(pageController.showOverview);
    $("#goto-export").click(pageController.showExport);
    $("#goto-profile").click(pageController.showProfile);
    pageController.showOverview();
    let hasLocalStorage = pageController.hasLocalStorage();
    if (hasLocalStorage) {
        document.getElementById("page-title").innerHTML += '<div class="alert alert-danger col-12" role="alert">HTML Local Storage is not supported on this browser. Progress won\'t be saved!</div>';
    }
});