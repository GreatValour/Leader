const getUtmSourceByReferrer = () => {
	if(document.referrer) {
		const referrers = [
			{ "referrer": "www.google.com", "utmSource": "000100" },
			{ "referrer": "mail.google.com", "utmSource": "000101" },
			{ "referrer": "youtube.com", "utmSource": "000102" },
			{ "referrer": "bing.com", "utmSource": "000200" },
			{ "referrer": "yahoo.com", "utmSource": "000300" },
			{ "referrer": "linkedin.com", "utmSource": "000400" },
			{ "referrer": "yelp.com", "utmSource": "000500" },
			{ "referrer": "ask.com", "utmSource": "000600" },
			{ "referrer": "baidu.com", "utmSource": "000700" },
			{ "referrer": "facebook.com", "utmSource": "000800" },
			{ "referrer": "instagram.com", "utmSource": "000801" },
			{ "referrer": "reddit.com", "utmSource": "001000" },
			{ "referrer": "authorize.net", "utmSource": "001100" },
			{ "referrer": "bbb.org", "utmSource": "001200" },
			{ "referrer": "pcmag.com", "utmSource": "001300" },
			{ "referrer": "duckduckgo.com", "utmSource": "001400" },
			{ "referrer": "restaurantbusinessonline.com", "utmSource": "001500" },
			{ "referrer": "top10.com", "utmSource": "300101" },
			{ "referrer": "best10merchantservices.com", "utmSource": "300101" },
			{ "referrer": "toppaymentprocessing", "utmSource": "300102" },
			{ "referrer": "bestposonline.com", "utmSource": "300103" },
			{ "referrer": "comparisun.com", "utmSource": "300201" },
			{ "referrer": "getcreditcardprocessing.com", "utmSource": "300202" },
			{ "referrer": "compareguroo.com", "utmSource": "300401" },
			{ "referrer": "thetop10merchantservices.com", "utmSource": "300402" },
			{ "referrer": "best10creditcardprocessing.com", "utmSource": "300403" },
			{ "referrer": "creditcardprocessing.net", "utmSource": "300501" },
			{ "referrer": "business.com", "utmSource": "300701" },
			{ "referrer": "businessnewsdaily.com", "utmSource": "300801" },
			{ "referrer": "charge.com", "utmSource": "301200" },
			{ "referrer": "top-merchantservices.com", "utmSource": "301401" },
			{ "referrer": "sonary.com", "utmSource": "301402" },
			{ "referrer": "possibly.com", "utmSource": "301602" },
			{ "referrer": "merchantservices-usa.com", "utmSource": "301701" },
			{ "referrer": "topcreditcardprocessors.com", "utmSource": "301801" },
			{ "referrer": "topcomparizone.com", "utmSource": "302101" },
			{ "referrer": "best-ccp.com", "utmSource": "302101" },
			{ "referrer": "cardprocessingexperts.com", "utmSource": "302301" },
			{ "referrer": "websiteplanet.com", "utmSource": "302401" },
			{ "referrer": "cardpaymentoptions.com", "utmSource": "302801" },
			{ "referrer": "merchantmaverick.com", "utmSource": "302901" },
			{ "referrer": "x-cart.com", "utmSource": "303001" }
		];

		const match = referrers.find(element => document.referrer.indexOf(element.referrer) > 0);
		if(match) {
			return match.utmSource;
		}
	}

	return "";
}

const getOptanonConsent = (checkPerformanceSetting = null) => {
   	const optanonCookie = getCookie("OptanonConsent");
	return optanonCookie && (checkPerformanceSetting ? optanonCookie.match(checkPerformanceSetting) : true); // OneTrust Performance Cookies, section C0002;
}

const getCrUtmSource = (utmToPhone) => {
	if(getOptanonConsent("C0002:1")) {
		const urlParams = new URLSearchParams(window.location.search);
		if(urlParams.has("utm_source")) {
			return urlParams.get("utm_source");
		} else {
			if(getCookie("utm_source")) {
				return getCookie("utm_source");
			}
			else {
				let utmSource = getUtmSourceByReferrer();
				if(utmSource !== "") return utmSource;
			}
		}
	}

    return "000000";
}

const crSwapNumbers = () => {
    if(typeof(CallTrk) === "undefined") {
        $.getScript("//cdn.callrail.com/companies/537504724/83c252e5c691f6285068/12/swap.js");
    } else {
        CallTrk.swap();
    }
}

const trackCr = (trackedHrefSelector, trackedTextSelector) => {
    if(document.querySelectorAll(trackedHrefSelector).length === 0 && document.querySelectorAll(trackedTextSelector).length === 0) {
        return;
    }

    fetch(`${location.origin}/callrail-json/`, { method: "GET" })
    .then((response) => response.json())
    .then((response) => {
        const utmToPhone = response;
        if(!utmToPhone || Object.keys(utmToPhone).length === 0) {
        	return;
        }

        const utmSource = getCrUtmSource(utmToPhone);
        const phone = utmToPhone[utmSource] ? utmToPhone[utmSource] : utmToPhone["000000"];

        if(phone) {
            document.querySelectorAll(trackedHrefSelector).forEach(link => {
              	link.setAttribute("href", `tel:${phone.replace(/-/gi, "")}`);
            });

			document.querySelectorAll(trackedTextSelector).forEach(link => {
              	link.innerText = phone;
            });

            if(getOptanonConsent("C0002:1")) {
				setCookie("utm_source", utmSource, 30);
				setCookie("callRailsNumber", phone, 30);
              	crSwapNumbers();
            }
        }
    })
    .catch((error) => { });
}

const trackUrlParams = (utmFields) => {
	const urlParams = new URLSearchParams(window.location.search);

	utmFields.forEach(function(utmItem) {
		if(urlParams.has(utmItem)) {
			setCookie(utmItem, urlParams.get(utmItem), 30);
		}
	});
}

const isMobileDevice = () => {
	let isMobile = false;
	let userAgent = navigator.userAgent || navigator.vendor || window.opera;

	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent)
		|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0,4))) {
		isMobile = true;
	}

	return isMobile;
};

const manageCookies = () => {
	const urlParamsCookies = [
		'utm_campaign',
		'utm_content',
		'utm_source',
		'utm_medium',
		'utm_term',
		'keyword',
		'matchtype',
		'network',
		'utm_placement',
		'utm_site_source_name',
		'st'
	];

	if(getOptanonConsent("C0002:1")) {
		const mktForm = document.querySelector('.frame-type-form_formframework form');
		if(mktForm) {
			const mktFormId = mktForm.getAttribute('id');
            const hiddenId = mktFormId + '-MKT_WebformID';

            let MKTWebformID = null;
            if(document.getElementById(hiddenId)) {
                MKTWebformID = document.getElementById(hiddenId).value;
                mktForm.dataset.mktid = MKTWebformID;
            } else {
                if(mktForm.dataset.mktid) {
                    MKTWebformID = mktForm.dataset.mktid;
                }
            }

            if(MKTWebformID) {
			    setCookie("MKT_WebformID", MKTWebformID, 30);
            }
		}

		if (!getCookie('MKT_Brand')) {
			setCookie('MKT_Brand', 'LMS', 30);
		}

		setCookie('MKT_Device', isMobileDevice() ? 'M' : 'D', 30);

		trackUrlParams(urlParamsCookies);

	} else {
		const managedCookies =  urlParamsCookies.concat(['MKT_WebformID', 'MKT_Brand', 'MKT_Device', 'callRailsNumber']);
		managedCookies.forEach(cookieName => {
			deleteCookie(cookieName);
		});

		const managedCookiesByDomain = ['calltrk_fcid', 'calltrk_session_id', 'calltrk_landing', 'calltrk_referrer'];
		const domain = getDomain();
		managedCookiesByDomain.forEach(cookieName => {
			deleteCookieDomain(cookieName, domain);
		});

		const mktForm = document.querySelector('.frame-type-form_formframework form');
		if(mktForm) {
            const hiddenId = mktForm.getAttribute('id') + '-reverse_referrer';
			
			if(document.getElementById(hiddenId)) {
				let utmSource = getUtmSourceByReferrer();
				document.getElementById(hiddenId).value = utmSource ? utmSource : '000000';
			}
		}
	}

	if(getOptanonConsent("C0004:1")) {
		trackUrlParams(["gclid", "fbclid"]);
	} else {
		deleteCookie('gclid');
		deleteCookie('fbclid');
	}
}

const track = (trackInterval) => {
	//If Optanon cookie exists and is complete
	if(getCookie("OptanonConsent") && getCookie("OptanonConsent").match("C0002") && getCookie("OptanonConsent").match("C0004")) {
		clearInterval(trackInterval);
		manageCookies();

		trackCr(
			".phone2 a, .brand-phone a, .tab-content--footer-phone a, .brand-phone-mobile a, .header-top a, .messagebar__phone-link, .top-nav__phone-link, .hero__form-footer-phone a, .phone-track, .phone-track-href-only",
			".phone2 a, .brand-phone a, .tab-content--footer-phone a, .brand-phone-custom, .header-top a strong, .messagebar__phone-link, .top-nav__phone-link-text, .hero__form-footer-phone-text, .phone-track"
		);
	}
}

const trackWithOptanonCookie = () => {
	let trackInterval = null;

	if(!(getCookie("OptanonConsent") && getCookie("OptanonConsent").match("C0002") && getCookie("OptanonConsent").match("C0004"))) {
		//Optanon cookie does not yet exist or is incomplete so wait until Optanon generates its cookie
		let attempts = 1;

		trackInterval = setInterval(() => {
			attempts++;
			if(attempts === 10) {
				clearInterval(trackInterval);
			}
			track(trackInterval);
		}, 500);
	}

	track(trackInterval);
}

$(document).ready(function () {
	trackWithOptanonCookie();

	window.addEventListener("consent.onetrust", (e) => {
		trackWithOptanonCookie();
	});
});

function findGetParameter(parameterName) {
	var result = null,
		tmp = [];
	location.search
		.substr(1)
		.split("&")
		.forEach(function (item) {
			tmp = item.split("=");
			if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
		});
	return result;
}
// Get url params
var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};
// Set cookies
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
// delete cookies
function deleteCookie(name) {
	document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
// delete cookies per Domain
function deleteCookieDomain(name,domain) {
    document.cookie = name +'=; Path=/; domain=' + domain + ';Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

}
// Read cookies
const getCookie = (name) => {
    const a = "; ".concat(document.cookie).match(";\\s*".concat(name, "=([^;]+)"));
    return a ? unescape(a[1]) : false;
}

function getDomain() {
    var url = window.location.host;
    var subDomainParts = url.split('.');
    var subDomain= '';
    for (var i=subDomainParts.length-1; i > subDomainParts.length-3; i--) {
        subDomain = '.' + subDomainParts[i] + subDomain;
    }
    return subDomain;
}


// popup

let exitIntentPopup =  document.querySelector('.exit-intent-popup');

const exit = e => {
    const shouldExit =
        [...e.target.classList].includes('exit-intent-popup') || // user clicks on mask
        e.target.className === 'close' || // user clicks on the close icon
        e.keyCode === 27; // user hits escape

    if (shouldExit) {
        exitIntentPopup.classList.remove('visible');
    }
};

const mouseEvent = e => {
    const shouldShowExitIntent =
        !e.toElement &&
        !e.relatedTarget &&
        e.clientY < 10;


    if (shouldShowExitIntent) {
        document.removeEventListener('mouseout', mouseEvent);
        exitIntentPopup.classList.add('visible');
    }
};


if(exitIntentPopup) {
    setTimeout(() => {
        document.addEventListener('mouseout', mouseEvent);
        document.addEventListener('keydown', exit);
        exitIntentPopup.addEventListener('click', exit);
    }, 0);
}


