import { WindowUX } from '../Types';
export declare function openWindow(url: string, mode: keyof typeof WindowUX): Window;
interface IUrlData {
    blockchain: any;
    account?: string;
    args?: any;
}
export declare function makeWindowUrl(origin: any, path: any, data: IUrlData): string;
export {};
