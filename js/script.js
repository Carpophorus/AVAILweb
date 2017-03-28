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
	var bp = {};

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

	bp.loadT = function () {
		window.scrollTo(0,0);
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
		// if (history.state.state != 1) history.pushState({state: 1}, null, null);
		// window.scrollTo(0,0);
	};

	bp.loadS = function () {
		window.scrollTo(0,0);
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
	};

	bp.loadN = function () {
		window.scrollTo(0,0);
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
	};

	bp.loadP = function () {
		window.scrollTo(0,0);
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

	//TODO: uncomment after development is finished
	/*
	document.addEventListener("DOMContentLoaded", function (event) {
		bp.loadT();
	});
	*/

	bp.selectS = function (selected_div) {
		$(".s-item").removeClass("selected");
		$(selected_div).addClass("selected");
		var width = window.innerWidth;
		if (width < 992) {
			$("#select").addClass("hidden");
			$("#d-back").removeClass("hidden");
			scrollTo(0, 0);
		}
		$("#display").removeClass("hidden");
	};

	bp.backD = function () {
		$("#select").removeClass("hidden");
		$("#display").addClass("hidden");
		$("#d-back").addClass("hidden");
		scrollTo(0, 0);
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

	// bp.loadHome = function () {
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

	// bp.loadRegister = function () {
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

	// bp.loadNews = function () {
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

	// bp.loadAbout = function () {
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

	// bp.loadContact = function () {
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

	// bp.loadPiece = function (articleNumber) {
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

	global.$bp = bp;
})(window);