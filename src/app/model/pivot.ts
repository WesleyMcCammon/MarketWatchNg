export interface Pivot {
    symbol: string;
    pivotName: string;
    dateTime: Date;
    pivotLevels: PivotLevel;
}

export interface PivotLevel {
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