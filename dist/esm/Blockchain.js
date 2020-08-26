var __assign = (this && this.__assign) || function () {
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
export var appendPlugin = function (blockchain) {
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
export default Blockchain;
