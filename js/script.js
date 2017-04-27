$(function () {
    $("#navbarToggle").blur(function (event) {
        var width = window.innerWidth;
        if (width < 992) {
            $("#collapsable-nav").collapse('hide');
        }
    });

    $("#navbarToggle").click(function (event) {
        $(event.target).focus();
    });
});

(function (global) {

    /* general */

    var AVAIL = {};

    var tHtml = "snp/t.html";
    var sHtml = "snp/s.html";
    var nHtml = "snp/n.html";
    var pHtml = "snp/p.html";

    var showLoading = function (selector) {
        var html = "<div id=\"bckgrnd\"></div><div class='loader'></div>";
        insertHtml(selector, html);
    };

    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    //TODO: uncomment after development is finished
    /*
    document.addEventListener("DOMContentLoaded", function (event) {
    	AVAIL.loadT();
    });
    */

    /* load main snippets */

    AVAIL.loadT = function () {
        window.scrollTo(0, 0);
        showLoading("#main-content");
        $("#menu-item-1").addClass("tab-indicator");
        $("#menu-item-2").removeClass("tab-indicator");
        $("#menu-item-3").removeClass("tab-indicator");
        $("#menu-item-4").removeClass("tab-indicator");
        $ajaxUtils.sendGetRequest(
            tHtml,
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false
        );
        //TODO: show small loader on #teams (could be static in t.html)
        //TODO: fetch t data

        // if (history.state.state != 1) history.pushState({state: 1}, null, null);
    };

    AVAIL.loadS = function () {
        window.scrollTo(0, 0);
        showLoading("#main-content");
        $("#menu-item-1").removeClass("tab-indicator");
        $("#menu-item-2").addClass("tab-indicator");
        $("#menu-item-3").removeClass("tab-indicator");
        $("#menu-item-4").removeClass("tab-indicator");
        $ajaxUtils.sendGetRequest(
            sHtml,
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false
        );
        //TODO: show small loader on #select (could be static in s.html)
        //TODO: remove static data from s.html, populate #select's inner html with real data and show it (storage first, then alphabetically)
    };

    AVAIL.loadN = function () {
        window.scrollTo(0, 0);
        showLoading("#main-content");
        $("#menu-item-1").removeClass("tab-indicator");
        $("#menu-item-2").removeClass("tab-indicator");
        $("#menu-item-3").addClass("tab-indicator");
        $("#menu-item-4").removeClass("tab-indicator");
        $ajaxUtils.sendGetRequest(
            nHtml,
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false
        );
        //TODO: fetch n data
    };

    AVAIL.loadP = function () {
        window.scrollTo(0, 0);
        showLoading("#main-content");
        $("#menu-item-1").removeClass("tab-indicator");
        $("#menu-item-2").removeClass("tab-indicator");
        $("#menu-item-3").removeClass("tab-indicator");
        $("#menu-item-4").addClass("tab-indicator");
        $ajaxUtils.sendGetRequest(
            pHtml,
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false
        );
    };



    /* T */



    /* S */

    AVAIL.selectS = function (selected_div) {
        $(".s-item").removeClass("selected");
        $(selected_div).addClass("selected");
        var width = window.innerWidth;
        if (width < 992) {
            $("#select").addClass("hidden");
            $("#d-back").removeClass("hidden");
        }
        $("#display").removeClass("hidden");
        //TODO: show small loader on #display
        //TODO: fetch data, generate html, show it
        window.scrollTo(0, 0);
    };

    AVAIL.backD = function () {
        $("#select").removeClass("hidden");
        $("#display").addClass("hidden");
        $("#d-back").addClass("hidden");
        window.scrollTo(0, 0);
    };



    /* N */

    AVAIL.toggleDetails = function (e) {
        if ($(e).find("#n-img").hasClass("toggle-off")) {
            $(e).find("#n-img").removeClass("toggle-off");
            $(e).find("#n-img").addClass("toggle-on");
            $(e).parent().parent().find("#details").removeClass("hidden");
        } else if ($(e).find("#n-img").hasClass("toggle-on")) {
            $(e).find("#n-img").addClass("toggle-off");
            $(e).find("#n-img").removeClass("toggle-on");
            $(e).parent().parent().find("#details").addClass("hidden");
        }
    };

    AVAIL.toggleMaterials = function (e) {
        if ($(e).find("#n-img").hasClass("toggle-off")) {
            $(e).find("#n-img").removeClass("toggle-off");
            $(e).find("#n-img").addClass("toggle-on");
            $(e).parent().parent().find("#materials").removeClass("hidden");
        } else if ($(e).find("#n-img").hasClass("toggle-on")) {
            $(e).find("#n-img").addClass("toggle-off");
            $(e).find("#n-img").removeClass("toggle-on");
            $(e).parent().parent().find("#materials").addClass("hidden");
        }
        //if materials contains loader, fetch data and show it
    };

    AVAIL.toggleDone = function (e) {
        $.confirm({
            title: "POTVRDA AKCIJE",
            content: "Da li želite da završite obradu ovog radnog naloga?",
            buttons: {
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        //set processed = 2 on assignment
                        $(e).parent().parent().addClass("hidden");
                    }
                },
                cancel: {
                    text: "NE"
                }
            }
        })
    };



    /* P */

    AVAIL.currentSearch = 0; //change to 0 on refresh or leave
    AVAIL.technicianID = 0; //change to 0 on refresh or leave

    $(document).ready(function () {
        $("#types-search").on('input', function () {
            var val = this.value;
            if (val == "") {
                AVAIL.currentSearch = 0;
                $(this).parent().parent().find("#search-name").addClass("hidden");
                $(this).parent().parent().find("#search-button").addClass("hidden");
                return;
            }
            $('#search-types option').each(function () {
                if (this.value.toUpperCase() === val.toUpperCase()) {
                    AVAIL.currentSearch = $(this).find("#val").attr("value");
                }
            })
            if (AVAIL.currentSearch == 1) {
                $(this).parent().parent().find("#search-name").removeClass("hidden");
            }
        })
    });

    $(document).ready(function () {
        $("#names-search").on('input', function () {
            var val = this.value;
            if (val == "") {
                AVAIL.technicianID = 0;
                $(this).parent().parent().find("#search-button").addClass("hidden");
                return;
            }
            $('#search-names option').each(function () {
                if (this.value.toUpperCase() === val.toUpperCase()) {
                    AVAIL.technicianID = $(this).find("#val").attr("value");
                }
            })
            if (AVAIL.technicianID != 0) {
                $(this).parent().parent().find("#search-button").removeClass("hidden");
            }
        })
    });

    AVAIL.searchClick = function () {
        var width = window.innerWidth;
        if (width < 992) {
            $("#search-bar").addClass("hidden");
            $("#p-back").removeClass("hidden");
        }
        $("#results").removeClass("hidden");
        //switch logic here
        $("#results1").removeClass("hidden");
        //TODO: fetch data here, inner html spinner on results1 before results come
        $ajaxUtils.sendGetRequest(
            "http://avail.azurewebsites.net/api/rezultat/ucinakServisera?id=1",
            function (responseText) {
                console.log(responseText);
            },
            false
        );
        window.scrollTo(0, 0);
    };

    AVAIL.backP = function () {
        $("#search-bar").removeClass("hidden");
        $("*[id^='results']").addClass("hidden");
        $("#p-back").addClass("hidden");
        window.scrollTo(0, 0);
    };



    // document.addEventListener("DOMContentLoaded", function (event) {
    // 	$ajaxUtils.sendGetRequest(
    // 		homeHtml,
    // 		function (responseText) {
    // 			document.querySelector("#main-content").innerHTML = responseText;
    // 		},
    // 		false
    // 	);
    // 	if(history.state) {
    // 		var snp = null;
    // 		if(history.state) {
    // 			if(history.state.state) {
    // 				switch(history.state.state) {
    // 					case 1:
    // 						snp = homeHtml;
    // 						break;
    // 					case 2:
    // 						snp = registerHtml;
    // 						break;
    // 					case 3:
    // 						snp = newsHtml;
    // 						break;
    // 					case 4:
    // 						snp = aboutHtml;
    // 						break;
    // 					case 5:
    // 						snp = contactHtml;
    // 						break;
    // 					case 1001:
    // 						snp = researchHtml;
    // 						break;
    // 					case 1002:
    // 						snp = valuesHtml;
    // 						break;
    // 					case 1003:
    // 						snp = mwHtml;
    // 						break;
    // 					case 1004:
    // 						snp = mediaHtml;
    // 						break;
    // 					default:
    // 						snp = null;
    // 				}
    // 			}
    // 		}
    // 		if(snp) {
    // 			$ajaxUtils.sendGetRequest(
    // 				snp,
    // 				function (responseText) {
    // 					document.querySelector("#main-content").innerHTML = responseText;
    // 				},
    // 				false
    // 			);
    // 			window.scrollTo(0,0);
    // 		}
    // 	}
    // 	else history.replaceState({state: 1}, null, null);
    // 	window.scrollTo(0,0);
    // });

    // AVAIL.loadHome = function () {
    // 	showLoading("#main-content", "home");
    // 	$ajaxUtils.sendGetRequest(
    // 		homeHtml,
    // 		function (responseText) {
    // 			document.querySelector("#main-content").innerHTML = responseText;
    // 		},
    // 		false
    // 	);
    // 	if (history.state.state != 1) history.pushState({state: 1}, null, null);
    // 	window.scrollTo(0,0);
    // };

    // AVAIL.loadRegister = function () {
    // 	showLoading("#main-content", "register");
    // 	$ajaxUtils.sendGetRequest(
    // 		registerHtml,
    // 		function (responseText) {
    // 			document.querySelector("#main-content").innerHTML = responseText;
    // 		},
    // 		false
    // 	);
    // 	if (history.state.state != 2) history.pushState({state: 2}, null, null);
    // 	window.scrollTo(0,0);
    // };

    // AVAIL.loadNews = function () {
    // 	showLoading("#main-content", "news");
    // 	$ajaxUtils.sendGetRequest(
    // 		newsHtml,
    // 		function (responseText) {
    // 			document.querySelector("#main-content").innerHTML = responseText;
    // 		},
    // 		false
    // 	);
    // 	if (history.state.state != 3) history.pushState({state: 3}, null, null);
    // 	window.scrollTo(0,0);
    // };

    // AVAIL.loadAbout = function () {
    // 	showLoading("#main-content", "about");
    // 	$ajaxUtils.sendGetRequest(
    // 		aboutHtml,
    // 		function (responseText) {
    // 			document.querySelector("#main-content").innerHTML = responseText;
    // 		},
    // 		false
    // 	);
    // 	if (history.state.state != 4) history.pushState({state: 4}, null, null);
    // 	window.scrollTo(0,0);
    // };

    // AVAIL.loadContact = function () {
    // 	showLoading("#main-content", "contact");
    // 	$ajaxUtils.sendGetRequest(
    // 		contactHtml,
    // 		function (responseText) {
    // 			document.querySelector("#main-content").innerHTML = responseText;
    // 		},
    // 		false
    // 	);
    // 	if (history.state.state != 5) history.pushState({state: 5}, null, null);
    // 	window.scrollTo(0,0);
    // };

    // AVAIL.loadPiece = function (articleNumber) {
    // 	showLoading("#main-content", "news");
    // 	var articleHtml;
    // 	switch(articleNumber) {
    // 		case 1:
    // 			articleHtml = researchHtml;
    // 			history.pushState({state: 1001}, null, null);
    // 			break;
    // 		case 2:
    // 			articleHtml = valuesHtml;
    // 			history.pushState({state: 1002}, null, null);
    // 			break;
    // 		case 3:
    // 			articleHtml = mwHtml;
    // 			history.pushState({state: 1003}, null, null);
    // 			break;
    // 		case 4:
    // 			articleHtml = mediaHtml;
    // 			history.pushState({state: 1004}, null, null);
    // 			break;
    // 		default:
    // 			articleHtml = null;
    // 	}
    // 	$ajaxUtils.sendGetRequest(
    // 		articleHtml,
    // 		function (responseText) {
    // 			document.querySelector("#main-content").innerHTML = responseText;
    // 		},
    // 		false
    // 	);
    // 	window.scrollTo(0,0);
    // }

    // window.onpopstate = function (event) {
    // 	var snp = null;
    // 	if(event.state.state) {
    // 		switch(event.state.state) {
    // 			case 1:
    // 				snp = homeHtml;
    // 				break;
    // 			case 2:
    // 				snp = registerHtml;
    // 				break;
    // 			case 3:
    // 				snp = newsHtml;
    // 				break;
    // 			case 4:
    // 				snp = aboutHtml;
    // 				break;
    // 			case 5:
    // 				snp = contactHtml;
    // 				break;
    // 			case 1001:
    // 				snp = researchHtml;
    // 				break;
    // 			case 1002:
    // 				snp = valuesHtml;
    // 				break;
    // 			case 1003:
    // 				snp = mwHtml;
    // 				break;
    // 			case 1004:
    // 				snp = mediaHtml;
    // 				break;
    // 			default:
    // 				snp = null;
    // 		}
    // 	}
    // 	if(snp) {
    // 		$ajaxUtils.sendGetRequest(
    // 			snp,
    // 			function (responseText) {
    // 				document.querySelector("#main-content").innerHTML = responseText;
    // 			},
    // 			false
    // 		);
    // 		window.scrollTo(0,0);
    // 	}
    // }

    global.$AVAIL = AVAIL;
})(window);
