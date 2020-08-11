var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Deferred } from './Deferred';
import { appendPlugin } from './Blockchain';
import validators from './Validator';
import { openWindow, makeWindowUrl } from './utils/window';
var Keycat = /** @class */ (function () {
    function Keycat(config) {
        this.config = config;
        this.sign = this.signTransaction;
        this.validateBlockchain(config.blockchain);
        this._account = config.account;
    }
    Keycat.prototype.validateBlockchain = function (blockchain) {
        var chainName = blockchain.name, plugin = blockchain.plugin;
        var names = Object.keys(validators);
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            var validator = new validators[name_1]();
            var isValid = validator.isAcceptable(blockchain);
            if (isValid)
                return;
        }
        // Using custom name which is not in the list of preset. Check plugin exists.
        if (!chainName || !plugin) {
            throw new Error("Unknown configuration for 'blockchain' property.");
        }
        // tslint:disable-next-line
        console.warn("You are using custom name. We hope you understand what you are doing. We recommend using a preset name.");
    };
    Keycat.prototype.spawnWindow = function (url, secure) {
        var _this = this;
        if (secure === void 0) { secure = false; }
        if (secure && !this._account) {
            throw new Error("You must chain \"account\" method first. e.g) keycat.account(accountName).transact(...) ");
        }
        var deferred = new Deferred();
        this.win = openWindow(url, this.config.ux);
        var timer = setInterval(function () {
            if (!_this.win || _this.win.closed) {
                clearInterval(timer);
                deferred.reject('closed');
            }
        }, 500);
        window.onmessage = function (_a) {
            var data = _a.data;
            var ____keycat = data.____keycat;
            if (!____keycat)
                return;
            _this.sendResponse(data, deferred);
        };
        return deferred.promise;
    };
    Keycat.prototype.sendResponse = function (message, deferred) {
        var type = message.type, payload = message.payload;
        if (type === 'close') {
            deferred.reject('closed');
        }
        else {
            var data = payload.data, error = payload.error;
            if (error)
                deferred.reject(error);
            if (data)
                deferred.resolve(data);
        }
        this.win && this.win.close();
        this.win = null;
    };
    Keycat.prototype.makeUrlData = function (args) {
        return {
            blockchain: appendPlugin(this.config.blockchain),
            account: this._account,
            args: encodeURIComponent(btoa(JSON.stringify(args))),
        };
    };
    Object.defineProperty(Keycat.prototype, "keycatOrigin", {
        get: function () {
            console.log('this.config is: ', this.config);
            var _a = this.config, __keycatOrigin = _a.__keycatOrigin, _b = _a.blockchain, name = _b.name, urlOrigin = _b.urlOrigin;
            return urlOrigin;
        },
        enumerable: true,
        configurable: true
    });
    Keycat.prototype.account = function (accountName) {
        this._account = accountName;
        return this;
    };
    Keycat.prototype.signin = function () {
        var url = makeWindowUrl(this.keycatOrigin, '/signin', this.makeUrlData());
        return this.spawnWindow(url);
    };
    Keycat.prototype.transact = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var url = makeWindowUrl(this.keycatOrigin, '/transact', this.makeUrlData(args));
        return this.spawnWindow(url, true);
    };
    Keycat.prototype.signArbitraryData = function (data) {
        var url = makeWindowUrl(this.keycatOrigin, '/sign-arbitrary-data', this.makeUrlData([data]));
        return this.spawnWindow(url, true);
    };
    Keycat.prototype.signTransaction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var url = makeWindowUrl(this.keycatOrigin, '/sign-transaction', this.makeUrlData(args));
        return this.spawnWindow(url, true);
    };
    return Keycat;
}());
var KeycatTelos = /** @class */ (function (_super) {
    __extends(KeycatTelos, _super);
    function KeycatTelos(nodes) {
        return _super.call(this, {
            blockchain: {
                name: 'telos',
                urlOrigin: 'https://wallet.telos.net',
                nodes: nodes,
            },
        }) || this;
    }
    return KeycatTelos;
}(Keycat));
var KeycatTelosTestnet = /** @class */ (function (_super) {
    __extends(KeycatTelosTestnet, _super);
    function KeycatTelosTestnet(nodes) {
        return _super.call(this, {
            blockchain: {
                name: 'telos-testnet',
                urlOrigin: 'http://localhost:3030',
                nodes: nodes,
            },
        }) || this;
    }
    return KeycatTelosTestnet;
}(Keycat));
Keycat.Telos = KeycatTelos;
Keycat.TelosTestnet = KeycatTelosTestnet;
export { Keycat };
