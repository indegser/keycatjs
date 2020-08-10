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
export { Deferred };
