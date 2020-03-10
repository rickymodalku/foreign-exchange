import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'virtual-account',
  templateUrl: './virtual-account.html'
})
export class VirtualAccountComponent implements OnInit {
  firebaseMasterData: any;
  countryCode = CONFIGURATION.country_code;

  constructor(private _translateService: TranslateService) {
    this.firebaseMasterData = {
      transferWay: new Array<any>(),
      sinarmasPayment: new Array<any>(),
      sinarmasPaymentATM: new Array<any>(),
      sinarmasTransfer: new Array<any>(),
      sinarmasTransferATM: new Array<any>(),
      bcaMBanking: new Array<any>(),
      bcaTransfer: new Array<any>(),
      generalTransfer: new Array<any>(),
      llgRgts: new Array<any>(),
      mandiriTransfer: new Array<any>(),
      otherBankATM: new Array<any>(),
      tellerBankSinarmas: new Array<any>(),
    };
  }

  ngOnInit() {
    this.firebaseInitialize();
  }

  firebaseInitialize(): void {
    this._translateService
      .get('deposit.transfer-way.list')
      .subscribe(
      transferWay => {
        this.firebaseMasterData.transferWay = transferWay.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.internet-banking.sinarmas.payment.list')
      .subscribe(
      sinarmasPayment => {
        this.firebaseMasterData.sinarmasPayment = sinarmasPayment.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.internet-banking.sinarmas.transfer.list')
      .subscribe(
      sinarmasTransfer => {
        this.firebaseMasterData.sinarmasTransfer = sinarmasTransfer.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.internet-banking.bca.list')
      .subscribe(
      bcaTransfer => {
        this.firebaseMasterData.bcaTransfer = bcaTransfer.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.internet-banking.bca-m-banking.list')
      .subscribe(
      bcaMBanking => {
        this.firebaseMasterData.bcaMBanking = bcaMBanking.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.internet-banking.mandiri.list')
      .subscribe(
      mandiriTransfer => {
        this.firebaseMasterData.mandiriTransfer = mandiriTransfer.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.internet-banking.general.list')
      .subscribe(
      generalTransfer => {
        this.firebaseMasterData.generalTransfer = generalTransfer.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.atm.sinarmas.transfer.list')
      .subscribe(
      sinarmasTransferATM => {
        this.firebaseMasterData.sinarmasTransferATM = sinarmasTransferATM.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.atm.other.list')
      .subscribe(
      otherBankATM => {
        this.firebaseMasterData.otherBankATM = otherBankATM.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.teller-bank-sinarmas.list')
      .subscribe(
      tellerBankSinarmas => {
        this.firebaseMasterData.tellerBankSinarmas = tellerBankSinarmas.map( data => {
          return {
            value: data.value
          };
        });
      });

    this._translateService
      .get('deposit.llg-rtgs.list')
      .subscribe(
      llgRgts => {
        this.firebaseMasterData.llgRgts = llgRgts.map( data => {
          return {
            value: data.value
          };
        });
      });
  }
}
