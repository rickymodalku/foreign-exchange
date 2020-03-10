import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';

import {
  SwiperComponent,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import CONFIGURATION from '../../../../../configurations/configuration';
import { DialogService } from '../../../../services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { WindowService } from '../../../../services/window.service';
import { ModalService } from '../../../../services/modal.service';
import { ValidatorService } from '../../../../services/validator.service';
import { NotificationService } from '../../../../services/notification.service';
import { MemberService } from '../../../../services/member.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BaseParameterService } from '../../../../services/base-parameter.service';

@Component({
  selector: 'referral',
  templateUrl: './referral-dashboard.html'
})
export class ReferralDashboardComponent implements AfterViewInit, OnInit {
  benefits: Array<any>;
  borrowerReferralEmail: string;
  rewards: Array<any>;
  selectedBonus: boolean;
  selectedNewUser: boolean;
  showBorrowerReferralText: boolean;
  mobileSwipeConfig: SwiperConfigInterface;
  rewardSwiperConfig: SwiperConfigInterface;
  @ViewChild('rewardSwiper', { static: false }) swiperWrapper: any;
  countryCode: string;
  referralBorrowerForm: FormGroup;
  subscribeReferralForm: FormGroup;
  formModel: any;

  constructor(
    private _dialogService: DialogService,
    private _translateService: TranslateService,
    private _windowService: WindowService,
    private _modalService: ModalService,
    private _validatorService: ValidatorService,
    private _memberService: MemberService,
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService,
    private _activatedRoute: ActivatedRoute,
    private _baseParameterService: BaseParameterService,
    private _router: Router,
  ) {
    this.borrowerReferralEmail = CONFIGURATION.borrower_referral_email.email;
    this.benefits = new Array();
    this.rewards = new Array();
    this.showBorrowerReferralText = CONFIGURATION.borrower_referral_email.show;
    this.selectedBonus = true;
    this.selectedNewUser = false;
    this.countryCode = CONFIGURATION.country_code;

    this.mobileSwipeConfig = {
      scrollbar: null,
      autoplay: 2000,
      direction: 'horizontal',
      slidesPerView: 1,
      scrollbarHide: false,
      keyboardControl: true,
      mousewheelControl: false,
      loop: true,
      scrollbarDraggable: true,
      scrollbarSnapOnRelease: true,
      pagination: '.swiper-pagination',
      paginationClickable: true
    };


    this.rewardSwiperConfig = {
      scrollbar: null,
      direction: 'horizontal',
      slidesPerView: 1,
      scrollbarHide: false,
      keyboardControl: true,
      mousewheelControl: false,
      scrollbarDraggable: true,
      scrollbarSnapOnRelease: true
    };
    this.formModel = {
      referralBorrower: {
        error: '',
        success: '',
        validation: false
      },
      subscribeReferral: {
        error: '',
        success: '',
        validation: false
      }
    };
    this.referralBorrowerForm = this._formBuilder.group({
      referralCompany: new FormControl(null, [Validators.required]),
      referralEmail: new FormControl(null, [Validators.required, Validators.email]),
      referralFullName: new FormControl(null, [Validators.required]),
      referralMobilePhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(this._validatorService.numberPattern)]),
      referrerCompany: new FormControl(null, []),
      referrerEmail: new FormControl(null, [Validators.required, Validators.email]),
      referrerFullName: new FormControl(null, [Validators.required]),
      referrerMobilePhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(this._validatorService.numberPattern)]),
    });
    this.subscribeReferralForm = this._formBuilder.group({
      fullName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  ngOnInit() {
    const benefits = [
      { key: 'attractive-rewards', logo: 'assets/img/_public/dashboard/rewards-icon-white.svg', desc: '' },
      { key: 'low-time-commitment', logo: 'assets/img/_public/dashboard/time-icon-white.svg', desc: '' },
      { key: 'new-channel-of-income', logo: 'assets/img/_public/dashboard/income-icon-white.svg', desc: '' },
    ];

    this._translateService
      .get('refer.benefit')
      .subscribe(
        translatedBenefits => {
          benefits.forEach(benefit => {
            benefit.desc = translatedBenefits[benefit.key];
          });
          this.benefits = benefits;
        }
      );

    this._translateService
      .get('refer.reward-offer.reward')
      .subscribe(
        rewards => {
          this.rewards = rewards;
        }
      );
    if (this.countryCode === 'SG') {
      this._translateService
        .get('form.referral')
        .subscribe(
          referral => {
            this.formModel.referralBorrower.error = referral.error;
            this.formModel.referralBorrower.success = referral.success;
          }
        );
      this._translateService
        .get('form.referral-signup')
        .subscribe(
          referralSignup => {
            this.formModel.subscribeReferral.error = referralSignup.error;
            this.formModel.subscribeReferral.success = referralSignup.success;
          }
        );

    }
  }
  ngAfterViewInit() {
    if (this.countryCode === 'SG') {
      this._activatedRoute.params.subscribe((params: Params) => {
        if (params['section'] === this._baseParameterService.getReferSection().name) {
          this.scrollDown(this._baseParameterService.getReferSection().elementID);
        }
        if (this._router.url === '/refer/sme') {
          this.openModal('referralBorrower');
        }
      });
    }
  }
  changeRewardOffer(string: string) {
    this.selectedBonus = false;
    this.selectedNewUser = false;
    if (string === 'bonus') {
      this.selectedBonus = true;
      this.swiperWrapper.nativeElement.swiper.slideTo(0);
      return;
    }
    if (string === 'newuser') {
      this.selectedNewUser = true;
      this.swiperWrapper.nativeElement.swiper.slideTo(1);
      return;
    }
  }

  displaySignUpDialog(): void {
    this._dialogService.displaySignUpDialog();
  }

  scrollDown(string: any) {
    this._windowService.smoothScroll(string);
  }

  emailBorrowerReferral() {
    const formattedBody = "Company Name:\nContact Name:\nDesignation:\nContact Number:\nEmail Address:";
    const emailLink = `mailto:` + this.borrowerReferralEmail + `?Subject=SME Referral via Borrow page&body=` + encodeURIComponent(formattedBody);
    window.location.href = emailLink;
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  onReferralBorrowerFormSubmit(): void {
    this.formModel.referralBorrower.validation = true;
    let referralBorrowerValid = this.referralBorrowerForm.valid;
    if (referralBorrowerValid) {
      if (!this.referralBorrowerForm.value.referrerCompany) {
        this.referralBorrowerForm.patchValue({
          referrerCompany: "-"
        });
      }
      this._memberService
        .addReferralBorrower(this.referralBorrowerForm.value, this.countryCode, CONFIGURATION.member_type_code.borrower)
        .subscribe(
          response => {
            this.closeModal('referralBorrower');
            this.formModel.referralBorrower.validation = false;
            this.referralBorrowerForm.reset();
            this._notificationService.success(this.formModel.referralBorrower.success);
          },
          error => {
            this._notificationService.error(this.formModel.referralBorrower.error);
          }
        );
    } else {
      window.scrollTo(0, 0);
    }
  }

  onReferralSubscribe(): void {
    this.formModel.subscribeReferral.validation = true;
    let subscribeValid = this.subscribeReferralForm.valid;
    if (subscribeValid) {
      this._memberService
        .signupReferralUpdates(this.subscribeReferralForm.value, this.countryCode, CONFIGURATION.member_type_code.borrower)
        .subscribe(
          response => {
            this.formModel.subscribeReferral.validation = false;
            this.subscribeReferralForm.reset();
            this._notificationService.success(this.formModel.subscribeReferral.success);
          },
          error => {
            this._notificationService.error(this.formModel.subscribeReferral.error);
          }
        );
    }
  }

  goToReferralPage() {
    if (this.countryCode === 'MY') {
      window.open('https://borrow.fundingsocieties.com.my/smereferral1/','_blank');
    } else {
      this.scrollDown('rewardContainer');
    }
  }
}
