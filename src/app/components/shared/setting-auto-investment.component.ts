import {
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { BaseParameterService } from '../../services/base-parameter.service';
import { LoanService } from '../../services/loan.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';
import { EventService } from '../../services/event.service';
import CONFIGURATION from '../../../configurations/configuration';
import { capitalize } from 'lodash';
import { autoInvestmentSettingModel } from '../../models/auto-investment-setting.class';


@Component({
  selector: 'setting-auto-investment',
  templateUrl: './setting-auto-investment.html'
})

export class SettingAutoInvestmentComponent implements OnInit {
  autoInvestmentSettings: Array<any>;
  currency: string;
  decimalFormat: string;
  localeDecimalFormat: string;
  displayDialog: boolean;
  formModel: any;
  masterData: any;
  modal: any;
  settingAutoInvestmentForm: FormGroup;
  showautoInvestmentSettingDialog: boolean;
  showautoInvestmentSetupSuccessDialog: boolean;
  dateTimeFormat: string;
  autoInvestmentBaseSettings: any;
  now: Date;
  countryCode = CONFIGURATION.country_code;
  showInvoiceFinancingMinimumTenor: boolean;
  investorTier: string;
  exposurePerIndustry: number;
  exposurePerBorrower: number;
  initialExposurePerIndustry: number;
  initialExposurePerBorrower: number;
  autoInvestmentLoyaltySetting: any;
  loyaltyDetailPoint: any;
  isSilverTier: boolean;
  isGoldTierAndAbove: boolean;
  autoInvestmentToggle: any;
  enableLoyaltyProgram: boolean;
  showOverlayForm: boolean;
  formModelNew: any;
  interestRange: any;
  tenorRange: any;
  minCompanyAge: number;
  minCompanyAgeToggle: boolean;
  cbsIndex: number;
  minCbsToggle: boolean;
  primengSliderDecimalSetting: number;
  sliderRangeStep = 1;
  amountRangeSettings: any;
  cbsRatings: any;
  thousand = 1000;
  million = 1000000;
  monthsInYear = 12;
  selectedLoanTypeId: number;
  isEdit: boolean;
  temporaryAutoInvestmentData: any;
  toggleShowAllIndustry: boolean;
  loanTypeDescription: any;
  groupSettingWithLoyalty: any;
  autoInvestmentDefaultSetting: autoInvestmentSettingModel;
  isReverification: boolean;
  interestRateRange: any;

  constructor(
    private _authService: AuthService,
    private _eventService: EventService,
    private _baseParameterService: BaseParameterService,
    private _formBuilder: FormBuilder,
    private _loanService: LoanService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _translateService: TranslateService,
    private _renderer: Renderer2,
    private _modalService: ModalService,
  ) {
    this.isReverification = false;
    this.modal = {
      open: false
    };
    this.autoInvestmentSettings = new Array<any>();
    this.currency = CONFIGURATION.currency_symbol;
    this.dateTimeFormat = 'MMM d, y, h:mm:ss a';
    this.showautoInvestmentSettingDialog = false;
    this.decimalFormat = CONFIGURATION.format.decimal;
    this.localeDecimalFormat = CONFIGURATION.format.locale;
    this.displayDialog = false;
    this.formModel = {
      allIndustriesSelected: true,
      displayAmount: false,
      error: '',
      industries: new Array<any>(),
      info: null,
      selectedLoanType: null,
      submitError: '',
      success: '',
      validation: false,
      autoInvestmentForm: {
        loanTypeId: '',
        investmentMode: ''
      }
    };
    this.masterData = {
      investmentModes: new Array<any>(),
      loanTypes: new Array<any>()
    };
    this.autoInvestmentBaseSettings = this._baseParameterService.getAutoInvestmentSetting();
    this.showInvoiceFinancingMinimumTenor = false;
    this.exposurePerBorrower = 0;
    this.exposurePerIndustry = 0;
    this.minCompanyAge = 1;
    this.cbsIndex = 0;
    this.initialExposurePerBorrower = 0;
    this.initialExposurePerIndustry = 0;
    this.isGoldTierAndAbove = false;
    this.isSilverTier = false;
    this.loyaltyDetailPoint = [];
    this.autoInvestmentToggle = {
      exhaustBalanceToggle: null,
      borrowerExposureToggle: null,
      industryExposureToggle: null,
      showBorrowerExposureSlider: false,
      showIndustryExposureSlider: false,
    };
    this.enableLoyaltyProgram = CONFIGURATION.enableLoyaltyProgram;
    this.showOverlayForm = false;
    this.selectedLoanTypeId = null;
    this.isEdit = false;
    this.toggleShowAllIndustry = false;
    this.loanTypeDescription = [];
    this.groupSettingWithLoyalty = {
      goldTierAndAbove: 'PREMIER',
      silverAndBlueTier: 'RETAILER'
    };
    this.minCompanyAgeToggle = false;
    this.minCbsToggle = false;
    this.interestRateRange = this._baseParameterService.getAutoInvestmentInterestRateRange();
  }

  ngOnInit() {
    this._translateService
      .get('form.setting-auto-investment')
      .subscribe(
        settingAutoInvestment => {
          this.formModel.deleted = settingAutoInvestment.deleted;
          this.formModel.error = settingAutoInvestment.error;
          this.formModel.info = settingAutoInvestment.info;
          this.formModel.success = settingAutoInvestment.created;
          this.formModel.updated = settingAutoInvestment.updated;
          this.formModel.errorMaximumAmount = settingAutoInvestment['auto-investment-3-0']['error-list']['maximum-amount'];
          this.formModel.errorMinimumAmount = settingAutoInvestment['auto-investment-3-0']['error-list']['minimum-amount'];
          this.formModel.errorMaximumVsMinimumAmount = settingAutoInvestment['auto-investment-3-0']['error-list']['maximum-vs-minimum'];
          this.formModel.errorNoAmount = settingAutoInvestment['auto-investment-3-0']['error-list']['no-amount'];

        }
      );
    this._translateService
      .get('form.setting-auto-investment.auto-investment-3-0.loan-type-description')
      .subscribe(
        loanType => {
          if (loanType) {
            this.loanTypeDescription = loanType;
          }
        }
      );
    this._loanService.getAutoInvestmentDefaultSetting().subscribe(
      response => {
        this.autoInvestmentDefaultSetting = {
          cbsRatings: response.cbs_ratings,
          companyAge: response.company_age,
          exposurePerBorrower: response.max_borrower_exposure
        };
        this.exposurePerBorrower = this.autoInvestmentDefaultSetting.exposurePerBorrower.min_value;
      },
      error => {
        this._notificationService.error();
      });
    // Set up the master data for auto-investments
    // Render the auto-investment settings after all values have been fetched.
    // Major refractoring is needed to make this more readable
    this._loanService
      .getLoanTypes()
      .subscribe(
        response => {
          let validLoanTypes = [];
          let counter = 0;
          response.data
            .forEach(loanType => {
              this._loanService
                .getLoanTypeDetail(loanType.type_id)
                .subscribe(
                  loanTypeDetail => {
                    if (loanTypeDetail.tenor.length > 0 && loanTypeDetail.grade.length > 0) {
                      // Set loan type tenors
                      loanType.tenors = loanTypeDetail.tenor.map(tenor => {
                        return {
                          id: parseInt(tenor.type_id, 10),
                          tenorTypeId: parseInt(tenor.tenor_type_id, 10),
                          name: tenor.tenor_type_name.toLowerCase(),
                          minimum: parseInt(tenor.tenor_min, 10),
                          maximum: parseInt(tenor.tenor_max, 10),
                          format: parseInt(tenor.tenor_type, 10),
                          is_default: tenor.is_default
                        };
                      });
                      let tempMinInterest = 0;
                      let tempMaxInterest = 0;
                      loanTypeDetail.grade.forEach(grade => {
                        if (tempMinInterest === 0) {
                          tempMinInterest = grade.interest_min;
                        } else {
                          if (grade.interest_min < tempMinInterest) {
                            tempMinInterest = grade.interest_min;
                          }
                        }
                        if (tempMaxInterest === 0) {
                          tempMaxInterest = grade.interest_max;
                        } else {
                          if (grade.interest_max > tempMaxInterest) {
                            tempMaxInterest = grade.interest_max;
                          }
                        }
                      });
                      loanType.interestRateStep = this.sliderRangeStep;
                      loanType.minimumInterestRate = Math.floor(tempMinInterest / this.sliderRangeStep);
                      loanType.maximumInterestRate = Math.ceil(tempMaxInterest / this.sliderRangeStep);

                      // Set loan type tenor format
                      loanType.options = [];
                      if (loanType.tenors.length > 0) {
                        const tenor = loanType.tenors.find(tenorSetting => tenorSetting.is_default === true);
                        for (let i = tenor.minimum; i <= tenor.maximum; i++) {
                          loanType.options.push({
                            amount: i * tenor.format,
                            label: (i).toString() + ' ' + tenor.name + '(s)',
                            amountOrigin: i,
                            tenorName: tenor.name + 's'
                          });
                        }
                        loanType.minimumTenor = tenor.minimum;
                        loanType.maximumTenor = tenor.maximum;
                        loanType.tenorStep = 1;
                        loanType.tenorName = tenor.name + 's';
                      }

                      validLoanTypes.push(loanType);
                    }

                    if (++counter === response.data.length) {
                      this.masterData.loanTypes = validLoanTypes;
                      this._memberService
                        .getMemberMasterData(this._authService.getMemberTypeCode())
                        .subscribe(
                          response => {
                            for (let industry of response.data.industries) {
                              if (industry.countryId === CONFIGURATION.country_code) {
                                this.formModel.industries.push({
                                  code: industry.code,
                                  id: industry.id,
                                  name: industry.name,
                                  selected: true,
                                });
                              }
                            }
                            this._translateService
                              .get('master.auto-investment-modes')
                              .subscribe(
                                autoInvestmentModes => {
                                  this.masterData.investmentModes = autoInvestmentModes;
                                  this.initialize();
                                });

                          },
                          error => {
                            this._notificationService.error();
                          }
                        );
                    }
                  },
                  error => {
                    if (++counter == response.data.length) {
                      this.masterData.loanTypes = validLoanTypes;
                      this._memberService
                        .getMemberMasterData(this._authService.getMemberTypeCode())
                        .subscribe(
                          response => {
                            for (let industry of response.data.industries) {
                              if (industry.countryId === CONFIGURATION.country_code) {
                                this.formModel.industries.push({
                                  code: industry.code,
                                  id: industry.id,
                                  name: industry.name,
                                  selected: true,
                                });
                              }
                            }
                            this.initialize();
                          },
                          error => {
                            this._notificationService.error();
                          }
                        );
                    }
                  }
                );
            });
          this.autoInvestmentLoyaltySetting = this._baseParameterService.getAutoInvestmentLoyalty();
          this._memberService.getMemberRoyaltyDetail().subscribe(
            memberRoyaltyDetail => {
              if (memberRoyaltyDetail.data) {
                this.loyaltyDetailPoint = memberRoyaltyDetail.data;
                this.loyaltyDetailPoint.tier = capitalize(this.loyaltyDetailPoint.tier);
                this.loyaltyDetailPoint.next_tier_required_qualifying_points =
                  parseInt(this.loyaltyDetailPoint.next_tier_required_qualifying_points, 10);
                this.loyaltyDetailPoint.qualifying_points =
                  parseInt(this.loyaltyDetailPoint.qualifying_points, 10);
                if (this.autoInvestmentLoyaltySetting.isSilver.includes((this.loyaltyDetailPoint.tier).toUpperCase())) {
                  this.isSilverTier = true;
                }
                if (this.autoInvestmentLoyaltySetting.isGoldAndAbove.includes((this.loyaltyDetailPoint.tier).toUpperCase())) {
                  this.isGoldTierAndAbove = true;
                }
                if (this.isGoldTierAndAbove) {
                  this._loanService.getLoanAmountRange(this.countryCode, this.groupSettingWithLoyalty.goldTierAndAbove).subscribe(
                    response => {
                      this.amountRangeSettings = response.data;
                    },
                    error => {
                      this._notificationService.error();
                    });
                  this._loanService.getLoanCbsRating().subscribe(
                    response => {
                      this.cbsRatings = response.data;
                    },
                    error => {
                      this._notificationService.error();
                    });
                } else {
                  const groupAmountRangeSetting = this.enableLoyaltyProgram ? this.groupSettingWithLoyalty.silverAndBlueTier : '';
                  this._loanService.getLoanAmountRange(this.countryCode, groupAmountRangeSetting).subscribe(
                    response => {
                      // backend response is an array, so just get index 0. For blue, silver, & non loyalty there is only 1 range
                      this.amountRangeSettings = response.data[0];
                    },
                    error => {
                      this._notificationService.error();
                    });
                }
              }
            },
            error => {
              this._notificationService.error();
            });
          this._memberService
            .getMemberDetail()
            .subscribe(
              member => {
                this.autoInvestmentToggle.exhaustBalanceToggle = member.investBalance;
                if (member.exposurePerBorrower != null) {
                  this.autoInvestmentToggle.borrowerExposureToggle = true;
                  this.exposurePerBorrower = member.exposurePerBorrower;
                  this.initialExposurePerBorrower = member.exposurePerBorrower;
                }
                if (member.exposurePerIndustry != null) {
                  this.autoInvestmentToggle.industryExposureToggle = true;
                  this.exposurePerIndustry = member.exposurePerIndustry;
                  this.initialExposurePerIndustry = member.exposurePerIndustry;
                }
                if (this.countryCode === 'SG' && member.memberStatus.name === 'Reverification') {
                  this.isReverification = true;
                }
              },
              error => {
                this._notificationService.error();
              }
            );
        },
        error => {
          this._notificationService.error();
        });
  }

  initializeFormAutoInvestment(): void {
    this.settingAutoInvestmentForm = this._formBuilder.group({
      loanTypeId: new FormControl(null, [Validators.required]),
      minimumInterestRate: new FormControl(null, [Validators.required]),
      maximumInterestRate: new FormControl(null, [Validators.required]),
      minimumTenor: new FormControl(null, [Validators.required]),
      maximumTenor: new FormControl(null, [Validators.required])
    });
    if (this.enableLoyaltyProgram === false || this.isGoldTierAndAbove === false) {
      this.settingAutoInvestmentForm.addControl('minimumAmount', new FormControl(null, Validators.required));
      this.settingAutoInvestmentForm.addControl('maximumAmount', new FormControl(null, Validators.required));
    }
    if (this.isGoldTierAndAbove) {
      this.settingAutoInvestmentForm.addControl('companyAge', new FormControl(null));
      this.settingAutoInvestmentForm.addControl('cbsRating', new FormControl(null));
      for (let i = 0; i < this.amountRangeSettings.length; i++) {
        this.settingAutoInvestmentForm.addControl(`loanAmountRange-${i}`, new FormControl(this.amountRangeSettings[i]['loanRange']));
        this.settingAutoInvestmentForm.addControl(`minimumAmount-${i}`, new FormControl(null));
        this.settingAutoInvestmentForm.addControl(`maximumAmount-${i}`, new FormControl(null));
        this.settingAutoInvestmentForm.addControl(`isInvest-${i}`, new FormControl(null));
      }
    }
  }

  activateAutoInvestmentSetting(id: number, enabled: any): void {
    let autoInvestmentSetting = this.autoInvestmentSettings.find(item => item.id === id);
    if (autoInvestmentSetting) {
      let list = new Array<any>();
      list.push({
        id: id,
        enabled: enabled,
        industries: autoInvestmentSetting.industriesLabel
      })

      this._memberService
        .updateAutoInvestmentSettings({
          list: list
        })
        .subscribe(
          response => {
            this._eventService.sendAAEvent('aa-disable', {
              'Loan Type': autoInvestmentSetting.loanTypeName
            });
            if (response.status === 'success') {
              this._notificationService.success(this.formModel.updated);
            } else {
              this._notificationService.error();
            }
          },
          error => {
            this._notificationService.error();
          }
        );
    }
  }

  deleteAutoInvestmentSetting(): void {
    this._memberService
      .deleteAutoInvestmentSetting(this.temporaryAutoInvestmentData.id)
      .subscribe(
        response => {
          this._eventService.sendAAEvent('aa-delete', {
            'Loan Type': this.temporaryAutoInvestmentData.loanTypeName
          });
          this.closeModalScroll('autoInvestmentDeleteBotConfirmation');
          if (response.status === 'success') {
            this.closeOverlayForm();
            this.initialize();
            this._notificationService.success(this.formModel.deleted);
          } else {
            this._notificationService.error();
          }
        },
        error => {
          this.closeModalScroll('autoInvestmentDeleteBotConfirmation');
          this._notificationService.error();
        }
      );
  }

  initialize(): void {
    this.autoInvestmentSettings = new Array<any>();
    this._memberService
      .getAutoInvestmentSetting3()
      .subscribe(
        response => {
          response.data
            .forEach(autoInvestmentSetting => {
              let model = {
                amount: parseFloat(autoInvestmentSetting.amount),
                displayAmount: true,
                displayFullCriteria: true,
                enabled: autoInvestmentSetting.enabled,
                id: autoInvestmentSetting.id,
                industriesLabel: autoInvestmentSetting.industries.map(item => item.industryId).join(","),
                industries: this.formModel.industries.filter(industry => {
                  return autoInvestmentSetting.industries.length === 0 || !autoInvestmentSetting.industries.find(optedOutIndustry => {
                    return optedOutIndustry.industryId === industry.id;
                  });
                }),
                industriesOptedOut: this.formModel.industries.filter(industry => {
                  return autoInvestmentSetting.industries.length === 0 || autoInvestmentSetting.industries.find(optedOutIndustry => {
                    return optedOutIndustry.industryId === industry.id;
                  });
                }),
                investmentMode: null,
                loanTypeName: null,
                minimumTenorLabel: null,
                maximumTenorLabel: null,
                minimumInterestRate: null,
                maximumInterestRate: null,
                name: autoInvestmentSetting.name,
                amountSettings: null,
                cbsRating: null,
                vintageInMonths: null,
                tenorTypeName: null,
                showInvoiceFinancingMinimumTenor: this.checkShowMinimumTenor(Number(autoInvestmentSetting.loanTypeId))
              };
              const selectedLoanType = this.masterData.loanTypes.find(
                item => Number(item.type_id) === Number(autoInvestmentSetting.loanTypeId));
              if (selectedLoanType) {
                model.displayFullCriteria = selectedLoanType.is_full_criteria;
                model.loanTypeName = selectedLoanType.type_name;
                let selectedMinimumTenor = selectedLoanType.options.find(
                  item => parseFloat(item.amount) === parseFloat(autoInvestmentSetting.minimumTenor));
                if (selectedMinimumTenor) {
                  model.minimumTenorLabel = selectedMinimumTenor.amountOrigin;
                } else {
                  model.minimumTenorLabel = autoInvestmentSetting.minimumTenor;
                }
                let selectedMaximumTenor = selectedLoanType.options.find(
                  item => parseFloat(item.amount) === parseFloat(autoInvestmentSetting.maximumTenor));
                if (selectedMaximumTenor) {
                  model.maximumTenorLabel = selectedMaximumTenor.amountOrigin;
                  model.tenorTypeName = selectedMaximumTenor.tenorName;
                }
                model.minimumInterestRate = autoInvestmentSetting.minimumInterestRate;
                model.maximumInterestRate = autoInvestmentSetting.maximumInterestRate;
                model.amountSettings = autoInvestmentSetting.amountSettings;
                model.vintageInMonths = autoInvestmentSetting.vintageInMonths ?
                  autoInvestmentSetting.vintageInMonths / this.monthsInYear : null;
                model.cbsRating = autoInvestmentSetting.cbsRating;
              }
              this.autoInvestmentSettings.push(model);
            });
        },
        error => {
          this._notificationService.error(error.message);
        }
      );
  }

  onAllIndustriesSelectedChange(value: boolean): void {
    this.formModel.industries.forEach(industry => {
      industry.selected = value;
    });
  }

  onIndustrySelect(industryId: number, value: boolean): void {
    this.formModel.allIndustriesSelected = true;
    const industry = this.formModel.industries.find(industry => industry.id === industryId);
    if (industry) {
      industry.selected = value;
    }
    this.formModel.industries.forEach(industry => {
      if (!industry.selected) {
        this.formModel.allIndustriesSelected = false;
        return;
      }
    });
  }

  onLoanTypeIdChange(loanTypeId: number, autoInvestmentSetting: any = null): void {
    this.showInvoiceFinancingMinimumTenor = this.checkShowMinimumTenor(loanTypeId);
    this.formModel.allIndustriesSelected = true;
    this.onAllIndustriesSelectedChange(true);
    this.initializeFormAutoInvestment();
    this.selectedLoanTypeId = loanTypeId;
    setTimeout(() => {
      this.formModel.selectedLoanType = this.masterData.loanTypes.find(loanType => loanType.type_id == loanTypeId);
      const defaultInterestRateRange = this.interestRateRange[this.countryCode];
      if (defaultInterestRateRange) {
        this.formModel.selectedLoanType.maximumInterestRate = defaultInterestRateRange.max;
      }
      if (this.formModel.selectedLoanType) {
        this.interestRange = [
          this.formModel.selectedLoanType.minimumInterestRate,
          this.formModel.selectedLoanType.maximumInterestRate
        ];
        this.tenorRange = [
          this.formModel.selectedLoanType.minimumTenor,
          this.formModel.selectedLoanType.maximumTenor
        ];
        this.settingAutoInvestmentForm.patchValue({
          loanTypeId: loanTypeId,
          minimumAmount: null,
          maximumAmount: null
        });
        this.formModel.required = {
          minimumAmount: false,
          maximumAmount: false
        };
        if (autoInvestmentSetting) {
          this.toggleShowAllIndustry = false;
          this.onAllIndustriesSelectedChange(false);
          if (autoInvestmentSetting.industries.length > 0) {
            for (let i = 0; i < autoInvestmentSetting.industries.length; i++) {
              this.onIndustrySelect(autoInvestmentSetting.industries[i].id, true);
            }
          }
          let minimumInterestRate = autoInvestmentSetting.minimumInterestRate;
          if (minimumInterestRate < this.formModel.selectedLoanType.minimumInterestRate || // reset minimum if out of range
            minimumInterestRate > this.formModel.selectedLoanType.maximumInterestRate) {
            minimumInterestRate = this.formModel.selectedLoanType.minimumInterestRate;
          }
          let maximumInterestRate = autoInvestmentSetting.maximumInterestRate;
          if (maximumInterestRate < this.formModel.selectedLoanType.minimumInterestRate || // reset maximum if out of range
            maximumInterestRate > this.formModel.selectedLoanType.maximumInterestRate) {
            maximumInterestRate = this.formModel.selectedLoanType.maximumInterestRate;
          }
          this.interestRange = [
            minimumInterestRate,
            maximumInterestRate
          ];
          this.tenorRange = [
            autoInvestmentSetting.minimumTenorLabel,
            autoInvestmentSetting.maximumTenorLabel
          ];
          if (this.isGoldTierAndAbove) {
            if (autoInvestmentSetting.amountSettings.length > 0) {
              for (let i = 0; i < this.amountRangeSettings.length; i++) {
                for (let j = 0; j < autoInvestmentSetting.amountSettings.length; j++) {
                  if (autoInvestmentSetting.amountSettings[j].loanAmountRange) {
                    if (Number(this.amountRangeSettings[i]['loanRange'][0]) ===
                      Number(autoInvestmentSetting.amountSettings[j].loanAmountRange[0])) {
                      this.settingAutoInvestmentForm.setControl(`minimumAmount-${i}`,
                        new FormControl(autoInvestmentSetting.amountSettings[j].minimumAmount));
                      this.settingAutoInvestmentForm.setControl(`maximumAmount-${i}`,
                        new FormControl(autoInvestmentSetting.amountSettings[j].maximumAmount));
                      this.settingAutoInvestmentForm.setControl(`isInvest-${i}`, new FormControl('true'));
                    }
                  }
                }
              }
            }
          } else {
            if (autoInvestmentSetting.amountSettings.length > 0) {
              this.settingAutoInvestmentForm.patchValue({
                minimumAmount: Math.round(autoInvestmentSetting.amountSettings[0].minimumAmount),
                maximumAmount: Math.round(autoInvestmentSetting.amountSettings[0].maximumAmount)
              });
            }
          }
          if (autoInvestmentSetting.vintageInMonths) {
            this.settingAutoInvestmentForm.patchValue({
              companyAge: Math.round(autoInvestmentSetting.vintageInMonths)
            });
            this.minCompanyAge = Math.round(autoInvestmentSetting.vintageInMonths);
            this.minCompanyAgeToggle = true;
          }
          if (autoInvestmentSetting.cbsRating) {
            this.settingAutoInvestmentForm.patchValue({
              cbsRating: autoInvestmentSetting.cbsRating
            });
            for (let i = 0; i < this.autoInvestmentDefaultSetting.cbsRatings.length; i++) {
              if (this.autoInvestmentDefaultSetting.cbsRatings[i] === autoInvestmentSetting.cbsRating) {
                this.cbsIndex = i;
                this.minCbsToggle = true;
              }
            }
          }
        }
      }
    }, 300);
  }

  onSettingAutoInvestmentFormSubmit(): void {
    const selectedTenor = this.formModel.selectedLoanType.tenors.find(tenor =>
      tenor.is_default === true);
    this.formModel.submitError = '';
    this.formModel.validation = true;
    this.settingAutoInvestmentForm.patchValue({
      minimumTenor: this.showInvoiceFinancingMinimumTenor ? this.tenorRange[0] * selectedTenor.format : 1,
      maximumTenor: this.tenorRange[1] * selectedTenor.format,
      minimumInterestRate: this.interestRange[0],
      maximumInterestRate: this.interestRange[1],
      companyAge: this.minCompanyAgeToggle ? this.minCompanyAge * this.monthsInYear : null,
      cbsRating: this.minCbsToggle ? this.autoInvestmentDefaultSetting.cbsRatings[this.cbsIndex] : null,
    });
    if (this.settingAutoInvestmentForm.valid) {
      let passedValidation = true;
      let amountSettings;
      if (this.enableLoyaltyProgram === false || this.isGoldTierAndAbove === false) {
        this.formModel.required = {
          minimumAmount: false,
          maximumAmount: false
        };
        if (Number(this.settingAutoInvestmentForm.value.minimumAmount) < Number(this.amountRangeSettings.investmentRange[0])) {
          this._notificationService.error(this.formModel.errorMinimumAmount + ' :' +
            this.currency + this.amountRangeSettings.investmentRange[0]);
          this.formModel.required.minimumAmount = true;
          passedValidation = false;
        } else if (Number(this.settingAutoInvestmentForm.value.minimumAmount) > Number(this.amountRangeSettings.investmentRange[1])) {
          this._notificationService.error(this.formModel.errorMaximumAmount + ' :' + this.currency + this.amountRangeSettings.investmentRange[1]);
          this.formModel.required.minimumAmount = true;
          passedValidation = false;
        } else if (Number(this.settingAutoInvestmentForm.value.maximumAmount) > Number(this.amountRangeSettings.investmentRange[1])) {
          this._notificationService.error(this.formModel.errorMaximumAmount + ' :' + this.currency + this.amountRangeSettings.investmentRange[1]);
          this.formModel.required.maximumAmount = true;
          passedValidation = false;
        } else if (Number(this.settingAutoInvestmentForm.value.maximumAmount)
          < Number(this.settingAutoInvestmentForm.value.minimumAmount)) {
          this._notificationService.error(this.formModel.errorMaximumVsMinimumAmount);
          this.formModel.required.maximumAmount = true;
          passedValidation = false;
        }
        amountSettings = [{
          minimumAmount: this.settingAutoInvestmentForm.value.minimumAmount,
          maximumAmount: this.settingAutoInvestmentForm.value.maximumAmount,
          loanAmountRange: this.amountRangeSettings.loanRange
        }];
      }
      if (this.isGoldTierAndAbove) {
        amountSettings = [];
        this.formModel.required = [];
        for (let i = 0; i < this.amountRangeSettings.length; i++) {
          if (this.settingAutoInvestmentForm.value[`isInvest-${i}`] === 'true') {
            if (Number(this.settingAutoInvestmentForm.value[`minimumAmount-${i}`])
              < Number(this.amountRangeSettings[i].investmentRange[0])) {
              this._notificationService.error(this.formModel.errorMinimumAmount + ' :' +
                this.currency + this.amountRangeSettings[i].investmentRange[0]);
              this.formModel.required[`minimumAmount-${i}`] = true;
              passedValidation = false;
            } else if (
              (this.amountRangeSettings[i].investmentRange[1] &&
                Number(this.settingAutoInvestmentForm.value[`minimumAmount-${i}`]) >
                Number(this.amountRangeSettings[i].investmentRange[1]))) {
              this._notificationService.error(this.formModel.errorMaximumAmount + ' :' + this.currency +
                this.amountRangeSettings[i].investmentRange[1]);
              this.formModel.required[`minimumAmount-${i}`] = true;
              passedValidation = false;
            } else if (
              (this.amountRangeSettings[i].investmentRange[1] &&
                Number(this.settingAutoInvestmentForm.value[`maximumAmount-${i}`]) >
                Number(this.amountRangeSettings[i].investmentRange[1]))) {
              this._notificationService.error(this.formModel.errorMaximumAmount + ' :' + this.currency +
                this.amountRangeSettings[i].investmentRange[1]);
              this.formModel.required[`maximumAmount-${i}`] = true;
              passedValidation = false;
            } else if (Number(this.settingAutoInvestmentForm.value[`maximumAmount-${i}`]) <
              Number(this.settingAutoInvestmentForm.value[`minimumAmount-${i}`])) {
              this._notificationService.error(this.formModel.errorMaximumVsMinimumAmount);
              this.formModel.required[`maximumAmount-${i}`] = true;
              passedValidation = false;
            } else {
              amountSettings.push({
                minimumAmount: this.settingAutoInvestmentForm.value[`minimumAmount-${i}`],
                maximumAmount: this.settingAutoInvestmentForm.value[`maximumAmount-${i}`],
                loanAmountRange: this.settingAutoInvestmentForm.value[`loanAmountRange-${i}`]
              });
            }
          }
        }
        if (passedValidation && amountSettings.length === 0) {
          this._notificationService.error(this.formModel.errorNoAmount);
          passedValidation = false;
        }
      }
      if (this.formModel.industries.filter(item => item.selected).length === 0) {
        this._notificationService.error(this.formModel.info['no-industry']);
        passedValidation = false;
      }
      if (passedValidation) {
        if (this.isEdit) {
          let list = new Array<any>();
          list.push({
            loanTypeId: Number(this.settingAutoInvestmentForm.value.loanTypeId),
            minimumTenor: parseFloat(this.settingAutoInvestmentForm.value.minimumTenor),
            maximumTenor: parseFloat(this.settingAutoInvestmentForm.value.maximumTenor),
            minimumInterestRate: parseFloat(this.settingAutoInvestmentForm.value.minimumInterestRate),
            maximumInterestRate: parseFloat(this.settingAutoInvestmentForm.value.maximumInterestRate),
            amountSettings: amountSettings,
            industries: this.formModel.industries.filter(item => !item.selected).map(item => item.id).join(','),
            vintageInMonths: this.settingAutoInvestmentForm.value.companyAge ?
              this.settingAutoInvestmentForm.value.companyAge : null,
            cbsRating: this.settingAutoInvestmentForm.value.cbsRating ?
              this.settingAutoInvestmentForm.value.cbsRating : null,
            id: this.temporaryAutoInvestmentData.id
          });
          this._memberService
            .updateAutoInvestmentSettings({
              list: list
            }).subscribe(
              response => {
                if (response.status === 'success') {
                  const loanTypeName = this.masterData.loanTypes.find(element => {
                    return element.type_id === Number(this.settingAutoInvestmentForm.value.loanTypeId);
                  }).type_name;
                  this._eventService.sendAAEvent('aa-edit', {
                    'Loan Type': loanTypeName
                  });
                  this.initialize();
                  this.closeOverlayForm();
                  this.openAutoInvestmentSetupSuccessDialog();
                  this.now = new Date();
                  this.settingAutoInvestmentForm.reset();
                  this.formModel.allIndustriesSelected = true;
                  this.onAllIndustriesSelectedChange(true);
                  this.formModel.validation = false;
                } else {
                  this._notificationService.error(this.formModel.error);
                }
              },
              error => {
                this._notificationService.error(error.message);
              }
            );
        } else {
          const autoInvestmentSetting = {
            loanTypeId: Number(this.settingAutoInvestmentForm.value.loanTypeId),
            minimumTenor: parseFloat(this.settingAutoInvestmentForm.value.minimumTenor),
            maximumTenor: parseFloat(this.settingAutoInvestmentForm.value.maximumTenor),
            minimumInterestRate: parseFloat(this.settingAutoInvestmentForm.value.minimumInterestRate),
            maximumInterestRate: parseFloat(this.settingAutoInvestmentForm.value.maximumInterestRate),
            investOnAmountAllowed: null,
            amountSettings: amountSettings,
            industries: this.formModel.industries.filter(item => !item.selected).map(item => item.id).join(','),
            vintageInMonths: this.settingAutoInvestmentForm.value.companyAge ?
              this.settingAutoInvestmentForm.value.companyAge : null,
            cbsRating: this.settingAutoInvestmentForm.value.cbsRating ?
              this.settingAutoInvestmentForm.value.cbsRating : null,
          };
          this._memberService.addAutoInvestmentSetting(autoInvestmentSetting)
            .subscribe(
              response => {
                if (response.status === 'success') {
                  const loanTypeName = this.masterData.loanTypes.find(element => {
                    return element.type_id === Number(this.settingAutoInvestmentForm.value.loanTypeId);
                  }).type_name;
                  this._eventService.sendAAEvent('aa-create', {
                    'Loan Type': loanTypeName
                  });
                  this.initialize();
                  this.closeOverlayForm();
                  this.openAutoInvestmentSetupSuccessDialog();
                  this.now = new Date();
                  this.settingAutoInvestmentForm.reset();
                  this.formModel.allIndustriesSelected = true;
                  this.onAllIndustriesSelectedChange(true);
                  this.formModel.validation = false;
                } else {
                  this._notificationService.error(this.formModel.error);
                }
              },
              error => {
                this._notificationService.error(error.message);
              }
            );
        }
      }
    } else {
      this._notificationService.error(this.formModel.info['required']);
    }
  }

  openAutoInvestmentSetupSuccessDialog() {
    this.showautoInvestmentSetupSuccessDialog = true;
  }

  closeAutoInvestmentSetupSuccessDialog() {
    this.showautoInvestmentSetupSuccessDialog = false;
  }

  toggleAutoinvestmentSettings(isChecked: Boolean, toggleId: string, isValueUpdate: boolean = false): void {
    let body;
    this.autoInvestmentToggle[toggleId] = isChecked;
    if (toggleId === 'exhaustBalanceToggle') {
      body = {
        investBalance: isChecked
      };
    }
    if (toggleId === 'borrowerExposureToggle') {
      this.autoInvestmentToggle.showBorrowerExposureSlider = true;
      body = {
        exposurePerBorrower: isChecked ? this.exposurePerBorrower : null
      };
    }
    if (toggleId === 'industryExposureToggle') {
      this.autoInvestmentToggle.showIndustryExposureSlider = true;
      body = {
        exposurePerIndustry: isChecked ? this.exposurePerIndustry : null
      };
    }
    this._memberService
      .updateMember(
        body).subscribe(
          response => {
            if (response.status === 'success') {
              this._notificationService.success(this.formModel.updated);
              if (toggleId === 'borrowerExposureToggle') {
                this.initialExposurePerBorrower = this.exposurePerBorrower;
                if (!isValueUpdate && isChecked) {
                  this.autoInvestmentToggle.showBorrowerExposureSlider = true;
                } else {
                  this.autoInvestmentToggle.showBorrowerExposureSlider = false;
                }
              }
              if (toggleId === 'industryExposureToggle' && isChecked) {
                this.initialExposurePerIndustry = this.exposurePerIndustry;
                if (!isValueUpdate && isChecked) {
                  this.autoInvestmentToggle.showIndustryExposureSlider = true;
                } else {
                  this.autoInvestmentToggle.showIndustryExposureSlider = false;
                }
              }
            } else {
              this._notificationService.error(response.message);
            }
          },
          error => {
            this._notificationService.error();
          }
        );
  }

  cancel(exposureType: string): void {
    if (exposureType === 'borrowerExposure') {
      this.autoInvestmentToggle.showBorrowerExposureSlider = false;
      this.exposurePerBorrower = this.initialExposurePerBorrower;
    }
    if (exposureType === 'industryExposure') {
      this.autoInvestmentToggle.showIndustryExposureSlider = false;
      this.exposurePerIndustry = this.initialExposurePerIndustry;
    }
  }

  openOverlayForm(): void {
    this.minCbsToggle = false;
    this.minCompanyAgeToggle = false;
    this._renderer.addClass(document.body, 'no-scroll');
    this._renderer.addClass(document.body, 'modal-open-fix-for-ios');
    this.showOverlayForm = true;
    this.selectedLoanTypeId = null;
  }

  closeOverlayForm(): void {
    this._renderer.removeClass(document.body, 'no-scroll');
    this._renderer.removeClass(document.body, 'modal-open-fix-for-ios');
    this.formModel.selectedLoanType = null;
    this.showOverlayForm = false;
    this.isEdit = false;
    this.temporaryAutoInvestmentData = null;
  }

  convertAmountRange(value: number) {
    if (value >= this.million) {
      return (Math.floor(value / this.million)).toString() + 'm';
    } else if (value >= this.thousand) {
      return (Math.floor(value / this.thousand)).toString() + 'k';
    } else {
      return value;
    }
  }

  setFormControl(index: number) {
    const min = this.settingAutoInvestmentForm.value[`minimumAmount-${index}`];
    const max = this.settingAutoInvestmentForm.value[`maximumAmount-${index}`];
    if (this.settingAutoInvestmentForm.value[`isInvest-${index}`] === 'true') {
      this.settingAutoInvestmentForm.setControl(`minimumAmount-${index}`, new FormControl(min, [Validators.required]));
      this.settingAutoInvestmentForm.setControl(`maximumAmount-${index}`, new FormControl(max, [Validators.required]));
    } else {
      this.settingAutoInvestmentForm.setControl(`minimumAmount-${index}`, new FormControl(min, []));
      this.settingAutoInvestmentForm.setControl(`maximumAmount-${index}`, new FormControl(max, []));
    }
  }

  editAutoInvestSetting(autoInvestmentSetting: any): void {
    this.openOverlayForm();
    this.isEdit = true;
    const loanType = this.masterData.loanTypes.find(item => item.type_name === autoInvestmentSetting.loanTypeName);
    autoInvestmentSetting.loanTypeId = loanType.type_id;
    this.temporaryAutoInvestmentData = autoInvestmentSetting;
    this.onLoanTypeIdChange(loanType.type_id, autoInvestmentSetting);
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  closeModalScroll(id: string): void {
    this._modalService.close(id);
    this._renderer.addClass(document.body, 'no-scroll');
    this._renderer.addClass(document.body, 'modal-open-fix-for-ios');
  }

  getLoanTypeDescription(id: number) {
    if (this.loanTypeDescription.length > 0) {
      const loanTypeDescription = this.loanTypeDescription.find(desc => desc.id === id);
      if (loanTypeDescription) {
        return loanTypeDescription.description;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  checkShowMinimumTenor(loanTypeId) {
    const invoiceFinancingSetting = this.autoInvestmentBaseSettings.find(settings => {
      return settings.code === 'IF';
    });
    return this.countryCode === 'ID' ? loanTypeId !== invoiceFinancingSetting.loanTypeId : true;
  }

  toggleMinCompanyAge(isChecked: boolean): void {
    this.minCompanyAgeToggle = isChecked;
  }

  toggleMinCBS(isChecked: boolean): void {
    this.minCbsToggle = isChecked;
  }
}
