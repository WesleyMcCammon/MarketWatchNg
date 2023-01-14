export interface PivotPointResult {
    r4: number;
    r3: number;
    r2: number;
    r1: number;
    pp: number;
    s1: number;
    s2: number;
    s3: number;
    s4: number;
}

export interface PivotPoint {
    pivotPointsResult: PivotPointResult,
    name: string;
    symbol: string;
}

export interface TechnicalMessage {
    name: string;
    symbol: string;
}

export interface HeikinAshi {
    name: string;
    alertType: string;
    symbol: string;
    timeFrame: string;
    timeFrameLength: number;
    alertSequenceNumber: number;
    alertDateTime: Date;
}