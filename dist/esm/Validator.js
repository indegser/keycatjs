import Blockchain from './Blockchain';
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
export default validators;
