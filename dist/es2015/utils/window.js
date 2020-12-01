export function openWindow(url, mode) {
    if (mode === 'page') {
        return window.open(url, '_blank');
    }
    const w = 480;
    const h = 720;
    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
    const features = [`width=${w}`, `height=${h}`, `top=${y}`, `left=${x}`].join(',');
    return window.open(url, 'Keycat', features);
}
export function makeWindowUrl(origin, path, data) {
    const url = new URL(origin + path);
    const searchParams = new URLSearchParams();
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
function fromBinary(binary) {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}
function toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}
