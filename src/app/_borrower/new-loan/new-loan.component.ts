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
import { AuthService } from '../../services/auth.service';
import { LoanService } from '../../services/loan.service';
import { NotificationService } from '../../services/notification.service';
import { ValidatorService } from '../../services/validator.service';
import CONFIGURATION from '../../../configurations/configuration';
import { BaseParameterService } from '../../services/base-parameter.service';
import { EventService } from '../../services/event.service';

@Component({
    templateUrl: './new-loan.html'
})
export class NewLoanComponent implements OnInit {
    currentTab: any;
    formModel: any;
    loanGuarantorForms: Array<FormGroup>;
    masterData: any;
    newLoanForm: FormGroup;
    phonePrefix: string;
    tabs: any;
    amountInvalid: boolean;
    CONFIGURATION: any;
    amountMax: string;
    enableZendesk: string;
    countryCode: string;

    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _loanService: LoanService,
        private _notificationService: NotificationService,
        private _translateService: TranslateService,
        private _validatorService: ValidatorService,
        private _baseParameterService: BaseParameterService,
        private _eventService: EventService
    ) {
        this.enableZendesk = CONFIGURATION.zendesk.enable;
        this.countryCode = CONFIGURATION.country_code;
        this.currentTab = null;
        this.formModel = {
            currencyCode: CONFIGURATION.currency_code,
            loanGuarantor: {
                error: '',
                success: '',
                validation: false
            },
            newLoan: {
                collectionType: '',
                loanType: '',
                loanSetting: '',
                tenorType: '',
                tenor: new Array(),
                error: '',
                success: '',
                validation: false
            }
        };
        this.loanGuarantorForms = new Array<FormGroup>();
        this.addGuarantor();
        this.newLoanForm = this._formBuilder.group({
            loanAmount: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal]),
            loanPurpose: new FormControl(null, [Validators.required]),
            loanTypeId: new FormControl(null, [Validators.required]),
            tenorLength: new FormControl(null, [Validators.required, this._validatorService.validatePositiveInteger])
        });
        this.tabs = {
            loanDetails: {
                index: 0,
                isLastTab: false
            },
            guarantorDetails: {
                index: 1,
                isLastTab: false
            },
            submission: {
                index: 2,
                isLastTab: true
            }
        };
        this.masterData = {
            loanPurposes: new Array<any>(),
            loanStatuses: new Array<any>(),
            loanTenors: new Array<any>(),
            loanTenorTypes: new Array<any>(),
            loanTypes: new Array<any>()
        };
        this.phonePrefix = CONFIGURATION.phone_prefix;
        this.amountInvalid = false;
    }

    ngOnInit() {
        this.CONFIGURATION = CONFIGURATION;
        this.currentTab = this.tabs.loanDetails;
        this._translateService
            .get('master.loan-purposes')
            .subscribe(
            loanPurposes => {
                this.masterData.loanPurposes = loanPurposes;
            },
            error => {
                this._notificationService.error();
            }
            );

        this._loanService
            .getLoanStatuses()
            .subscribe(
            response => {
                this.masterData.loanStatuses = response.data;
            },
            error => {
                this._notificationService.error();
            }
            );

        this._loanService
            .getLoanTypes()
            .subscribe(
            response => {
                this.masterData.loanTypes = response.data;
            },
            error => {
                this._notificationService.error();
            }
            );

        this._translateService
            .get('form.loan-guarantor')
            .subscribe(
            loanGuarantor => {
                this.formModel.loanGuarantor.error = loanGuarantor.error;
                this.formModel.loanGuarantor.success = loanGuarantor.success;
            }
            );

        this._translateService
            .get('form.new-loan')
            .subscribe(
            newLoan => {
                this.formModel.newLoan.error = newLoan.error;
                this.formModel.newLoan.success = newLoan.success;
            }
            );

        this._translateService
            .get('master.tenor-types')
            .subscribe(
            loanTenorTypes => {
                this.masterData.loanTenorTypes = loanTenorTypes;
            }
            );
    }

    addGuarantor(): void {
        this.loanGuarantorForms.push(
            this._formBuilder.group({
                address: new FormControl(null, [Validators.required]),
                email: new FormControl(null, [Validators.required, Validators.email]),
                icNumber: new FormControl(null, [Validators.required]),
                name: new FormControl(null, [Validators.required]),
                mobilePhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(this._validatorService.numberPattern)]),
                mobilePhonePrefix: new FormControl(this.phonePrefix, [Validators.required, Validators.pattern(this._validatorService.phonePrefixPattern)])
            })
        );
    }

    autoFormatLoanAmount(): void {
        this.newLoanForm.patchValue({
            loanAmount: this._validatorService.addDelimiter(this.newLoanForm.value.loanAmount, false)
        });
        this.checkLoanAmount();
    }

    changeTab(destinationTabIndex: string, moveBackward: boolean = false): void {
        this.checkLoanAmount();
        let destinationTab = null;
        for (let tabName in this.tabs) {
            if (this.tabs[tabName].index === destinationTabIndex) {
                destinationTab = this.tabs[tabName];
            }
        }

        if (this.currentTab && destinationTab) {
            // Can't move to anywhere from last tab.
            if (this.currentTab.isLastTab) {
                return;
            }

            // Can't move forward if direction is backward
            if (moveBackward && this.currentTab.index <= destinationTab.index) {
                return;
            }

            switch (destinationTab.index) {
                case 0:
                    this.currentTab = destinationTab;
                    break;
                case 1:
                    this.formModel.newLoan.validation = true;
                    if (this.newLoanForm.valid && !this.amountInvalid) {
                        this.currentTab = destinationTab;
                        this._eventService.sendLoanEvent('loan-details', { 'Loan Type' : this.newLoanForm.value.loanTypeId });
                    }
                    break;
                case 2:
                    this.onNewLoanSubmit(destinationTab);
                    break;
                default:
                    this.currentTab = destinationTab;
                    break;
            }
        }
    }

    getProductTenor(typeId: number) {
        this.formModel.newLoan.tenor = [];
        if (typeId) {
            this._loanService.getLoanTypeDetail(this.formModel.newLoan.loanType).subscribe(
                response => {
                    this.formModel.newLoan.loanSetting = response.settings;
                    const tenor = response.tenor.find(tenorSetting => tenorSetting.is_default === true);
                    this.masterData.loanTenors = tenor;
                    for (let i = 0; i < this.formModel.newLoan.loanSetting.length; i++) {
                        if (this.formModel.newLoan.loanSetting[i].enum_settings_key === 'interest_type') {
                            this.formModel.newLoan.collectionType = this.formModel.newLoan.loanSetting[i].settings_value_decimal;
                            break;
                        }
                    }

                    for (let i = 0; i < this.masterData.loanTenorTypes.length; i++) {
                        if ( this.masterData.loanTenors.tenor_type_name.toLowerCase() ===
                             this.masterData.loanTenorTypes[i].key.toLowerCase()) {
                            this.formModel.newLoan.tenorType = this.masterData.loanTenorTypes[i];
                            break;
                        }
                    }

                    for (let i = this.masterData.loanTenors.tenor_min; i <= this.masterData.loanTenors.tenor_max; i++) {
                        this.formModel.newLoan.tenor.push({
                            key: i,
                            label: i + ' ' + this.formModel.newLoan.tenorType.value
                        });
                    }
                    this.checkLoanAmount();
                },
                error => {
                    this._notificationService.error();
                }
            );
        }
    }

    onNewLoanSubmit(destinationTab: any): void {
        this.loanGuarantorForms[0].patchValue({
            mobilePhonePrefix: this.phonePrefix
        });
        this.formModel.loanGuarantor.validation = true;
        let invalidGuarantor = this.loanGuarantorForms.find(loanGuarantorForm => {
            return !loanGuarantorForm.valid;
        });

        if (!invalidGuarantor) {
            this._loanService
                .submitLoan({
                    type_id: this.newLoanForm.value.loanTypeId,
                    partner_id: this._authService.getReferralId() > 0 ? this._authService.getReferralId() : 0,
                    country_id: CONFIGURATION.country_code,
                    loan_status: this.masterData.loanStatuses.length > 0 ? this.masterData.loanStatuses[0].code : '',
                    loan_purpose: this.newLoanForm.value.loanPurpose,
                    loan_amount: parseFloat(this._validatorService.removeDelimiter(this.newLoanForm.value.loanAmount)),
                    tenor_length: parseInt(this.newLoanForm.value.tenorLength, 0),
                    tenor_type: this.formModel.newLoan.tenorType.type,
                    collection_type: this.formModel.newLoan.collectionType
                })
                .subscribe(
                response => {
                    if (response.status) {
                        let recourses = new Array<any>();
                        this.loanGuarantorForms.forEach(loanGuarantorForm => {
                            recourses.push({
                                contact_address: loanGuarantorForm.value.address,
                                contact_email: loanGuarantorForm.value.email,
                                contact_phone: loanGuarantorForm.value.mobilePhonePrefix + loanGuarantorForm.value.mobilePhoneNumber,
                                recourse_identifier: loanGuarantorForm.value.icNumber,
                                recourse_name: loanGuarantorForm.value.name,
                                countryId: CONFIGURATION.country_code,
                                recourseType: 'PG'
                            });
                        });
                        this._loanService
                            .submitLoanRecourses(recourses, response.loan_id)
                            .subscribe(
                            response => {
                                this._eventService.sendLoanEvent('guarantor-details', { 'Loan Type' : this.newLoanForm.value.loanTypeId });
                                this.newLoanForm.reset();
                                this.loanGuarantorForms = new Array<FormGroup>();
                                this.addGuarantor();
                                this.currentTab = destinationTab;
                            },
                            error => {
                                this.newLoanForm.reset();
                                this.loanGuarantorForms = new Array<FormGroup>();
                                this.addGuarantor();
                                this.currentTab = destinationTab;
                            }
                            );
                    } else {
                        this._notificationService.error(response.message);
                    }
                },
                error => {
                    this._notificationService.error();
                }
                );
        }
    }

    removeGuarantor(index: number): void {
        if (index > 0) {
            this.loanGuarantorForms.splice(index, 1);
        }
    }

    checkLoanAmount() {
      const amount = parseFloat(this._validatorService.removeDelimiter(this.newLoanForm.value.loanAmount));
      const loanType = this.formModel.newLoan.loanType;
      const loanInfo = this._baseParameterService.getMaxLoanAmount()[loanType];
      this.amountMax = loanInfo['displayAmount'];
      this.amountInvalid = amount > loanInfo['maxAmount'];
    }
}
