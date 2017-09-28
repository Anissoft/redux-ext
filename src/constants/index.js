export const DISPATCH = 'redux-ext-dispatch';
export const STATE = 'redux-ext-state';

let _crossbrowserName = '',
	_crossbrowser = {};

if (typeof crossbrowser === 'undefined') {
	let _crossbrowser = {};
} else {
	_crossbrowser = crossbrowser;
}

if (navigator.userAgent.indexOf("Chrome") != -1) {//CHROME, EDGE OR OPERA
	if (navigator.userAgent.indexOf("Edge") != -1) {
		_crossbrowserName = 'edge';
		_crossbrowser = browser;
	} else if ((navigator.userAgent.indexOf("Opera")!= -1) ||  (navigator.userAgent.indexOf('OPR') != -1)) {
		_crossbrowserName = 'opera';
		_crossbrowser = chrome;
	} else if ((navigator.userAgent.indexOf("YaBrowser")!= -1) || (navigator.userAgent.indexOf('Yowser') != -1)) {
		_crossbrowserName = 'yandex';
		_crossbrowser = chrome;
	} else {
		_crossbrowserName = 'chrome';
		_crossbrowser = chrome;
	}
} else if (navigator.userAgent.indexOf("Safari") != -1) {//SAFARI
	_crossbrowserName = 'safari';
	_crossbrowser = crossbrowser
} else if (navigator.userAgent.indexOf("Firefox") != -1) {//FIREFOX
	_crossbrowserName = 'firefox';
	_crossbrowser = browser;
} else if ((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) { //IF IE > 10
	_crossbrowserName = 'ie';
} else {
	console.error("Cannot get browser name");
}

export const webextApi = _crossbrowser;
export const crossbrowserName = _crossbrowserName;