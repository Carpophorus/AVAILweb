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

    AVAIL.bearer = null;

    var tHtml = "snp/t.html";
    var sHtml = "snp/s.html";
    var nHtml = "snp/n.html";
    var pHtml = "snp/p.html";

    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    var showLoading = function (selector) {
        var html = "<div id=\"bckgrnd\"></div><div class='loader'></div>";
        insertHtml(selector, html);
    };

    var showSmallLoading = function (selector) {
        var html = "<div class='loader-small'></div>";
        insertHtml(selector, html);
    };

    document.addEventListener("DOMContentLoaded", function (event) {
        AVAIL.loadT();
    });



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

    AVAIL.toggleTeamDetails = function (e) {
        if ($(e).find("#n-img").hasClass("toggle-off")) {
            $(e).find("#n-img").removeClass("toggle-off");
            $(e).find("#n-img").addClass("toggle-on");
            $(e).parent().addClass("selected");
            $(e).parent().parent().find("#team-members").removeClass("hidden");
        } else if ($(e).find("#n-img").hasClass("toggle-on")) {
            $(e).find("#n-img").addClass("toggle-off");
            $(e).find("#n-img").removeClass("toggle-on");
            $(e).parent().removeClass("selected");
            $(e).parent().parent().find("#team-members").addClass("hidden");
        }
    }

    AVAIL.toggleTeamMemberLocation = function (e) {
        $(document).find("#map").removeClass("hidden");
        var width = window.innerWidth;
        if (width < 992) {
            $(document).find("#d-back").removeClass("hidden");
            $(document).find("#teams").addClass("hidden");
        }
        showSmallLoading("#map");
        $ajaxUtils.sendGetRequest(
            "https://avail.azurewebsites.net/api/rezultat/lokacijaServisera?id=" + $(e).parent().attr("value"),
            function (responseArray) {
                var time = responseArray[0].timeLKL ? responseArray[0].timeLKL : "00:00:00";
                var lat = responseArray[0].latLKL ? responseArray[0].latLKL : 51.523765;
                var lon = responseArray[0].lonLKL ? responseArray[0].lonLKL : -0.158612;
                var html = `
                    <iframe src="http://maps.google.com/maps?q=` + lat + `,` + lon + `&z=15&output=embed" width="100%" height="450"></iframe>
                    <div id="map-info">
                        <span>` + $(e).parent().text() + ((width < 992) ? `</span><br>` : `</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;`) + Math.abs(lat) + ((lat >= 0) ? `N ` : `S `) + Math.abs(lon) + ((lon >= 0) ? `E` : `W`) + ((width < 992) ? `<br>` : `&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;`) + time +
                    `</div>
                `;
                insertHtml("#map", html);
            },
            true /*, AVAIL.bearer*/
        );
        window.scrollTo(0, 0);
    }

    AVAIL.backT = function () {
        $(document).find("#map").addClass("hidden");
        $(document).find("#d-back").addClass("hidden");
        $(document).find("#teams").removeClass("hidden");
        window.scrollTo(0, 0);
    }



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
        });
    };



    /* P */

    AVAIL.currentSearch = 0; //change to 0 on refresh or leave
    AVAIL.technicianID = 0; //change to 0 on refresh or leave

    AVAIL.typesSearch = function (e) {
        var val = e.value;
        if (val == "") {
            AVAIL.currentSearch = 0;
            $(e).parent().parent().find("#search-name").addClass("hidden");
            $(e).parent().parent().find("#search-button").addClass("hidden");
            return;
        }
        $('#search-types option').each(function () {
            if (this.value.toUpperCase() === val.toUpperCase()) {
                AVAIL.currentSearch = $(this).find("#val").attr("value");
            }
        });
        if (AVAIL.currentSearch == 1) {
            $(e).parent().parent().find("#search-name").removeClass("hidden");
        }
    };

    AVAIL.namesSearch = function (e) {
        var val = e.value;
        if (val == "") {
            AVAIL.technicianID = 0;
            $(e).parent().parent().find("#search-button").addClass("hidden");
            return;
        }
        $('#search-names option').each(function () {
            if (this.value.toUpperCase() === val.toUpperCase()) {
                AVAIL.technicianID = $(this).find("#val").attr("value");
            }
        });
        if (AVAIL.technicianID != 0) {
            $(e).parent().parent().find("#search-button").removeClass("hidden");
        }
    }

    AVAIL.searchClick = function () {
        var width = window.innerWidth;
        if (width < 992) {
            $("#search-bar").addClass("hidden");
            $("#p-back").removeClass("hidden");
        }
        $("#results").removeClass("hidden");
        //switch logic here for additional queries
        $("#results1").removeClass("hidden");
        showSmallLoading("#results1");
        $ajaxUtils.sendGetRequest(
            "https://avail.azurewebsites.net/api/rezultat/ucinakServisera?id=" + AVAIL.technicianID,
            function (responseArray) {
                var sumAux = responseArray[0].pending + responseArray[0].success + responseArray[0].failed + responseArray[0].partial + responseArray[0].cancelled;
                var sum = sumAux;
                if (sum == 0) sum = 1;
                var html = `
                    <div id="r1title">
                        Pretraga učinka servisera:
                        <br><strong>` + responseArray[0].name + `</strong>
                    </div>
                    <div id="r1bar">
                        <div id="r1pending" style="width: ` + responseArray[0].pending / sum + `%"></div>
                        <div id="r1success" style="width: ` + responseArray[0].success / sum + `%"></div>
                        <div id="r1partial" style="width: ` + responseArray[0].failed / sum + `%"></div>
                        <div id="r1failed" style="width: ` + responseArray[0].partial / sum + `%"></div>
                        <div id="r1cancelled" style="width: ` + responseArray[0].cancelled / sum + `%"></div>
                    </div>
                    <div class="row" id="r1stats">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Nezapočetih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-pending"><span>` + responseArray[0].pending / sum + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].pending + `/` + sumAux + `)</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Uspešnih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-success"><span>` + responseArray[0].success / sum + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].success + `/` + sumAux + `)</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Delimičnih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-partial"><span>` + responseArray[0].failed / sum + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].failed + `/` + sumAux + `)</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Neuspešnih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-failed"><span>` + responseArray[0].partial / sum + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].partial + `/` + sumAux + `)</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Otkazanih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-cancelled"><span>` + responseArray[0].cancelled / sum + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].cancelled + `/` + sumAux + `)</div>
                    </div>
                `;
                insertHtml("#results1", html);
            },
            true /*, AVAIL.bearer*/
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
