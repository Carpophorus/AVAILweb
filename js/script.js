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

    var nHtml = "snp/n.html";
    var pHtml = "snp/p.html";
    var ntHtml = "snp/nt.html";
    var raHtml = "snp/ra.html";

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

    AVAIL.teamsArray;
    AVAIL.techniciansArray;
    AVAIL.vehiclesArray;

    AVAIL.loadT = function () {
        window.scrollTo(0, 0);
        showLoading("#main-content");
        $("#menu-item-1").addClass("tab-indicator");
        $("#menu-item-2").removeClass("tab-indicator");
        $("#menu-item-3").removeClass("tab-indicator");
        $("#menu-item-4").removeClass("tab-indicator");
        if (AVAIL.teamsArray == null) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/timovi",
                function (responseArray) {
                    AVAIL.teamsArray = responseArray;
                    AVAIL.loadT();
                },
                true
            );
        } else if (AVAIL.techniciansArray == null) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/serviseri",
                function (responseArray) {
                    AVAIL.techniciansArray = responseArray;
                    AVAIL.loadT();
                },
                true
            );
        } else if (AVAIL.vehiclesArray == null) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/vozila",
                function (responseArray) {
                    AVAIL.vehiclesArray = responseArray;
                    AVAIL.loadT();
                },
                true
            );
        } else {
            var html = `
                <div id="bckgrnd"></div>
                <div class="row" id="t">
                    <div class="col-lg-6 col-md-6 left" id="teams">
            `;
            for (i = 0; i < AVAIL.teamsArray.length; i++) {
                var teamName = AVAIL.teamsArray[i]["name"];
                var teamID = AVAIL.teamsArray[i]["idTeam"];
                var teamExists = false;
                for (j = 0; j < AVAIL.techniciansArray.length; j++) {
                    if (AVAIL.techniciansArray[i]["idTeam"] == teamID) {
                        teamExists = true;
                        break;
                    }
                }
                if (teamExists) {
                    html += `
                        <div id="team-container-outer">
                            <div id="team-container">
                                <div id="team-name" value="` + teamID + `"><span>` + teamName + `</span></div>
                                <div id="toggle-details-team" onClick="$AVAIL.toggleTeamDetails(this);">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                                <div id="toggle-gps" onClick="$AVAIL.toggleTeamVehicleLocation(this);">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                                <div id="new-assignment" onClick="$AVAIL.newTeamAssignment(this);">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                            </div>
                            <div class="hidden" id="team-members">
                    `;
                    for (i = 0; i < AVAIL.techniciansArray.length; i++) {
                        if (AVAIL.techniciansArray[i]["idTeam"] == teamID) {
                            html += `
                                <div id="team-member" value="` + AVAIL.techniciansArray[i]["idTechnician"] + `">
                                    ` + AVAIL.techniciansArray[i]["name"] + `
                                    <div id="toggle-details-team" onClick="$AVAIL.toggleTeamMemberDetails(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                    <div id="toggle-gps" onClick="$AVAIL.toggleTeamMemberLocation(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                    <div id="new-assignment" onClick="$AVAIL.newPersonalAssignment(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                </div>
                            `;
                        }
                    }
                    html += `
                            </div>
                        </div>
                    `;
                }
            }
            var nullExists = false;
            for (i = 0; i < AVAIL.techniciansArray.length; i++) {
                if (AVAIL.techniciansArray[i]["idTeam"] == null) {
                    nullExists = true;
                    break;
                }
            }
            if (nullExists) {
                html += `
                        <div id="team-container-outer">
                            <div id="team-container">
                                <div id="team-name" value="0"><span>&#9670;</span></div>
                                <div id="toggle-details-team" onClick="$AVAIL.toggleTeamDetails(this);">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                                <div id="toggle-gps" onClick="$AVAIL.toggleTeamVehicleLocation(this);">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                                <div id="new-assignment" onClick="$AVAIL.newTeamAssignment(this);">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                            </div>
                            <div class="hidden" id="team-members">
                `;
                for (i = 0; i < AVAIL.techniciansArray.length; i++) {
                    if (AVAIL.techniciansArray[i]["idTeam"] == null) {
                        html += `
                                <div id="team-member" value="` + AVAIL.techniciansArray[i]["idTechnician"] + `">
                                    ` + AVAIL.techniciansArray[i]["name"] + `
                                    <div id="toggle-details-team" onClick="$AVAIL.toggleTeamMemberDetails(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                    <div id="toggle-gps" onClick="$AVAIL.toggleTeamMemberLocation(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                    <div id="new-assignment" onClick="$AVAIL.newPersonalAssignment(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                </div>
                        `;
                    }
                }
                html += `
                            </div>
                        </div>
                `;
            }
            html += `
                        <button id="button-teams" onclick="$AVAIL.rearrangeTeams()">PRERASPODELA</button>
                    </div>
                    <div class="col-lg-6 col-md-6 right hidden" id="map">
                        <iframe src="https://maps.google.com/maps?q=51.523765,-0.158612&z=15&output=embed" width="100%" height="450"></iframe>
                    </div>
                    <div class="hidden" id="d-back" onclick="$AVAIL.backT()"></div>
                </div>
            `;
            document.querySelector("#main-content").innerHTML = html;
        }
        // if (history.state.state != 1) history.pushState({state: 1}, null, null);
    };

    AVAIL.warehousesArray;

    AVAIL.loadS = function () {
        window.scrollTo(0, 0);
        showLoading("#main-content");
        $("#menu-item-1").removeClass("tab-indicator");
        $("#menu-item-2").addClass("tab-indicator");
        $("#menu-item-3").removeClass("tab-indicator");
        $("#menu-item-4").removeClass("tab-indicator");
        if (AVAIL.techniciansArray == null) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/serviseri",
                function (responseArray) {
                    AVAIL.techniciansArray = responseArray;
                    AVAIL.loadS();
                },
                true
            );
        } else if (AVAIL.warehousesArray == null) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/magacini",
                function (responseArray) {
                    AVAIL.warehousesArray = responseArray;
                    AVAIL.loadS();
                },
                true
            );
        } else {
            var html = `
                <div id="bckgrnd"></div>
                <div class="row" id="s">
                    <div class="col-lg-6 col-md-6 left row" id="select">
            `;
            for (var i = 0; i < AVAIL.warehousesArray.length; i++) {
                html += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 s-item" onclick="$AVAIL.selectSM(this)" value="` + AVAIL.warehousesArray[i]["idWarehouse"] + `">` + AVAIL.warehousesArray[i]["name"] + `</div>`;
            }
            if (AVAIL.techniciansArray.length > 0) {
                html += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="underline"></div>`;
            }
            for (var i = 0; i < AVAIL.techniciansArray.length; i++) {
                html += `<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 s-item" onclick="$AVAIL.selectS(this)" value="` + AVAIL.techniciansArray[i]["idTechnician"] + `">` + AVAIL.techniciansArray[i]["name"] + `</div>`;
            }
            html += `
                    </div>
                    <div class="col-lg-6 col-md-6 right hidden" id="display">
                    </div>
                    <div class="hidden" id="d-back" onclick="$AVAIL.backD()"></div>
                </div>
            `;
            document.querySelector("#main-content").innerHTML = html;
        }
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

    AVAIL.datetimeString = "";
    AVAIL.assignmentArray = [];

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
    };

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
                    <iframe src="https://maps.google.com/maps?q=` + lat + `,` + lon + `&z=15&output=embed" width="100%" height="450"></iframe>
                    <div id="map-info">
                        <span>` + $(e).parent().text() + ((width < 992) ? `</span><br>` : `</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;`) + Math.abs(lat) + ((lat >= 0) ? `N ` : `S `) + Math.abs(lon) + ((lon >= 0) ? `E` : `W`) + ((width < 992) ? `<br>` : `&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;`) + time +
                    `</div>
                `;
                insertHtml("#map", html);
            },
            true /*, AVAIL.bearer*/
        );
        window.scrollTo(0, 0);
    };

    AVAIL.backT = function () {
        $(document).find("#map").addClass("hidden");
        $(document).find("#d-back").addClass("hidden");
        $(document).find("#teams").removeClass("hidden");
        window.scrollTo(0, 0);
    };

    AVAIL.datetimeLoaded = function (e) {
        $(function () {
            $('#due-time').datetimepicker({
                format: "DD.MM.YYYY. HH:mm"
            });
        });
        $("#due-time").on("dp.show", function () {
            $("#due-time").data("DateTimePicker").minDate("now");
        });
        $("#due-time").on("dp.change", function () {
            var date = $("#due-time").data("DateTimePicker").viewDate();
            if (date) {
                date = date._d;
                var yearString = date.getFullYear();
                var month = date.getMonth() + 1;
                monthString = (month >= 1 && month <= 9) ? ("0" + month) : month;
                var day = date.getDate();
                dayString = (day >= 1 && day <= 9) ? ("0" + day) : day;
                var hours = date.getHours();
                hoursString = (hours == 0) ? "00" : ((hours >= 1 && hours <= 9) ? ("0" + hours) : hours);
                var minutes = date.getMinutes();
                minutesString = (minutes == 0) ? "00" : ((minutes >= 1 && minutes <= 9) ? ("0" + minutes) : minutes);
                var seconds = date.getSeconds();
                secondsString = (seconds == 0) ? "00" : ((seconds >= 1 && seconds <= 9) ? ("0" + seconds) : seconds);
                AVAIL.datetimeString = "" + yearString + "-" + monthString + "-" + dayString + "T" + hoursString + ":" + minutesString + ":" + secondsString;
            }
            if ($("#due-time").val() == "") AVAIL.datetimeString = "";
        });
        e.remove();
    };

    AVAIL.clientsArray = [];
    AVAIL.locationsArray = [];
    AVAIL.htmlNA = "";

    AVAIL.scrollToTopFix = function (e) {
        e.remove();
        window.scrollTo(0, 0);
    };

    AVAIL.loadNA = function () {
        window.scrollTo(0, 0);
        showLoading("#main-content");
        if (AVAIL.clientsArray.length == 0) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/klijenti",
                function (responseArray) {
                    AVAIL.clientsArray = responseArray;
                    AVAIL.loadNA();
                },
                true /*, AVAIL.bearer*/
            );
        } else if (AVAIL.locationsArray.length == 0) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/lokacije",
                function (responseArray) {
                    AVAIL.locationsArray = responseArray;
                    AVAIL.loadNA();
                },
                true /*, AVAIL.bearer*/
            );
        } else if (AVAIL.htmlNA == "") {
            var html = `
                <div id="bckgrnd"></div>
                <div class="row" id="nt">
                    <img src="img/little-script-helper.png" onload="$AVAIL.datetimeLoaded(this);">
                    <img src="img/little-script-helper.png" onload="init();">
                    <img src="img/little-script-helper.png" onload="$AVAIL.scrollToTopFix(this);">
                    <div id="nt-title">NOVI&nbsp;ZADATAK</div>
                    <input id="clients-search" type="search" list="search-clients" placeholder="Klijent" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Klijent'" oninput="$AVAIL.clientsSearch(this)">
                    <datalist id="search-clients">
            `;
            for (var i = 0; i < AVAIL.clientsArray.length; i++) {
                html += `
                        <option value="` + AVAIL.clientsArray[i]["name"] + `"><div value="` + AVAIL.clientsArray[i]["idClient"] + `" id="val"></div></option>
                `;
            }
            html += `
                    </datalist>
                    <input id="locations-search" type="search" list="search-locations" placeholder="Lokacija" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Lokacija'" oninput="$AVAIL.locationsSearch(this)">
                    <datalist id="search-locations">
            `;
            for (var i = 0; i < AVAIL.locationsArray.length; i++) {
                html += `
                        <option value="` + AVAIL.locationsArray[i]["description"] + `"><div value="` + AVAIL.locationsArray[i]["idLocation"] + `" id="val"></div></option>
                `;
            }
            html += `
                    </datalist>
                    <div id="picker-container">
                        <input id="due-time" class="form-control" placeholder="Zakazano vreme" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Zakazano vreme'" onkeydown="return false">
                    </div>
                    <input id="short-desc" type="text" placeholder="Kratak opis" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Kratak opis'">
                    <textarea id="long-desc" placeholder="Detaljan opis" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Detaljan opis'"></textarea>
                    <button id="button-addtask" onclick="$AVAIL.makeNA()">NAPRAVI</button>
                    <button id="button-canceltask" onclick="$AVAIL.cancelNA()">OTKAŽI</button>
                </div>
            `;
            AVAIL.htmlNA = html;
            document.querySelector("#main-content").innerHTML = html;
        } else {
            document.querySelector("#main-content").innerHTML = AVAIL.htmlNA;
        }
    };

    AVAIL.assignedClient;
    AVAIL.assignedLocation;

    AVAIL.newPersonalAssignment = function (e) {
        AVAIL.assignedClient = 0;
        AVAIL.assignedLocation = 0;
        AVAIL.loadNA();
        AVAIL.assignmentArray = [];
        AVAIL.assignmentArray.push($(e).parent().attr("value"));
    };

    AVAIL.newTeamAssignment = function (e) {
        AVAIL.assignedClient = 0;
        AVAIL.assignedLocation = 0;
        AVAIL.loadNA();
        AVAIL.assignmentArray = [];
        var selector = $(e).parent().parent().find("#team-members").children();
        selector.each(function () {
            AVAIL.assignmentArray.push($(this).attr("value"));
        });
    };

    AVAIL.clientsSearch = function (e) {
        var val = e.value;
        if (val == "") {
            AVAIL.assignedClient = 0;
            return;
        }
        $('#search-clients option').each(function () {
            if (this.value.toUpperCase() === val.toUpperCase()) {
                AVAIL.assignedClient = $(this).find("#val").attr("value");
            }
        });
    };

    AVAIL.locationsSearch = function (e) {
        var val = e.value;
        if (val == "") {
            AVAIL.assignedLocation = 0;
            return;
        }
        $('#search-locations option').each(function () {
            if (this.value.toUpperCase() === val.toUpperCase()) {
                AVAIL.assignedLocation = $(this).find("#val").attr("value");
            }
        });
    };

    AVAIL.makeNA = function () {
        if (AVAIL.assignedClient == 0 || AVAIL.datetimeString == "" || document.getElementById("short-desc").value == "") {
            $.confirm({
                title: "GREŠKA",
                content: "Popunite barem obavezna polja kako biste napravili novi zadatak.<br><br>&bull; Klijent<br>&bull; Zakazano vreme<br>&bull; Kratak opis",
                buttons: {
                    confirm: {
                        text: "OK",
                        btnClass: "btn-red"
                    }
                }
            });
        } else {
            $.confirm({
                title: "POTVRDA AKCIJE",
                content: "Da li želite da napravite zadatak za" + ((AVAIL.assignmentArray.length > 1) ? "odabrani tim?" : "odabranog servisera?"),
                buttons: {
                    confirm: {
                        text: "DA",
                        btnClass: "btn-red",
                        action: function () {
                            $ajaxUtils.sendPostRequest(
                                "https://avail.azurewebsites.net/api/rezultat/noviZadatak?id=" + AVAIL.assignedClient + "&id1=" + ((AVAIL.assignedLocation == 0) ? encodeURIComponent(0) : AVAIL.assignedLocation) + "&timestring=" + encodeURIComponent(AVAIL.datetimeString) + "&shortDescString=" + encodeURIComponent(document.getElementById("short-desc").value) + "&longDescString=" + ((document.getElementById("long-desc").value == "") ? encodeURIComponent(0) : encodeURIComponent(document.getElementById("long-desc").value)),
                                function (response) {
                                    console.log(AVAIL.datetimeString);
                                    console.log(response);
                                },
                                true /*, AVAIL.bearer*/
                            );
                            AVAIL.loadT();
                        }
                    },
                    cancel: {
                        text: "NE"
                    }
                }
            });
        }
    };

    AVAIL.cancelNA = function () {
        $.confirm({
            title: "POTVRDA AKCIJE",
            content: "Da li želite da odbacite izmene?",
            buttons: {
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        AVAIL.loadT();
                    }
                },
                cancel: {
                    text: "NE"
                }
            }
        });
    };

    AVAIL.rearrangeTeams = function () {
        //TODO: load programatically
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            raHtml,
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false
        );
    };



    /* S */

    AVAIL.selectSM = function (e) {
        window.scrollTo(0, 0);
        $(".s-item").removeClass("selected");
        $(e).addClass("selected");
        var width = window.innerWidth;
        if (width < 992) {
            $("#select").addClass("hidden");
            $("#d-back").removeClass("hidden");
        }
        $("#display").removeClass("hidden");
        showSmallLoading("#display");
        $ajaxUtils.sendGetRequest(
            "https://avail.azurewebsites.net/api/rezultat/podlageriMagacini?id=" + $(e).attr("value"),
            function (responseArray) {
                var html;
                if (responseArray.length == 0) {
                    html = `Podlager je prazan.`;
                } else {
                    for (var i = 0; i < responseArray.length; i++) {
                        html += `
                            <div class="d-item">
                                <div class="d-item-name">` + responseArray[i]["mn"] + `</div>
                                <div class="d-item-amount">` + responseArray[i]["ma"] + `&nbsp` + responseArray[i]["mu"] + `</div>
                            </div>
                        `;
                    }
                }
                document.querySelector("#display").innerHTML = html;
            },
            true
        );
    };

    AVAIL.selectS = function (e) {
        window.scrollTo(0, 0);
        $(".s-item").removeClass("selected");
        $(e).addClass("selected");
        var width = window.innerWidth;
        if (width < 992) {
            $("#select").addClass("hidden");
            $("#d-back").removeClass("hidden");
        }
        $("#display").removeClass("hidden");
        showSmallLoading("#display");
        $ajaxUtils.sendGetRequest(
            "https://avail.azurewebsites.net/api/rezultat/podlageriServiseri?id=" + $(e).attr("value"),
            function (responseArray) {
                var html;
                if (responseArray.length == 0) {
                    html = `Podlager je prazan.`;
                } else {
                    for (var i = 0; i < responseArray.length; i++) {
                        html += `
                            <div class="d-item">
                                <div class="d-item-name">` + responseArray[i]["mn"] + `</div>
                                <div class="d-item-amount">` + responseArray[i]["ma"] + `&nbsp` + responseArray[i]["mu"] + `</div>
                            </div>
                        `;
                    }
                }
                document.querySelector("#display").innerHTML = html;
            },
            true
        );
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
