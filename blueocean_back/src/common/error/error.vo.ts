export interface IBaseException {
    errorCode: string;
    errorName : string;
    timestamp: string;
    statusCode: number;
    path: string;
}