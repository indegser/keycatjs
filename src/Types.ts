export interface ISigninResponse {
  accountName?: string
  address?: string
  publicKey: string
  permission: string
}

export enum WindowUX {
  popup = 'popup',
  page = 'page',
}
