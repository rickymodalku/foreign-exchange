import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgControl,
    Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MemberBankAccount } from '../../models/member.class';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import { FormService } from '../../services/form.service';
import CONFIGURATION from '../../../configurations/configuration';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'setting-bank',
  templateUrl: './setting-bank.html'
})
export class SettingBankComponent implements OnInit {
    formModel: any;
    masterData: any;
    settingBankForm: FormGroup;
    currentStep: string;

    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _memberService: MemberService,
        private _notificationService: NotificationService,
        private _translateService: TranslateService,
        private _validatorService: ValidatorService,
        private _formService: FormService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        this.formModel = {
            settingBank: {
                bankOtherValid: true,
                error: '',
                existing: null,
                showBankOther: false,
                success: '',
                validation: false
            }
        };
        this.masterData = {
            banks: new Array<any>(),
            bankAccountTypes: new Array<any>(),
            currencies: new Array<any>()
        };
        this.settingBankForm = this._formBuilder.group({
            id: new FormControl(null, [Validators.pattern(this._validatorService.numberPattern)]),
            bankId: new FormControl(null, [Validators.required]),
            bankOther: new FormControl(null, []),
            bankAccountTypeId: new FormControl(null, [Validators.required]),
            branch: new FormControl(null, [Validators.required]),
            address: new FormControl(null, []),
            swiftCode: new FormControl(null, []),
            currency: new FormControl(null, [Validators.required]),
            number: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required])
        });
    }

    ngOnInit() {
      const activationStepCodes = CONFIGURATION.activation_step_code;
      this.currentStep = this._authService.getActivationStepCode();
        this._formService.disableFields(
          this.settingBankForm,
          Object.keys(this.settingBankForm.controls)
        );
        this.initialize();
        this._memberService
            .getMemberMasterData(this._authService.getMemberTypeCode())
            .subscribe(
                response => {
                    let masterData = response.data;
                    this.masterData.bankAccountTypes = masterData.bankAccountTypes.filter(bankAccountType => {
                        return bankAccountType.countryId === CONFIGURATION.country_code;
                    });
                },
                error => {
                    this._notificationService.error();
                }
            );
        this._translateService
            .get('form.setting-bank')
            .subscribe(
                bank => {
                    this.formModel.settingBank.error = bank.error;
                    this.formModel.settingBank.success = bank.success;
                }
            );
    }

    initialize(): void {
        this._memberService
            .getMemberDetail()
            .subscribe(
                member => {
                    this.formModel.settingBank.existing = member.memberBankAccounts.find(memberBankAccount => {
                        return memberBankAccount.isDefault;
                    });
                    if(this.formModel.settingBank.existing) {
                        this.settingBankForm.patchValue({
                            id: this.formModel.settingBank.existing.id,
                            bankId: this.formModel.settingBank.existing.bankId,
                            bankOther: this.formModel.settingBank.existing.bankOther,
                            bankAccountTypeId: this.formModel.settingBank.existing.bankAccountTypeId,
                            branch: this.formModel.settingBank.existing.branch,
                            address: this.formModel.settingBank.existing.address,
                            swiftCode: this.formModel.settingBank.existing.swiftCode,
                            currency: this.formModel.settingBank.existing.currency,
                            name: this.formModel.settingBank.existing.name,
                            number: this.formModel.settingBank.existing.number
                        });
                    }

                    if(this.masterData.banks.length === 0 && this.masterData.currencies.length === 0) {
                        this._memberService
                            .getLookUpMasterData()
                            .subscribe(
                                response => {
                                    const masterData = response.data;
                                    this.masterData.banks = masterData.banks;
                                    this.masterData.currencies = this._formService.getDefaultCurrencyFirst(masterData.currencies, CONFIGURATION.currency_code);
                                    this.onBankIdChange(this.settingBankForm.value.bankId);
                                },
                                error => {
                                    this._notificationService.error();
                                }
                            );
                    } else {
                        this.onBankIdChange(this.settingBankForm.value.bankId);
                    }
                },
                error => {
                    this._notificationService.error();
                }
            );
    }

    onBankIdChange(value: string): void {
        let existingBank = this.masterData.banks.find(bank => {
            return bank.id === value;
        });
        this.formModel.settingBank.showBankOther = existingBank && existingBank.name === 'Other';
    }

    onSettingBankFormSubmit(): void {
        this.formModel.settingBank.validation = true;
        this.formModel.settingBank.bankOtherValid = !this.formModel.settingBank.showBankOther || (this.formModel.settingBank.showBankOther && this.settingBankForm.value.bankOther && this.settingBankForm.value.bankOther.length > 0);

        if(
            this.formModel.settingBank.bankOtherValid &&
            this.settingBankForm.valid
        ) {
            if(this.formModel.settingBank.existing) {
                let list = new Array<MemberBankAccount>()
                list.push(<MemberBankAccount>({
                    address: this.settingBankForm.value.address,
                    bankAccountTypeId: this.settingBankForm.value.bankAccountTypeId,
                    bankAccountTypeName: this.settingBankForm.value.bankAccountTypeName,
                    bankId: this.settingBankForm.value.bankId,
                    bankName: this.settingBankForm.value.bankName,
                    bankOther: this.formModel.settingBank.showBankOther ? this.settingBankForm.value.bankOther : '',
                    branch: this.settingBankForm.value.branch,
                    currency: this.settingBankForm.value.currency,
                    id: this.settingBankForm.value.id,
                    isDefault: true,
                    isValid: true,
                    memberId: this._authService.getMemberId(),
                    name: this.settingBankForm.value.name,
                    number: this.settingBankForm.value.number,
                    pic: this._authService.getUserName() + (!this._authService.isAdministrator() ? ' (' + this._authService.getSubaccountUserName() + ')' : ''),
                    swiftCode: this.settingBankForm.value.swiftCode
                }));
                this._memberService
                    .updateBankAccounts(
                        list
                    )
                    .subscribe(
                        response => {
                            this.initialize();
                            this.formModel.settingBank.validation = false;
                            this._notificationService.success(this.formModel.settingBank.success);
                        },
                        error => {
                            this._notificationService.error(error.message);
                        }
                    );
            } else {
                this._memberService
                    .addBankAccount(<MemberBankAccount>({
                        address: this.settingBankForm.value.address,
                        bankAccountTypeId: this.settingBankForm.value.bankAccountTypeId,
                        bankAccountTypeName: this.settingBankForm.value.bankAccountTypeName,
                        bankId: this.settingBankForm.value.bankId,
                        bankName: this.settingBankForm.value.bankName,
                        bankOther: this.formModel.settingBank.showBankOther ? this.settingBankForm.value.bankOther : '',
                        branch: this.settingBankForm.value.branch,
                        currency: this.settingBankForm.value.currency,
                        id: null,
                        isDefault: true,
                        isValid: true,
                        name: this.settingBankForm.value.name,
                        number: this.settingBankForm.value.number,
                        pic: this._authService.getUserName() + (!this._authService.isAdministrator() ? ' (' + this._authService.getSubaccountUserName() + ')' : ''),
                        swiftCode: this.settingBankForm.value.swiftCode
                    }))
                    .subscribe(
                        response => {
                            this.initialize();
                            this.formModel.settingBank.validation = false;
                        },
                        error => {
                            this._notificationService.error(error.message);
                        }
                    );
            }
        } else {
            window.scrollTo(0, 0);
        }
    }
}
