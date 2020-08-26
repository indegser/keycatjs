(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.keycatjs = {}));
}(this, (function (exports) { 'use strict';

    var Deferred = /** @class */ (function () {
        function Deferred() {
            var _this = this;
            this.resolve = null;
            this.reject = null;
            this.promise = new Promise(function (res, rej) {
                _this.resolve = res;
                _this.reject = rej;
            });
        }
        return Deferred;
    }());

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var eos = ['telos', 'telos-testnet'];
    var Blockchain = {
        eos: eos,
    };
    var appendPlugin = function (blockchain) {
        var keys = Object.keys(Blockchain);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var nameSet = Blockchain[key];
            if (nameSet.find(function (n) { return n === blockchain.name; })) {
                return __assign(__assign({}, blockchain), { plugin: key });
            }
        }
        var plugin = blockchain.plugin;
        if (!plugin) {
            throw new Error("Cannot find 'plugin' property for your custom 'blockchain' configuration.");
        }
        return blockchain;
    };

    var throwValidationError = function (_a) {
        var name = _a.name, property = _a.property, blockchain = _a.blockchain;
        throw new Error("Property '" + property + "' in 'blockchain' is required. This error occurred because '" + name + "' should follow initialization rules of '" + blockchain + "' configuration.");
    };
    var EosValidator = /** @class */ (function () {
        function EosValidator() {
        }
        EosValidator.prototype.isAcceptable = function (_a) {
            var name = _a.name, nodes = _a.nodes;
            if (!Blockchain.eos.find(function (preset) { return name === preset; }))
                return false;
            if (!nodes) {
                throwValidationError({ name: name, property: 'nodes', blockchain: 'eos' });
            }
            return true;
        };
        return EosValidator;
    }());
    var validators = {
        eos: EosValidator,
    };

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

    var __extends = (undefined && undefined.__extends) || (function () {
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
                console.log('getting keycatOrigin, this.config is: ', this.config);
                var _a = this.config, __keycatOrigin = _a.__keycatOrigin, _b = _a.blockchain, name = _b.name, origin = _b.origin;
                return origin;
            },
            enumerable: false,
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
                    origin: origin,
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
                    origin: 'http://localhost:3030',
                    nodes: nodes,
                },
            }) || this;
        }
        return KeycatTelosTestnet;
    }(Keycat));
    Keycat.Telos = KeycatTelos;
    Keycat.TelosTestnet = KeycatTelosTestnet;

    exports.Keycat = Keycat;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=keycatjs.development.js.map
