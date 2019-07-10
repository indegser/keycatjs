const defer = () => {
  let resolve: (value?: any) => void
  let reject: (reason?: any) => void

  return {
    resolve,
    reject,
    promise: new Promise((res, rej) => {
      resolve = res
      reject = rej
    }),
  }
}

export const spawn = (src: string) => {
  const deferred = defer()
  // this.openPopup(src, deferred)

  // window.onmessage = ({ data }) => {
  //   const { ____keycat } = data
  //   if (!____keycat) return
  //   this.respond(data, deferred)
  // }

  return deferred.promise
}
