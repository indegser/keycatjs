export class Deferred {
    constructor() {
        this.resolve = null;
        this.reject = null;
        this.promise = new Promise((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }
}
