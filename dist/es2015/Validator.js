import Blockchain from './Blockchain';
const throwValidationError = ({ name, property, blockchain }) => {
    throw new Error(`Property '${property}' in 'blockchain' is required. This error occurred because '${name}' should follow initialization rules of '${blockchain}' configuration.`);
};
class EosValidator {
    isAcceptable({ name, nodes }) {
        if (!Blockchain.eos.find(preset => name === preset))
            return false;
        if (!nodes) {
            throwValidationError({ name, property: 'nodes', blockchain: 'eos' });
        }
        return true;
    }
}
const validators = {
    eos: EosValidator,
};
export default validators;
