export interface LiveData {
    date: Date;
    symbol: string;
    quoteType: string;
    value: number;
}

export interface Quote {
    symbol: string;
    bid: number;
    ask: number;
    lastUpdate: Date;
}