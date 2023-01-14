import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { Observable } from 'rxjs';
import { HeikinAshi, PivotPoint, TechnicalMessage } from '../model/historicalData';
import { LiveData } from '../model/liveData';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private liveDataSocketUrl: string = 'https://localhost:7290/liveData';
  private historicalDataSocketUrl: string = 'https://localhost:7290/historicalData';
  private technicalDataSocketUrl: string = 'https://localhost:7290/technical';

  public liveDataEventEmitter: EventEmitter<LiveData> = new EventEmitter<LiveData>();
  public pivotPointDataEmitter: EventEmitter<PivotPoint> = new EventEmitter<PivotPoint>();
  public hiekinAshiDataEmitter: EventEmitter<HeikinAshi> = new EventEmitter<HeikinAshi>();

  private liveDataHubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.liveDataSocketUrl)
    .build();

  private historicalDataConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.historicalDataSocketUrl)
    .build();

  private technicalDataConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.technicalDataSocketUrl)
    .build();

  constructor(public http: HttpClient) { }

  public startConnection = () => {
    this.liveDataHubConnection.start()
      .then(() => console.log('live data connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
    this.historicalDataConnection.start()
      .then(() => console.log('historical data connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
    this.technicalDataConnection.start()
      .then(() => console.log('historical data connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  };

  public liveDataListener = () => {
    this.liveDataHubConnection.on('liveData', (data) => {
      const liveData: LiveData = JSON.parse(data);
      this.liveDataEventEmitter.emit(liveData);
    });
  };

  public technicalDataListener = () => {
    this.technicalDataConnection.on('technical', (data) => {
      const technicalObject: TechnicalMessage = JSON.parse(data);
      if (technicalObject.name === 'PIVOTS') {
        const pivotPointResult: PivotPoint = JSON.parse(data);
        this.pivotPointDataEmitter.emit(pivotPointResult);
      }
      else if(technicalObject.name === 'HEIKINASHI'){
        const heikinAshi: HeikinAshi = JSON.parse(data);
        this.hiekinAshiDataEmitter.emit(heikinAshi);
      }
    });
  };
  public historicalDataListener = () => {
    this.historicalDataConnection.on('historical', (data) => {
      // const pivotPointResult: PivotPoint = JSON.parse(data);
      // console.log(`historicalData ${JSON.stringify(data)}`);
      // this.pivotPointDataEmitter.emit(pivotPointResult);
    });
  };

  public getData(): Observable<any> {
    return this.http.get('https://localhost:7247/api/instrument');
  }
}
