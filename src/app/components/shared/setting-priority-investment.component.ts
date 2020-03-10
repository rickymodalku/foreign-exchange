import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';

import CONFIGURATION from '../../../configurations/configuration';

@Component({
  selector: 'app-setting-priority-investment',
  templateUrl: './setting-priority-investment.html'
})

export class SettingPriorityInvestmentComponent implements OnInit {

  products = Array<any>();
  investmentSettingsGroup: FormGroup;
  investEmail: string;
  showBottomNote =  true;
  constructor(
    private formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
  ) {
    this.products = CONFIGURATION.prioritySettings.products;
    this.investEmail = CONFIGURATION.investEmail || '';
  }

  ngOnInit() {
    const investmentSettingsForm = this.formBuilder.array([]);
    this.products.forEach((product) => {
      investmentSettingsForm.push(this.formBuilder.group({
        investmentSettingId: new FormControl(null),
        loanProductId: new FormControl(product.productId),
        minimumTenor: new FormControl(product.tenor.min),
        maximumTenor: new FormControl(product.tenor.max),
        minimumInterestRate: new FormControl(product.interestRate.min),
        maximumInterestRate: new FormControl(product.interestRate.max),
        enabled: new FormControl(false),
        amount: new FormControl(null),
        amountSetting: new FormControl('amount'),
        percentage: new FormControl(product.notePercent)
      }));
    });
    this.investmentSettingsGroup = this.formBuilder.group({
      investmentSettingsForm: investmentSettingsForm
    });
    this.setupInvestmentSettings();
  }

  setupInvestmentSettings() {
    this._memberService.getFAInvestmentSettings()
      .subscribe(response => {
        if (response && response.data && response.data.length) {
          const investmentSettingsForm = this.investmentSettingsGroup.get('investmentSettingsForm') as FormArray;
          response.data.forEach((setting) => {
            const settingControl = investmentSettingsForm.controls.find((control) => {
              return Number(control.value.loanProductId) === Number(setting.investmentSetting.loanProductId);
            });
            if (settingControl) {
              settingControl.patchValue({
                investmentSettingId: setting.investmentSetting.id,
                enabled: setting.investmentSetting.enabled,
              });
              if (setting.amountSetting.maxLoanPercentage) {
                settingControl.patchValue({
                  amountSetting: 'percent',
                  amount: null
                });
              } else {
                settingControl.patchValue({
                  amountSetting: 'amount',
                  amount: setting.amountSetting.maximumAmount
                });
              }
            }
          });
        }
      });
  }

  investmentSubmit() {
    const investmentSettings = this.investmentSettingsGroup.get('investmentSettingsForm').value;
    investmentSettings.forEach((setting, key) => {
      if (this.validateInvestmentSetting(setting)) {
        const body: any = {
          investmentSetting: {
            enabled: setting.enabled,
            loanProductId: setting.loanProductId,
            minimumTenor: setting.minimumTenor,
            maximumTenor: setting.maximumTenor,
            minimumInterestRate: setting.minimumInterestRate,
            maximumInterestRate: setting.maximumInterestRate
          },
          amountSetting: {}
        };
        if (setting.amountSetting === 'amount') {
          body.amountSetting.minimumAmount = setting.amount;
          body.amountSetting.maximumAmount = setting.amount;
        } else {
          body.amountSetting.maxLoanPercentage = setting.percentage;
        }
        if (setting.investmentSettingId) {
          this._memberService.putFAInvestmentSettings(setting.investmentSettingId, body)
            .subscribe(() => {
              this.setupInvestmentSettings();
              this._translateService.get('form.setting-priority-investment.messages.setting-updated')
                .subscribe(text => {
                  this._notificationService.success(text);
                });
            }, error => {
              if (error.code === 422 && error.message.includes('Validation error(s):')) {
                const keyMessage = 'form.setting-priority-investment.messages.error-amount-percent-missing';
                const keyTitle = this.products[key].title;
                this._translateService.get([
                  keyMessage, keyTitle
                ]).subscribe(translationObject => {
                  this._notificationService
                    .error(translationObject[keyMessage].replace(/{{title}}/g, translationObject[keyTitle]));
                });
              } else {
                this._notificationService.error(error.message);
              }
            });
        } else {
          this._memberService.postFAInvestmentSettings(body)
            .subscribe(() => {
              this.setupInvestmentSettings();
              this._translateService.get('form.setting-priority-investment.messages.setting-saved')
                .subscribe(text => {
                  this._notificationService.success(text);
                });
            }, error => {
              if (error.code === 422 && error.message.includes('Validation error(s):')) {
                const keyMessage = 'form.setting-priority-investment.messages.error-amount-percent-missing';
                const keyTitle = this.products[key].title;
                this._translateService.get([
                  keyMessage, keyTitle
                ]).subscribe(translationObject => {
                  this._notificationService
                    .error(translationObject[keyMessage].replace(/{{title}}/g, translationObject[keyTitle]));
                });
              } else {
                this._notificationService.error(error.message);
              }
            });
        }
      } else {
        const keyMessage = 'form.setting-priority-investment.messages.error-amount-missing';
        const keyTitle = this.products[key].title;
        this._translateService.get([
          keyMessage, keyTitle
        ]).subscribe(translationObject => {
          this._notificationService
            .error(translationObject[keyMessage].replace(/{{title}}/g, translationObject[keyTitle]));
        });
      }
    });
  }

  validateInvestmentSetting(setting: any): boolean {
    return !(setting.amountSetting === 'amount' && Number(setting.amount) === 0);
  }

}
