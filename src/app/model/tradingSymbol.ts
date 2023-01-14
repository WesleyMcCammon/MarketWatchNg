export interface TradingSymbol {
    symbol: string;
    marketName: string;
    isActive: boolean;
    description: string;
    liveSource: TradingSymbolSource;
    historicalSource: TradingSymbolSource;
}

export interface TradingSymbolSource {
    symbol: string;
    source: string;
}