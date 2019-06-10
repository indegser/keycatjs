export class Deferred<T> {
  public resolve: any = null;
  public reject: any = null;
  public promise = new Promise<T>((res, rej) => {
    this.resolve = res;
    this.reject = rej;
  });
}
