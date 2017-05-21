// TODO:

// implement browser history
// add bearer tokens for api calls



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
                true /*, AVAIL.bearer*/
            );
        } else if (AVAIL.techniciansArray == null || AVAIL.techniciansDirty) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/serviseri",
                function (responseArray) {
                    AVAIL.techniciansArray = responseArray;
                    AVAIL.techniciansDirty = false;
                    AVAIL.loadT();
                },
                true /*, AVAIL.bearer*/
            );
        } else if (AVAIL.vehiclesArray == null || AVAIL.vehiclesDirty) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/vozila",
                function (responseArray) {
                    AVAIL.vehiclesArray = responseArray;
                    AVAIL.vehiclesDirty = false;
                    AVAIL.loadT();
                },
                true /*, AVAIL.bearer*/
            );
        } else {
            var html = `
                <div id="bckgrnd"></div>
                <div class="row" id="t">
                    <div class="col-lg-6 col-md-6 left" id="teams">
            `;
            for (var i = 0; i < AVAIL.teamsArray.length; i++) {
                var teamName = AVAIL.teamsArray[i]["name"];
                var teamID = AVAIL.teamsArray[i]["idTeam"];
                var teamExists = false;
                for (var j = 0; j < AVAIL.techniciansArray.length; j++) {
                    if (AVAIL.techniciansArray[j]["idTeam"] == teamID) {
                        teamExists = true;
                        break;
                    }
                }
                if (teamExists) {
                    var registration = "";
                    var model = "";
                    for (var k = 0; k < AVAIL.vehiclesArray.length; k++) {
                        if (AVAIL.vehiclesArray[k]["idTeam"] == teamID) {
                            registration = AVAIL.vehiclesArray[k]["registration"];
                            model = AVAIL.vehiclesArray[k]["model"];
                            break;
                        }
                    }
                    html += `
                        <div id="team-container-outer">
                            <div id="team-container">
                                <div id="team-name" value="` + teamID + `"><span>` + teamName + `</span></div>
                                <div id="team-vehicle">
                                    <span>` + registration + `<br><span class="hidden-sm hidden-xs">` + model + `</span></span>
                                </div>
                                <div id="toggle-details-team" onClick="$AVAIL.toggleTeamDetails(this);">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                                <div id="toggle-gps" onClick="$AVAIL.toggleTeamVehicleLocation(this);">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                                <div id="new-assignment" onClick="$AVAIL.newTeamAssignment(this, '` + teamName + `');">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                            </div>
                            <div class="hidden" id="team-members">
                    `;
                    for (var k = 0; k < AVAIL.techniciansArray.length; k++) {
                        if (AVAIL.techniciansArray[k]["idTeam"] == teamID) {
                            html += `
                                <div id="team-member" value="` + AVAIL.techniciansArray[k]["idTechnician"] + `">
                                    ` + AVAIL.techniciansArray[k]["name"] + `
                                    <div id="toggle-details-team" onClick="$AVAIL.toggleTeamMemberDetails(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                    <div id="toggle-gps" onClick="$AVAIL.toggleTeamMemberLocation(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                    <div id="new-assignment" onClick="$AVAIL.newPersonalAssignment(this, '` + AVAIL.techniciansArray[k]["name"] + `');">
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
                                <div id="new-assignment" onClick="$AVAIL.newTeamAssignment(this, '&#9670;');">
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
                                    <div id="new-assignment" onClick="$AVAIL.newPersonalAssignment(this, '` + AVAIL.techniciansArray[i]["name"] + `');">
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
                        <button id="button-teams" onclick="$AVAIL.loadRA()">PRERASPODELA</button>
                    </div>
                    <div class="col-lg-6 col-md-6 right hidden" id="map"></div>
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
                true /*, AVAIL.bearer*/
            );
        } else if (AVAIL.warehousesArray == null) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/magacini",
                function (responseArray) {
                    AVAIL.warehousesArray = responseArray;
                    AVAIL.loadS();
                },
                true /*, AVAIL.bearer*/
            );
        } else {
            var html = `
                <div id="bckgrnd"></div>
                <div class="row" id="s">
                    <div class="col-lg-6 col-md-6 left row" id="select">
            `;
            for (var i = 0; i < AVAIL.warehousesArray.length; i++) {
                html += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 s-item" onclick="$AVAIL.selectS(this, 0)" value="` + AVAIL.warehousesArray[i]["idWarehouse"] + `">` + AVAIL.warehousesArray[i]["name"] + `</div>`;
            }
            if (AVAIL.techniciansArray.length > 0) {
                html += `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="underline"></div>`;
            }
            for (var i = 0; i < AVAIL.techniciansArray.length; i++) {
                html += `<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 s-item" onclick="$AVAIL.selectS(this, 1)" value="` + AVAIL.techniciansArray[i]["idTechnician"] + `">` + AVAIL.techniciansArray[i]["name"] + `</div>`;
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
            "https://avail.azurewebsites.net/api/rezultat/nepotvrdjeniRadniNalozi",
            function (responseArray) {
                var html;
                if (responseArray.length == 0) {
                    html = `
                        <div id="bckgrnd"></div>
                        <div class="row" id="n">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align: center; padding-top: 65px; color: rgba(255, 255, 255, 0.18)">Nema nepotvrđenih radnih naloga.</div>
                        </div>
                    `;
                } else {
                    html = `
                        <div id="bckgrnd"></div>
                        <div class="row" id="n">
                    `;
                    for (var i = 0; i < responseArray.length; i++) {
                        var date = new Date(Date.parse(responseArray[i]["dueTime"]));
                        var dueTimeString = "" + ((date.getDate() < 10) ? "0" : "") + date.getDate() + "." + ((date.getMonth() + 1 < 10) ? "0" : "") + (date.getMonth() + 1) + "." + date.getFullYear() + ". " + ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
                        date = new Date(Date.parse(responseArray[i]["startTime"]));
                        var startTimeString = "" + ((date.getDate() < 10) ? "0" : "") + date.getDate() + "." + ((date.getMonth() + 1 < 10) ? "0" : "") + (date.getMonth() + 1) + "." + date.getFullYear() + ". " + ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
                        date = new Date(Date.parse(responseArray[i]["endTime"]));
                        var endTimeString = "" + ((date.getDate() < 10) ? "0" : "") + date.getDate() + "." + ((date.getMonth() + 1 < 10) ? "0" : "") + (date.getMonth() + 1) + "." + date.getFullYear() + ". " + ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
                        html += `
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div class="status-` + responseArray[i]["status"] + `" id="nn">
                                    <span id="idA">` + responseArray[i]["idAssignment"] + `</span>
                                    <br class="hidden-lg hidden-md"><span id="cn">` + responseArray[i]["name"] + `</span>
                                    <br class="hidden-lg hidden-md"><span id="tn">` + responseArray[i]["tn"] + `</span>
                                    <div id="toggle-details" onClick="$AVAIL.toggleDetails(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                    <div id="toggle-materials" onClick="$AVAIL.toggleMaterials(this);">
                                        <div class="toggle-off" id="n-img"></div>
                                    </div>
                                    <div id="toggle-done" onClick="$AVAIL.toggleDone(this);">
                                        <div id="n-img"></div>
                                    </div>
                                </div>
                                <div class="row hidden" id="details">
                                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <strong>Klijent:</strong>
                                        <br>
                                        <div class="indented">` + responseArray[i]["name"] + `<br>` + responseArray[i]["address"] + `</div>
                                        ` + ((responseArray[i]["description"] != null && responseArray[i]["description"] != "" && responseArray[i]["description"] != "null") ? (`
                                        <br><strong>Napomena: </strong>
                                        <br>
                                        <div class="indented">` + responseArray[i]["description"] + `</div>`) : ``) + `
                                        <br><strong>Zakazano vreme:</strong>
                                        <br>
                                        <div class="indented">` + dueTimeString + `</div>
                                        <br><strong>Kratak opis:</strong>
                                        <br>
                                        <div class="indented">` + responseArray[i]["shortDesc"] + `</div>
                                        <br><strong>Detaljan opis:</strong>
                                        <br>
                                        <div class="indented">` + responseArray[i]["longDesc"] + `</div>
                                    </div>
                                    <div class="hidden-lg hidden-md col-sm-12 col-xs-12">&nbsp;</div>
                                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <strong>Serviser:</strong>
                                        <br>
                                        <div class="indented">` + responseArray[i]["tn"] + `</div>
                                        <br><strong>Vreme početka:</strong>
                                        <br>
                                        <div class="indented">` + startTimeString + `</div>
                                        <br><strong>Vreme kraja:</strong>
                                        <br>
                                        <div class="indented">` + endTimeString + `</div>
                                        <br><strong>Lokacija početka:</strong>
                                        <br>
                                        <div class="indented">` + ((responseArray[i]["startLat"]) ? responseArray[i]["startLat"].toFixed(5) : "0") + ((responseArray[i]["startLat"] >= 0) ? `N&nbsp;` : `S&nbsp;`) + ((responseArray[i]["startLon"]) ? responseArray[i]["startLon"].toFixed(5) : "0") + ((responseArray[i]["startLon"] >= 0) ? `E&nbsp;` : `W&nbsp;`) + `</div>
                                        <br><strong>Lokacija kraja:</strong>
                                        <br>
                                        <div class="indented">` + ((responseArray[i]["endLat"]) ? responseArray[i]["endLat"].toFixed(5) : "0") + ((responseArray[i]["endLat"] >= 0) ? `N&nbsp;` : `S&nbsp;`) + ((responseArray[i]["endLon"]) ? responseArray[i]["endLon"].toFixed(5) : "0") + ((responseArray[i]["endLon"] >= 0) ? `E&nbsp;` : `W&nbsp;`) + `</div>
                                        ` + ((responseArray[i]["comment"] != null && responseArray[i]["comment"] != "" && responseArray[i]["comment"] != "null") ? (`
                                        <br><strong>Napomena:</strong>
                                        <br>
                                        <div class="indented">` + responseArray[i]["comment"] + `</div>`) : ``) + `
                                    </div>
                                </div>
                                <div class="row hidden" id="materials">
                                </div>
                            </div>
                        `;
                    }
                    html += `
                        </div>
                    `;
                }
                document.querySelector("#main-content").innerHTML = html;
            },
            true /*, AVAIL.bearer*/
        );
    };

    AVAIL.currentSearch = 0;
    AVAIL.technicianID = 0;

    AVAIL.loadP = function () {
        window.scrollTo(0, 0);
        showLoading("#main-content");
        $("#menu-item-1").removeClass("tab-indicator");
        $("#menu-item-2").removeClass("tab-indicator");
        $("#menu-item-3").removeClass("tab-indicator");
        $("#menu-item-4").addClass("tab-indicator");
        if (AVAIL.techniciansArray == null) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/serviseri",
                function (responseArray) {
                    AVAIL.techniciansArray = responseArray;
                    AVAIL.loadP();
                },
                true /*, AVAIL.bearer*/
            );
        } else {
            AVAIL.currentSearch = 0;
            AVAIL.technicianID = 0;
            var html = `
                <div id="bckgrnd"></div>
                <div id="p">
                    <div class="row" id="search-bar">
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" id="search-type">
                            <input id="types-search" type="search" list="search-types" placeholder="Vrsta pretrage" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Vrsta pretrage'" oninput="$AVAIL.typesSearch(this)">
                            <datalist id="search-types">
                                <option value="Učinak servisera"><div value="1" id="val"></div></option>
                            </datalist>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 hidden" id="search-name">
                            <input id="names-search" type="search" list="search-names" placeholder="Ime servisera" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Ime servisera'" oninput="$AVAIL.namesSearch(this)">
                            <datalist id="search-names">
            `;
            for (var i = 0; i < AVAIL.techniciansArray.length; i++) {
                html += `<option value="` + AVAIL.techniciansArray[i]["name"] + `"><div value="` + AVAIL.techniciansArray[i]["idTechnician"] + `" id="val"></div></option>`;
            }
            html += `
                            </datalist>
                        </div>
                        <div class="col-md-3 hidden-lg hidden-sm hidden-xs"></div>
                        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 row hidden" id="search-button">
                            <button class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="button-search" onclick="$AVAIL.searchClick()">
                                <div id="search-icon"></div>&nbsp;&nbsp;&nbsp;PRETRAGA
                            </button>
                        </div>
                    </div>
                    <div class="hidden" id="results">
                        <div class="hidden" id="results1">
                        </div>
                    </div>
                    <div class="hidden" id="p-back" onclick="$AVAIL.backP()"></div>
                </div>
            `;
            document.querySelector("#main-content").innerHTML = html;
        }
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
                var time = responseArray[0].timeLKL ? responseArray[0].timeLKL : "2017-01-01T00:00:00.00";
                var lat = responseArray[0].latLKL ? responseArray[0].latLKL : 51.523765;
                var lon = responseArray[0].lonLKL ? responseArray[0].lonLKL : -0.158612;
                var date = new Date(Date.parse(time));
                var timeString = "" + ((date.getDate() < 10) ? "0" : "") + date.getDate() + "." + ((date.getMonth() + 1 < 10) ? "0" : "") + (date.getMonth() + 1) + "." + date.getFullYear() + ". " + ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
                var html = `
                    <iframe src="https://maps.google.com/maps?q=` + lat + `,` + lon + `&z=15&output=embed" width="100%" height="450"></iframe>
                    <div id="map-info">
                        <span>` + $(e).parent().text() + ((width < 992) ? `</span><br>` : `</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;`) + Math.abs(lat).toFixed(5) + ((lat >= 0) ? `N ` : `S `) + Math.abs(lon).toFixed(5) + ((lon >= 0) ? `E` : `W`) + ((width < 992) ? `<br>` : `&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;`) + timeString +
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
                AVAIL.datetimeString = "" + monthString + "/" + dayString + "/" + yearString + " " + hoursString + ":" + minutesString + ":" + secondsString;
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
                    <div class="row">
                        <div class="col-lg-6 col-md-6 hidden-sm hidden-xs"></div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 small-left">
                            <button id="button-canceltask" onclick="$AVAIL.cancelNA()">OTKAŽI</button>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 small-right">
                            <button id="button-addtask" onclick="$AVAIL.makeNA()">NAPRAVI</button>
                        </div>
                    </div>
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
    AVAIL.taskRecipient;
    AVAIL.isTeamTask;

    AVAIL.newPersonalAssignment = function (e, name) {
        AVAIL.assignedClient = 0;
        AVAIL.assignedLocation = 0;
        AVAIL.loadNA();
        AVAIL.assignmentArray = [];
        AVAIL.assignmentArray.push($(e).parent().attr("value"));
        AVAIL.taskRecipient = name;
        AVAIL.isTeamTask = false;
    };

    AVAIL.newTeamAssignment = function (e, name) {
        AVAIL.assignedClient = 0;
        AVAIL.assignedLocation = 0;
        AVAIL.loadNA();
        AVAIL.assignmentArray = [];
        var selector = $(e).parent().parent().find("#team-members").children();
        selector.each(function () {
            AVAIL.assignmentArray.push($(this).attr("value"));
        });
        AVAIL.taskRecipient = name;
        AVAIL.isTeamTask = true;
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
                return;
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
                return;
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
                content: "Da li želite da napravite zadatak za " + ((AVAIL.isTeamTask) ? "odabrani tim?" : "odabranog servisera?") + "<br><br>&bull; " + AVAIL.taskRecipient,
                buttons: {
                    cancel: {
                        text: "NE"
                    },
                    confirm: {
                        text: "DA",
                        btnClass: "btn-red",
                        action: function () {
                            $ajaxUtils.sendPostRequest(
                                "https://avail.azurewebsites.net/api/rezultat/noviZadatak?id=" + AVAIL.assignedClient + "&timestring=" + encodeURIComponent(AVAIL.datetimeString) + "&shortDescString=" + encodeURIComponent(document.getElementById("short-desc").value) + ((document.getElementById("long-desc").value == "") ? "" : ("&longDescString=" + encodeURIComponent(document.getElementById("long-desc").value))) + ((AVAIL.assignedLocation == 0) ? "" : ("&id1=" + AVAIL.assignedLocation)),
                                function (responseArray) {
                                    var newTaskID = responseArray[0]["new_i"];
                                    for (var i = 0; i < AVAIL.assignmentArray.length; i++) {
                                        $ajaxUtils.sendPostRequest(
                                            "https://avail.azurewebsites.net/api/rezultat/serviseriZadaci?id=" + newTaskID + "&id1=" + AVAIL.assignmentArray[i],
                                            function (responseArray) {},
                                            true /*, AVAIL.bearer*/
                                        );
                                    }
                                },
                                true /*, AVAIL.bearer*/
                            );
                            AVAIL.loadT();
                        }
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
                cancel: {
                    text: "NE"
                },
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        AVAIL.loadT();
                    }
                }
            }
        });
    };

    AVAIL.techniciansDirty = false;
    AVAIL.vehiclesDirty = false;
    AVAIL.techniciansArrayCopy;
    AVAIL.vehiclesArrayCopy;

    AVAIL.loadRA = function () {
        window.scrollTo(0, 0);
        showLoading("#main-content");
        if (AVAIL.techniciansArray == null || AVAIL.techniciansDirty) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/serviseri",
                function (responseArray) {
                    AVAIL.techniciansArray = responseArray;
                    AVAIL.techniciansDirty = false;
                    AVAIL.loadRA();
                },
                true /*, AVAIL.bearer*/
            );
        } else if (AVAIL.vehiclesArray == null || AVAIL.vehiclesDirty) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/vozila",
                function (responseArray) {
                    AVAIL.vehiclesArray = responseArray;
                    AVAIL.vehiclesDirty = false;
                    AVAIL.loadRA();
                },
                true /*, AVAIL.bearer*/
            );
        } else if (AVAIL.teamsArray == null) {
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/timovi",
                function (responseArray) {
                    AVAIL.teamsArray = responseArray;
                    AVAIL.loadRA();
                },
                true /*, AVAIL.bearer*/
            );
        } else {
            AVAIL.pendingDeletion = 0;
            AVAIL.pendingDeletionName = "";
            var optionsWithoutUnassigned = "";
            AVAIL.techniciansArrayCopy = JSON.parse(JSON.stringify(AVAIL.techniciansArray));
            AVAIL.vehiclesArrayCopy = JSON.parse(JSON.stringify(AVAIL.vehiclesArray));
            for (var i = 0; i < AVAIL.teamsArray.length; i++) {
                optionsWithoutUnassigned += "<option value='" + AVAIL.teamsArray[i]["name"] + "'><div value='" + AVAIL.teamsArray[i]["idTeam"] + "' x='" + i + "' id='team-val'></div></option>";
            }
            var optionsWithUnassigned = "<option value='&#9670;'><div value='0' x='-1' id='team-val'></div></option>" + optionsWithoutUnassigned;
            var html = `
                <div id="bckgrnd"></div>
                <div class="row" id="ra">
                    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                        <input type="text" id="new-team-name" placeholder="Ime novog tima" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Ime novog tima'">
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <button id="add-team-button" onCLick="$AVAIL.addTeam()">&nbsp;</button>
                    </div>
                    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                        <input id="team-select" type="search" list="team-selection-w" placeholder="Tim za brisanje" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tim za brisanje'" oninput="$AVAIL.teamDeletePending(this)">
                        <datalist id="team-selection-w">
                            ` + optionsWithoutUnassigned + `
                        </datalist>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <button id="delete-team-button" onCLick="$AVAIL.deleteTeam()">&nbsp;</button>
                    </div>
                    <datalist id="team-selection">
                        ` + optionsWithUnassigned + `
                    </datalist>
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="changes-container">
                            <div id="changes-title">
                                ZAPOSLENI
                                <div id="toggle-reset" onClick="$AVAIL.resetTechnicians();">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                            </div>
                            <div id="changes-items" class="row">
            `;
            for (var i = 0; i < AVAIL.techniciansArray.length; i++) {
                var placeholder;
                if (AVAIL.techniciansArray[i]["idTeam"] == null) {
                    placeholder = String.fromCharCode(9670);
                } else {
                    for (var j = 0; j < AVAIL.teamsArray.length; j++) {
                        if (AVAIL.techniciansArray[i]["idTeam"] == AVAIL.teamsArray[j]["idTeam"]) {
                            placeholder = AVAIL.teamsArray[j]["name"];
                            break;
                        }
                    }
                }
                html += `
                                <div id="changes-item" class="col-lg-6 col-md-6 col-sm-12 col-xs-12 row">
                                    <div id="changes-item-name" class="col-lg-6 col-md-6 col-sm-6 col-xs-6" value="` + AVAIL.techniciansArray[i]["idTechnician"] + `" x="` + i + `">` + AVAIL.techniciansArray[i]["name"] + `</div>
                                    <div id="changes-item-dropdown" class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <input id="team-select" type="search" list="team-selection" oninput="$AVAIL.techniciansUpdate(this)" placeholder="` + placeholder + `">
                                    </div>
                                </div>
                `;
            }
            html += `
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="changes-container">
                            <div id="changes-title">
                                VOZILA
                                <div id="toggle-reset" onClick="$AVAIL.resetVehicles();">
                                    <div class="toggle-off" id="n-img"></div>
                                </div>
                            </div>
                            <div id="changes-items" class="row">
            `;
            for (var i = 0; i < AVAIL.vehiclesArray.length; i++) {
                var placeholder;
                if (AVAIL.vehiclesArray[i]["idTeam"] == null) {
                    placeholder = String.fromCharCode(9670);
                } else {
                    for (var j = 0; j < AVAIL.teamsArray.length; j++) {
                        if (AVAIL.vehiclesArray[i]["idTeam"] == AVAIL.teamsArray[j]["idTeam"]) {
                            placeholder = AVAIL.teamsArray[j]["name"];
                            break;
                        }
                    }
                }
                html += `
                                <div id="changes-item" class="col-lg-6 col-md-6 col-sm-12 col-xs-12 row">
                                    <div id="changes-item-name" class="col-lg-6 col-md-6 col-sm-6 col-xs-6" value="` + AVAIL.vehiclesArray[i]["idVehicle"] + `" x="` + i + `">` + AVAIL.vehiclesArray[i]["registration"] + ` <span>` + AVAIL.vehiclesArray[i]["model"] + `</span></div>
                                    <div id="changes-item-dropdown" class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <input id="team-select" type="search" list="team-selection" oninput="$AVAIL.vehiclesUpdate(this)" placeholder="` + placeholder + `">
                                    </div>
                                </div>
                `;
            }
            html += `
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 hidden-sm hidden-xs" id="ra-last"></div>
                    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" id="ra-last-chg">
                        <button id="button-cancelra" onclick="$AVAIL.cancelRA()">OTKAŽI</button>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" id="ra-last">
                            <button id="button-teams-change" onclick="$AVAIL.makeRA()">IZMENI</button>
                    </div>
                </div>
            `;
            document.querySelector("#main-content").innerHTML = html;
        }
    };

    AVAIL.resetCounter = 0;

    AVAIL.resetTechnicians = function () {
        $.confirm({
            title: "POTVRDA AKCIJE",
            content: "Da li želite da resetujete timove za servisere?",
            buttons: {
                cancel: {
                    text: "NE"
                },
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        window.scrollTo(0, 0);
                        showLoading("#main-content");
                        AVAIL.resetCounter = 0;
                        for (var i = 0; i < AVAIL.techniciansArray.length; i++) {
                            $ajaxUtils.sendPostRequest(
                                "https://avail.azurewebsites.net/api/rezultat/resetTimoviServiseri?id=" + AVAIL.techniciansArray[i]["idTechnician"],
                                function (responseArray) {
                                    AVAIL.resetCounter++;
                                    if (AVAIL.resetCounter == AVAIL.techniciansArray.length) {
                                        AVAIL.techniciansArray = null;
                                        AVAIL.loadRA();
                                    }
                                },
                                true /*, AVAIL.bearer*/
                            );
                        }
                    }
                }
            }
        });
    }

    AVAIL.resetVehicles = function () {
        $.confirm({
            title: "POTVRDA AKCIJE",
            content: "Da li želite da resetujete timove za vozila?",
            buttons: {
                cancel: {
                    text: "NE"
                },
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        window.scrollTo(0, 0);
                        showLoading("#main-content");
                        AVAIL.resetCounter = 0;
                        for (var i = 0; i < AVAIL.vehiclesArray.length; i++) {
                            $ajaxUtils.sendPostRequest(
                                "https://avail.azurewebsites.net/api/rezultat/resetTimoviVozila?id=" + AVAIL.vehiclesArray[i]["idVehicle"],
                                function (responseArray) {
                                    AVAIL.resetCounter++;
                                    if (AVAIL.resetCounter == AVAIL.vehiclesArray.length) {
                                        AVAIL.vehiclesArray = null;
                                        AVAIL.loadRA();
                                    }
                                },
                                true /*, AVAIL.bearer*/
                            );
                        }
                    }
                }
            }
        });
    }

    AVAIL.addTeam = function () {
        $.confirm({
            title: "POTVRDA AKCIJE",
            content: "Da li želite da napravite novi tim \"" + $("#new-team-name").val() + "\"?",
            buttons: {
                cancel: {
                    text: "NE"
                },
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        $ajaxUtils.sendPostRequest(
                            "https://avail.azurewebsites.net/api/rezultat/NoviTim?name=" + $("#new-team-name").val(),
                            function (responseArray) {
                                AVAIL.teamsArray = null;
                                AVAIL.loadRA();
                            },
                            true /*, AVAIL.bearer*/
                        );
                    }
                }
            }
        });
    }

    AVAIL.pendingDeletion = 0;
    AVAIL.pendingDeletionName = "";

    AVAIL.teamDeletePending = function (e) {
        var val = e.value;
        if (val == "") {
            AVAIL.pendingDeletion = 0;
            AVAIL.pendingDeletionName = "";
            return;
        }
        $('#team-selection-w option').each(function () {
            if (this.value.toUpperCase() === val.toUpperCase()) {
                AVAIL.pendingDeletion = $(this).find("#team-val").attr("value");
                AVAIL.pendingDeletionName = val;
                return;
            }
        });
    }

    AVAIL.deleteTeam = function () {
        if (AVAIL.pendingDeletion == 0) return;
        $.confirm({
            title: "POTVRDA AKCIJE",
            content: "Da li želite da izbrišete tim \"" + AVAIL.pendingDeletionName + "\"? Članovi tog tima postaće neraspodeljeni.",
            buttons: {
                cancel: {
                    text: "NE"
                },
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        window.scrollTo(0, 0);
                        showLoading("#main-content");
                        $ajaxUtils.sendPostRequest(
                            "https://avail.azurewebsites.net/api/rezultat/obrisiTim?id=" + AVAIL.pendingDeletion,
                            function (responseArray) {
                                AVAIL.teamsArray = null;
                                AVAIL.techniciansArray = null;
                                AVAIL.loadRA();
                            },
                            true /*, AVAIL.bearer*/
                        );
                    }
                }
            }
        });
    }

    AVAIL.techniciansUpdate = function (e) {
        var val = e.value;
        if (val == "") {
            var indexTech = $(e).parent().parent().find("#changes-item-name").attr("x");
            AVAIL.techniciansArray[indexTech]["idTeam"] = AVAIL.techniciansArrayCopy[indexTech]["idTeam"];
            return;
        }
        $('#team-selection option').each(function () {
            if (this.value.toUpperCase() === val.toUpperCase()) {
                var teamID = $(this).find("#team-val").attr("value");
                if (teamID == 0) teamID = null;
                var indexTech = $(e).parent().parent().find("#changes-item-name").attr("x");
                AVAIL.techniciansArray[indexTech]["idTeam"] = teamID;
                AVAIL.techniciansDirty = true;
                return;
            }
        });
    }

    AVAIL.vehiclesUpdate = function (e) {
        var val = e.value;
        if (val == "") {
            var indexVeh = $(e).parent().parent().find("#changes-item-name").attr("x");
            AVAIL.vehiclesArray[indexVeh]["idTeam"] = AVAIL.vehiclesArrayCopy[indexVeh]["idTeam"];
            return;
        }
        $('#team-selection option').each(function () {
            if (this.value.toUpperCase() === val.toUpperCase()) {
                var teamID = $(this).find("#team-val").attr("value");
                if (teamID == 0) teamID = null;
                var indexVeh = $(e).parent().parent().find("#changes-item-name").attr("x");
                AVAIL.vehiclesArray[indexVeh]["idTeam"] = teamID;
                AVAIL.vehiclesDirty = true;
                return;
            }
        });
    }

    AVAIL.cancelRA = function () {
        $.confirm({
            title: "POTVRDA AKCIJE",
            content: "Da li želite da odbacite izmene?",
            buttons: {
                cancel: {
                    text: "NE"
                },
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        AVAIL.loadT();
                    }
                }
            }
        });
    }

    AVAIL.makeRATechCounter;
    AVAIL.makeRAVehCounter;
    AVAIL.makeRATotal;

    AVAIL.makeRA = function () {
        if (!(AVAIL.techniciansDirty) && !(AVAIL.vehiclesDirty)) return;
        $.confirm({
            title: "POTVRDA AKCIJE",
            content: "Da li želite da izmenite sastav timova?",
            buttons: {
                cancel: {
                    text: "NE"
                },
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        AVAIL.makeRATechCounter = 0;
                        AVAIL.makeRAVehCounter = 0;
                        AVAIL.makeRATotal = ((AVAIL.techniciansDirty) ? AVAIL.techniciansArray.length : 0) + ((AVAIL.vehiclesDirty) ? AVAIL.vehiclesArray.length : 0);
                        if (AVAIL.techniciansDirty) {
                            for (var i = 0; i < AVAIL.techniciansArray.length; i++) {
                                if (AVAIL.techniciansArray[i]["idTeam"] != null) {
                                    $ajaxUtils.sendPostRequest(
                                        "https://avail.azurewebsites.net/api/rezultat/serviseriTimovi?id=" + AVAIL.techniciansArray[i]["idTeam"] + "&id1=" + AVAIL.techniciansArray[i]["idTechnician"],
                                        function (responseArray) {
                                            AVAIL.makeRATechCounter++;
                                            if (AVAIL.makeRATechCounter + AVAIL.makeRAVehCounter == AVAIL.makeRATotal) {
                                                AVAIL.techniciansDirty = false;
                                                AVAIL.vehiclesDirty = false;
                                                AVAIL.loadT();
                                            }
                                        },
                                        true /*, AVAIL.bearer*/
                                    );
                                } else {
                                    $ajaxUtils.sendPostRequest(
                                        "https://avail.azurewebsites.net/api/rezultat/resetTimoviServiseri?id=" + AVAIL.techniciansArray[i]["idTechnician"],
                                        function (responseArray) {
                                            AVAIL.makeRATechCounter++;
                                            if (AVAIL.makeRATechCounter + AVAIL.makeRAVehCounter == AVAIL.makeRATotal) {
                                                AVAIL.techniciansDirty = false;
                                                AVAIL.vehiclesDirty = false;
                                                AVAIL.loadT();
                                            }
                                        },
                                        true /*, AVAIL.bearer*/
                                    );
                                }
                            }
                        }
                        if (AVAIL.vehiclesDirty) {
                            for (var i = 0; i < AVAIL.vehiclesArray.length; i++) {
                                if (AVAIL.vehiclesArray[i]["idTeam"] != null) {
                                    $ajaxUtils.sendPostRequest(
                                        "https://avail.azurewebsites.net/api/rezultat/vozilaTimovi?id=" + AVAIL.vehiclesArray[i]["idTeam"] + "&id1=" + AVAIL.vehiclesArray[i]["idVehicle"],
                                        function (responseArray) {
                                            AVAIL.makeRAVehCounter++;
                                            if (AVAIL.makeRATechCounter + AVAIL.makeRAVehCounter == AVAIL.makeRATotal) {
                                                AVAIL.techniciansDirty = false;
                                                AVAIL.vehiclesDirty = false;
                                                AVAIL.loadT();
                                            }
                                        },
                                        true /*, AVAIL.bearer*/
                                    );
                                } else {
                                    $ajaxUtils.sendPostRequest(
                                        "https://avail.azurewebsites.net/api/rezultat/resetTimoviVozila?id=" + AVAIL.vehiclesArray[i]["idVehicle"],
                                        function (responseArray) {
                                            AVAIL.makeRAVehCounter++;
                                            if (AVAIL.makeRATechCounter + AVAIL.makeRAVehCounter == AVAIL.makeRATotal) {
                                                AVAIL.techniciansDirty = false;
                                                AVAIL.vehiclesDirty = false;
                                                AVAIL.loadT();
                                            }
                                        },
                                        true /*, AVAIL.bearer*/
                                    );
                                }
                            }
                        }
                    }
                }
            }
        });
    }



    /* S */

    AVAIL.selectS = function (e, b) {
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
            ((b) ? ("https://avail.azurewebsites.net/api/rezultat/podlageriServiseri?id=" + $(e).attr("value")) : ("https://avail.azurewebsites.net/api/rezultat/podlageriMagacini?id=" + $(e).attr("value"))),
            function (responseArray) {
                var html;
                if (responseArray.length == 0) {
                    html = `<div style="text-align: center; padding-top: 50px; color: rgba(255, 255, 255, 0.18)">Podlager je prazan.</div>`;
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
            true /*, AVAIL.bearer*/
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
        if (!$.trim($(e).parent().parent().find("#materials").html()).length) {
            $(e).parent().parent().find("#materials").html("<div class='loader-small' style='padding-top: 61px; padding-bottom: 61px'></div>");
            $ajaxUtils.sendGetRequest(
                "https://avail.azurewebsites.net/api/rezultat/potroseniMaterijalPoRadnomNalogu?id=" + $(e).parent().find("#idA").text(),
                function (responseArray) {
                    var html;
                    if (responseArray.length == 0) {
                        html = `<div style="text-align: center; padding-top: 50px; padding-bottom: 50px; color: rgba(255, 255, 255, 0.18)">Nema potrošenog materijala.</div>`;
                    } else {
                        for (var i = 0; i < responseArray.length; i++) {
                            html += `
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row" id="material">
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" id="material-name">
                                    <strong>` + responseArray[i]["mn"] + `</strong>
                                </div>
                                <div class="hidden-lg hidden-md col-sm-12 col-xs-12">&nbsp;</div>
                                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" id="material-amount">
                                    ` + responseArray[i]["ma"] + ` ` + responseArray[i]["mu"] + `
                                </div>
                            </div>
                        `;
                        }
                    }
                    $(e).parent().parent().find("#materials").html(html);
                },
                true /*, AVAIL.bearer*/
            );
        }
    };

    AVAIL.toggleDone = function (e) {
        $.confirm({
            title: "POTVRDA AKCIJE",
            content: "Da li želite da završite obradu radnog naloga " + $(e).parent().find("#idA").text() + "?",
            buttons: {
                cancel: {
                    text: "NE"
                },
                confirm: {
                    text: "DA",
                    btnClass: "btn-red",
                    action: function () {
                        $(e).parent().parent().addClass("hidden");
                        $ajaxUtils.sendPostRequest(
                            "https://avail.azurewebsites.net/api/rezultat/potvrdaRadnogNaloga?id=" + $(e).parent().find("#idA").text(),
                            function (responseArray) {},
                            true /*, AVAIL.bearer*/
                        );
                    }
                }
            }
        });
    };



    /* P */

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
                var sum = responseArray[0].pending + responseArray[0].success + responseArray[0].failed + responseArray[0].partial + responseArray[0].cancelled;
                var html = `
                    <div id="r1title">
                        Pretraga učinka servisera:
                        <br><strong>` + responseArray[0].name + `</strong>
                    </div>
                    <div id="r1bar">
                        <div id="r1pending" style="width: ` + responseArray[0].pending / ((!sum) ? 1 : sum) * 100 + `%" ` + ((!(responseArray[0].pending)) ? `class="hidden"` : ``) + `></div>
                        <div id="r1success" style="width: ` + responseArray[0].success / ((!sum) ? 1 : sum) * 100 + `%" ` + ((!(responseArray[0].success)) ? `class="hidden"` : ``) + `></div>
                        <div id="r1partial" style="width: ` + responseArray[0].failed / ((!sum) ? 1 : sum) * 100 + `%" ` + ((!(responseArray[0].failed)) ? `class="hidden"` : ``) + `></div>
                        <div id="r1failed" style="width: ` + responseArray[0].partial / ((!sum) ? 1 : sum) * 100 + `%" ` + ((!(responseArray[0].partial)) ? `class="hidden"` : ``) + `></div>
                        <div id="r1cancelled" style="width: ` + responseArray[0].cancelled / ((!sum) ? 1 : sum) * 100 + `%" ` + ((!(responseArray[0].cancelled)) ? `class="hidden"` : ``) + `></div>
                    </div>
                    <div class="row" id="r1stats">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Nezapočetih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-pending"><span>` + (responseArray[0].pending / ((!sum) ? 1 : sum) * 100).toFixed(2) + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].pending + `/` + sum + `)</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Uspešnih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-success"><span>` + (responseArray[0].success / ((!sum) ? 1 : sum) * 100).toFixed(2) + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].success + `/` + sum + `)</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Delimičnih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-partial"><span>` + (responseArray[0].failed / ((!sum) ? 1 : sum) * 100).toFixed(2) + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].failed + `/` + sum + `)</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Neuspešnih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-failed"><span>` + (responseArray[0].partial / ((!sum) ? 1 : sum) * 100).toFixed(2) + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].partial + `/` + sum + `)</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-title">Otkazanih:</div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="r1stats-cancelled"><span>` + (responseArray[0].cancelled / ((!sum) ? 1 : sum) * 100).toFixed(2) + `%</span>&nbsp;&nbsp;&nbsp;(` + responseArray[0].cancelled + `/` + sum + `)</div>
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

    global.$AVAIL = AVAIL;

})(window);
