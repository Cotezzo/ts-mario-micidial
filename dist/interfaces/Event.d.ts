export interface Event {
    name: string;
    fn: (...args: any[]) => void;
}
