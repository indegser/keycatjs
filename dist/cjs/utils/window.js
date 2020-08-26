"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWindowUrl = exports.openWindow = void 0;
function openWindow(url, mode) {
    if (mode === 'page') {
        return window.open(url, '_blank');
    }
    var w = 480;
    var h = 720;
    var y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    var x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
    var features = ["width=" + w, "height=" + h, "top=" + y, "left=" + x].join(',');
    return window.open(url, 'Keycat', features);
}
exports.openWindow = openWindow;
function makeWindowUrl(origin, path, data) {
    var url = new URL(origin + path);
    var searchParams = new URLSearchParams();
    searchParams.set('blockchain', JSON.stringify(data.blockchain));
    searchParams.set('client', location.origin);
    if (data.account) {
        searchParams.set('account', data.account);
    }
    if (data.args) {
        searchParams.set('payload', data.args);
    }
    url.search = searchParams.toString();
    return url.href;
}
exports.makeWindowUrl = makeWindowUrl;
