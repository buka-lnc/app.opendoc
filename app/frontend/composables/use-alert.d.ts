export declare const useAlertState: any;
export interface UseAlertReturnType {
    error: (message: string, ttl?: number) => void;
    success: (message: string, ttl?: number) => void;
}
export declare function useAlert(): UseAlertReturnType;
