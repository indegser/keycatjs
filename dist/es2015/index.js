import { Deferred } from './Deferred';
import { appendPlugin } from './Blockchain';
import validators from './Validator';
import { openWindow, makeWindowUrl, fromBinary, toBinary } from './utils/window';
class Keycat {
    constructor(config) {
        this.config = config;
        this.sign = this.signTransaction;
        console.log('in Keycat constructor and config: ', config);
        this.validateBlockchain(config.blockchain);
        this._account = config.account;
    }
    validateBlockchain(blockchain) {
        const { name: chainName, plugin } = blockchain;
        const names = Object.keys(validators);
        for (const name of names) {
            const validator = new validators[name]();
            const isValid = validator.isAcceptable(blockchain);
            if (isValid)
                return;
        }
        // Using custom name which is not in the list of preset. Check plugin exists.
        if (!chainName || !plugin) {
            throw new Error(`Unknown configuration for 'blockchain' property.`);
        }
        // tslint:disable-next-line
        console.warn(`You are using custom name. We hope you understand what you are doing. We recommend using a preset name.`);
    }
    spawnWindow(url, secure = false) {
        if (secure && !this._account) {
            throw new Error(`You must chain "account" method first. e.g) keycat.account(accountName).transact(...) `);
        }
        const deferred = new Deferred();
        this.win = openWindow(url, this.config.ux);
        const timer = setInterval(() => {
            if (!this.win || this.win.closed) {
                clearInterval(timer);
                deferred.reject('closed');
            }
        }, 500);
        window.onmessage = ({ data }) => {
            const { ____keycat } = data;
            if (!____keycat)
                return;
            this.sendResponse(data, deferred);
        };
        return deferred.promise;
    }
    sendResponse(message, deferred) {
        const { type, payload } = message;
        if (type === 'close') {
            deferred.reject('closed');
        }
        else {
            const { data, error } = payload;
            if (error)
                deferred.reject(error);
            if (data)
                deferred.resolve(data);
        }
        this.win && this.win.close();
        this.win = null;
    }
    makeUrlData(args) {
        return {
            blockchain: appendPlugin(this.config.blockchain),
            account: this._account,
            args: encodeURIComponent(fromBinary(btoa(toBinary(JSON.stringify(args))))),
        };
    }
    get keycatOrigin() {
        console.log('getting keycatOrigin, this.config is: ', this.config);
        const { blockchain: { origin }, } = this.config;
        return origin;
    }
    account(accountName) {
        this._account = accountName;
        return this;
    }
    signin() {
        const url = makeWindowUrl(this.keycatOrigin, '/signin', this.makeUrlData());
        return this.spawnWindow(url);
    }
    transact(...args) {
        const url = makeWindowUrl(this.keycatOrigin, '/transact', this.makeUrlData(args));
        return this.spawnWindow(url, true);
    }
    signArbitraryData(data) {
        const url = makeWindowUrl(this.keycatOrigin, '/sign-arbitrary-data', this.makeUrlData([data]));
        return this.spawnWindow(url, true);
    }
    signTransaction(...args) {
        const url = makeWindowUrl(this.keycatOrigin, '/sign-transaction', this.makeUrlData(args));
        return this.spawnWindow(url, true);
    }
}
class KeycatTelos extends Keycat {
    constructor(nodes, origin) {
        super({
            blockchain: {
                name: 'telos',
                origin,
                nodes,
            },
        });
    }
}
class KeycatTelosTestnet extends Keycat {
    constructor(nodes, origin) {
        super({
            blockchain: {
                name: 'telos-testnet',
                origin,
                nodes,
            },
        });
    }
}
Keycat.Telos = KeycatTelos;
Keycat.TelosTestnet = KeycatTelosTestnet;
export { Keycat };
