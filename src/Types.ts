export interface ISigninResponse {
  accountName?: string
  publicKey: string
  permission: string
}

export enum WindowUX {
  popup = 'popup',
  page = 'page',
}
