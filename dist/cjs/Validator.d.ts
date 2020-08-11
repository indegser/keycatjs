export interface IBlockchainValidator {
    isAcceptable(b: any): boolean;
}
declare class EosValidator implements IBlockchainValidator {
    isAcceptable({ name, nodes, urlOrigin }: {
        name: any;
        nodes: any;
        urlOrigin: any;
    }): boolean;
}
declare const validators: {
    eos: typeof EosValidator;
};
export default validators;
