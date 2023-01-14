import { Injectable } from '@angular/core';

interface CurrencyIdentifier {
  abbreviation: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  currencyIndentifier: CurrencyIdentifier[] = new Array<CurrencyIdentifier>();

  constructor() { 
    this.currencyIndentifier.push({abbreviation: 'EUR', description: 'Euro'});
    this.currencyIndentifier.push({abbreviation: 'USD', description: 'US Dollar'});
    this.currencyIndentifier.push({abbreviation: 'CAD', description: 'Canadian Dollar'});
    this.currencyIndentifier.push({abbreviation: 'JPY', description: 'Yen'});
    this.currencyIndentifier.push({abbreviation: 'GBP', description: 'Pound'});
    this.currencyIndentifier.push({abbreviation: 'CHF', description: 'Swiss Franc'});
    this.currencyIndentifier.push({abbreviation: 'AUD', description: 'Aussie Dollar'});
    this.currencyIndentifier.push({abbreviation: 'NZD', description: 'New Zealand Dollar'});
  }

  public getDecimalPipeSetting(symbol: string | null): string {
    return symbol ? symbol.includes("JPY") ? '1.1-2' : '1.5-5' : '';
  }
  
  public getPairDescription(symbol: string): string {
    let description: string = '';
    const first = this.currencyIndentifier.find(c => c.abbreviation === symbol.substring(0,3))?.description;
    const second = this.currencyIndentifier.find(c => c.abbreviation === symbol.substring(3,6))?.description;
    
    return `${first} - ${second}`;
  }
}
