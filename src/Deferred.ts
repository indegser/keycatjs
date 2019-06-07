export class Deferred<T> {
  resolve: any = null;
  reject: any = null;
  promise = new Promise<T>((res, rej) => {
    this.resolve = res;
    this.reject = rej;
  });
}