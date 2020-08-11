"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Blockchain_1 = __importDefault(require("./Blockchain"));
var throwValidationError = function (_a) {
    var name = _a.name, property = _a.property, blockchain = _a.blockchain;
    throw new Error("Property '" + property + "' in 'blockchain' is required. This error occurred because '" + name + "' should follow initialization rules of '" + blockchain + "' configuration.");
};
var EosValidator = /** @class */ (function () {
    function EosValidator() {
    }
    EosValidator.prototype.isAcceptable = function (_a) {
        var name = _a.name, nodes = _a.nodes, urlOrigin = _a.urlOrigin;
        console.log('about to validate isAcceptable', name, nodes, urlOrigin);
        if (!Blockchain_1.default.eos.find(function (preset) { return name === preset; }))
            return false;
        if (!nodes) {
            throwValidationError({ name: name, property: 'nodes', blockchain: 'eos' });
        }
        console.log('EosValidator true');
        return true;
    };
    return EosValidator;
}());
var validators = {
    eos: EosValidator,
};
exports.default = validators;
