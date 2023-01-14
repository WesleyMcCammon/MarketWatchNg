import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from './base-data.service';
import { catchError, Observable } from 'rxjs';
import { PivotPoint } from '../model/historicalData';

@Injectable({
  providedIn: 'root'
})
export class DataService extends BaseDataService {
  private tradingSymbolUrl: string = 'https://localhost:7290/api/TradingSymbol';
  private dailyPivotUrl: string = 'https://localhost:7290/api/technical/dailyPivots';

  constructor(private httpClient: HttpClient) {
    super();
  }
  public getTradingSymbols(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.tradingSymbolUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  public getDailyPivots(pivotName: string = 'WOODIE'): Observable<PivotPoint[]> {
    const url = `${this.dailyPivotUrl}?pivotName=${pivotName}`;
    return this.httpClient.get<PivotPoint[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}
