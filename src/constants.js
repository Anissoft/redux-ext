// @flow
export let { webextApi, browserName } = (() => {
	let browserName = '',
		webextApi = window.crossbrowser;

	if (navigator.userAgent.indexOf("Chrome") !== -1) {//CHROME, EDGE OR OPERA
		if (navigator.userAgent.indexOf("Edge") !== -1) {
			browserName = 'edge';
			webextApi = window.browser;
		} else if ((navigator.userAgent.indexOf("Opera") !== -1) || (navigator.userAgent.indexOf('OPR') !== -1)) {
			browserName = 'opera';
			webextApi = window.chrome;
		} else if ((navigator.userAgent.indexOf("YaBrowser") !== -1) || (navigator.userAgent.indexOf('Yowser') !== -1)) {
			browserName = 'yandex';
			webextApi = window.chrome;
		} else {
			browserName = 'chrome';
			webextApi = window.chrome;
		}
	} else if (navigator.userAgent.indexOf("Safari") !== -1) {//SAFARI
		browserName = 'safari';
	} else if (navigator.userAgent.indexOf("Firefox") !== -1) {//FIREFOX
		browserName = 'firefox';
		webextApi =  window.browser;
	} else if ((navigator.userAgent.indexOf("MSIE") !== -1 ) || (!!document.documentMode === true )) { //IF IE > 10
		browserName = 'ie';
	} else {
		console.error("Cannot get browser name");
	}

	return { webextApi, browserName };
})();

let manifest = webextApi.runtime.getManifest();

export const DISPATCH = 'redux-ext-dispatch';
export const STATE = 'redux-ext-state';
export const isPopup = manifest && manifest.browser_action && window.location.href.indexOf(manifest.browser_action.default_popup) !== -1;