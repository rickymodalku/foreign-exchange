import { Component, OnInit } from '@angular/core';
import { ForeignExchangeService } from '../../services/foreign-exchange.service';
import { AutoFormatService } from '../../services/auto-format.service';


@Component({
  selector: 'foreign-exchange',
  templateUrl: './foreign-exchange.html'
})

export class ForeignExchangeComponent implements OnInit {
  currencyMasterData: any;
  allowedCurrency: any;
  baseCurrency: any;
  currencyAmount: string;
  newCurrency: string;
  showAddCurrencyInput: boolean;
  showError: boolean;
  errorMessage: string;
  constructor(
    private autoFormatService: AutoFormatService,
    private foreignExchangeService: ForeignExchangeService,
  ) {
    this.allowedCurrency =
      [
        {
          currency: 'USD', label: 'United States Dollars', show: true
        },
        {
          currency: 'CAD', label: 'Canada Dollars', show: false
        },
        {
          currency: 'IDR', label: 'Indonesia Rupiah', show: true
        },
        {
          currency: 'GBP', label: 'British Poundsterling', show: true
        },
        {
          currency: 'CHF', label: 'Swiss Franch', show: false
        },
        {
          currency: 'SGD', label: 'Singapore Dollars', show: true
        },
        {
          currency: 'INR', label: 'Indian Rupee', show: false
        },
        {
          currency: 'MYR', label: 'Malaysia Ringgit', show: false
        },
        {
          currency: 'JPY', label: 'Japan Yen', show: false
        },
        {
          currency: 'KRW', label: 'Korean Won', show: false
        },
      ];
    this.baseCurrency = {
      currency: '',
      label: ''
    };
    this.currencyAmount = '10';
    this.newCurrency = '';
    this.showAddCurrencyInput = false;
    this.showError = false;
    this.errorMessage = '';
  }

  ngOnInit() {
    this.getCurrencyRate();
  }

  getCurrencyRate() {
    this.foreignExchangeService
      .getCurrencyRate()
      .subscribe(rate => {
        this.currencyMasterData = rate.rates;
        this.baseCurrency.currency = rate.base;
        this.baseCurrency.label = 'EURO';
        this.allowedCurrency.forEach(element => {
          if (Object.keys(this.currencyMasterData).includes(element.currency)) {
            element.rate = this.currencyMasterData[element.currency];
            element.conversion = (Number(this.currencyAmount) * element.rate).toFixed(2);
          }
        });
      },
        error => {
          console.log(error);
        }
      );
  }

  removeCurrency(currency: string) {
    this.allowedCurrency.find(x => x.currency === currency).show = false;
  }

  addCurrency() {
    this.showError = false;
    if (this.allowedCurrency.find(x => x.currency === this.newCurrency.toUpperCase())) {
      if (this.allowedCurrency.find(x => x.currency === this.newCurrency.toUpperCase()).show === true) {
        this.showError = true;
        this.errorMessage = 'Currency already exists';
        return;
      }
      const selectedCurrency = this.allowedCurrency.find(x => x.currency === this.newCurrency.toUpperCase());
      selectedCurrency.show = true;
      selectedCurrency.conversion = Number(this.currencyAmount) * selectedCurrency.rate;
      this.allowedCurrency.push(this.allowedCurrency.splice(this.allowedCurrency.indexOf(selectedCurrency), 1)[0]);
      this.showAddCurrencyInput = false;
      this.newCurrency = '';
    } else {
      this.showError = true;
      this.errorMessage = 'Only USD, CAD, IDR, GBP, CHF, SGD, INR, MYR, JPY,KRW allowed';
      return;
    }
  }

  calculateRate() {
    this.allowedCurrency.forEach(element => {
      if (element.show) {
        element.conversion = (Number(this.autoFormatService.removeDelimiter(this.currencyAmount)) * element.rate).toFixed(2);
      }
    });
  }
}
