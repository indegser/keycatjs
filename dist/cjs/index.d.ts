import Blockchain from './Blockchain';
import { ISigninResponse, WindowUX } from './Types';
declare type IEos = {
    name: typeof Blockchain.eos[number];
    nodes: string[];
    plugin?: never;
    origin: string;
} | {
    name: string;
    plugin: 'eos';
    nodes: string[];
    origin: string;
};
declare type TBlockchain = IEos;
interface IKeycatConfig {
    account?: string;
    ux?: keyof typeof WindowUX;
    blockchain: TBlockchain;
    __keycatOrigin?: string;
}
declare class Keycat {
    config: IKeycatConfig;
    private win;
    private _account;
    constructor(config: IKeycatConfig);
    static Telos: typeof KeycatTelos;
    static TelosTestnet: typeof KeycatTelosTestnet;
    private validateBlockchain;
    private spawnWindow;
    private sendResponse;
    private makeUrlData;
    get keycatOrigin(): string;
    account(accountName: string): this;
    signin(): Promise<ISigninResponse>;
    transact(...args: any[]): Promise<any>;
    signArbitraryData(data: any): Promise<any>;
    signTransaction(...args: any[]): Promise<any>;
    sign: (...args: any[]) => Promise<any>;
}
declare class KeycatTelos extends Keycat {
    constructor(nodes: any);
}
declare class KeycatTelosTestnet extends Keycat {
    constructor(nodes: any);
}
export { Keycat };
