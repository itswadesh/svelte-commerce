export declare class HoudiniDocumentProxy {
    initial: any;
    callbacks: ((val: any) => void)[];
    listen(callback: (val: any) => void): void;
    invoke(val: any): void;
}
