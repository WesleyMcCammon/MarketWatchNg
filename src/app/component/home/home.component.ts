import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LiveData, Quote } from 'src/app/model/liveData';
import { TradingSymbol } from 'src/app/model/tradingSymbol';
import { DataService } from 'src/app/service/data.service';
import { SocketService } from 'src/app/service/socket.service';
import { Pivot } from 'src/app/model/pivot';
import { HeikinAshi, PivotPoint } from 'src/app/model/historicalData';
import { DisplayService } from 'src/app/service/display.service';
import { DecimalPipe } from '@angular/common';

interface LiveQuote {
  symbol: string;
  bid: number;
  ask: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  tradingSymbols: TradingSymbol[] = new Array<TradingSymbol>();
  quotes: Quote[] = new Array<Quote>();
  liveQuotes: LiveQuote[] = new Array<LiveQuote>();
  pivotPoints: PivotPoint[] = new Array<PivotPoint>();
  pivotDifferences: PivotPoint[] = new Array<PivotPoint>();
  heikinAshiAlerts: HeikinAshi[] = new Array<HeikinAshi>();
  pivotName: string = 'STANDARD';
  useMockData: boolean = true;
  
  constructor(
    public displayService: DisplayService,
    private _decimalPipe: DecimalPipe,
    private dataService: DataService, 
    private socketService: SocketService) { }


  ngOnInit(): void {
    this.socketService.startConnection();
    this.socketService.liveDataListener();
    this.socketService.historicalDataListener();
    this.socketService.technicalDataListener();

    this.dataService.getTradingSymbols().subscribe((tradingSymbols: TradingSymbol[]) => {
      this.tradingSymbols = tradingSymbols;
      this.tradingSymbols.forEach((tradingSymbol: TradingSymbol) => {
        this.liveQuotes.push({ symbol: tradingSymbol.symbol, bid: 0, ask: 0 });
      });
    });

    this.loadDailyPivots();
    this.subscribeToLiveQuotes();
    this.subscribeToTechnicalAlerts();
  }

  private loadDailyPivots(){
    this.dataService.getDailyPivots(this.pivotName).subscribe((pivotPoints: PivotPoint[]) => {
      this.pivotPoints = [];
      this.pivotPoints = pivotPoints;
      this.pivotDifferences = [];
      this.pivotPoints.forEach((pivotPoint: PivotPoint) => {
        this.pivotDifferences.push({
          symbol: pivotPoint.symbol, pivotPointsResult: { r4: 0, r3: 0, r2: 0, r1: 0, pp: 0, s1: 0, s2: 0, s3: 0, s4: 0 },
          name: ''
        });
      });
    });

  }
  private formatPivotDifference(symbol: string, pivotValue: number, quoteValue: number) {
    const exponent: number = symbol.includes('JPY') ? 2 : 4;
    const multiplier: number = Math.pow(10, exponent);

    return (pivotValue - quoteValue) * multiplier;
  }

  public setPivot(pivotName: string) {
    this.pivotName = pivotName;
    this.loadDailyPivots();
  }
  public transformDifference(value: number) {
    return this._decimalPipe.transform(value,"1.0-0")?.replace(',', '');
  }

  private updatePivotDifference(symbol: string, currentPrice: number) {
    const liveQuote = this.pivotDifferences.find(p => p.symbol === symbol)!;
    const pivotPoint = this.pivotPoints.find(p => p.symbol === symbol)!;
    const pivotDifference = this.pivotDifferences.find(p => p.symbol === symbol)!;

    const exponent: number = symbol.includes('JPY') ? 2 : 5;
    const multiplier: number = Math.pow(10, exponent);
    
    if(liveQuote && pivotPoint && pivotDifference) {
      pivotDifference.pivotPointsResult.r4 = this.formatPivotDifference(symbol, pivotPoint.pivotPointsResult.r4, currentPrice);
      pivotDifference.pivotPointsResult.r3 = this.formatPivotDifference(symbol, pivotPoint.pivotPointsResult.r3, currentPrice);
      pivotDifference.pivotPointsResult.r2 = this.formatPivotDifference(symbol, pivotPoint.pivotPointsResult.r2, currentPrice);
      pivotDifference.pivotPointsResult.r1 = this.formatPivotDifference(symbol, pivotPoint.pivotPointsResult.r1, currentPrice);
      pivotDifference.pivotPointsResult.pp = this.formatPivotDifference(symbol, pivotPoint.pivotPointsResult.pp, currentPrice);
      pivotDifference.pivotPointsResult.s1 = this.formatPivotDifference(symbol, pivotPoint.pivotPointsResult.s1, currentPrice);
      pivotDifference.pivotPointsResult.s2 = this.formatPivotDifference(symbol, pivotPoint.pivotPointsResult.s2, currentPrice);
      pivotDifference.pivotPointsResult.s3 = this.formatPivotDifference(symbol, pivotPoint.pivotPointsResult.s3, currentPrice);
    }
  }

  private subscribeToTechnicalAlerts() {
    this.socketService.hiekinAshiDataEmitter.subscribe((heikinAshi: HeikinAshi) => {
      if(heikinAshi.alertSequenceNumber === 1)
        this.heikinAshiAlerts.push(heikinAshi);
    });
  }

  private subscribeToLiveQuotes() {
    this.socketService.liveDataEventEmitter.subscribe((liveData: LiveData) => {
      const liveQuote: LiveQuote = this.liveQuotes.find(l => l.symbol === liveData.symbol)!;
      if (liveQuote) {
        if (liveData.quoteType.toLowerCase() === 'bid') {
          liveQuote.bid = liveData.value;
          this.updatePivotDifference(liveQuote.symbol, liveQuote.ask);
        }
        if (liveData.quoteType.toLowerCase() === 'ask') {
          liveQuote.ask = liveData.value;
        }
      }
      const quote: Quote = this.quotes.find(q => q.symbol === liveData.symbol)!;
      if (quote) {
        if (liveData.quoteType.toLowerCase() === 'bid') {
          quote.bid = liveData.value;
        }
        if (liveData.quoteType.toLowerCase() === 'ask') {
          quote.ask = liveData.value;
        }
        quote.lastUpdate = new Date();
      }
    });
  }
}
