import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Inject,
  ElementRef,
  HostListener
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  SwiperComponent,
  SwiperConfigInterface,
  SwiperDirective
} from 'ngx-swiper-wrapper';
import { WOW } from 'wowjs/dist/wow.min';
import { PasswordRestriction } from '../../../models/auth.class';
import { BorrowerLoan, ZohoLead } from '../../../models/member.class';
import { AuthService } from '../../../services/auth.service';
import { CryptographyService } from '../../../services/cryptography.service';
import { DialogService } from '../../../services/dialog.service';
import { FinanceService } from '../../../services/finance.service';
import { MemberService } from '../../../services/member.service';
import { ModalService } from 'app/services/modal.service';
import { NotificationService } from '../../../services/notification.service';
import { MessageService } from '../../../services/message.service';
import { UtilityService } from '../../../services/utility.service';
import { ValidatorService } from '../../../services/validator.service';
import CONFIGURATION from '../../../../configurations/configuration';
import { EventService } from '../../../services/event.service';
import { WindowService } from '../../../services/window.service';
import { SessionStorageService } from 'ngx-webstorage';
import { MaintenanceService } from '../../../services/maintenance.service';
import { TwoFaPhoneNumberConfig } from '../../../components/two-fa/two-fa-common/two-fa-interface';
import { FeatureFlagService } from '../../../services/feature-flag.service';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'home',
  templateUrl: './home.html',
  host: { '(window:scroll)': 'onScroll($event)' }
})

export class HomeComponent implements AfterViewInit, OnInit {
  index: number;
  asFeaturedInContent: Array<any>;
  asFeaturedOnContent: Array<any>;
  asFeaturedInDataFlag: boolean;
  asFeaturedOnDataFlag: boolean;
  borrowForm: FormGroup;
  borrowFormModel: any;
  countryCode: string;
  companyTypes: Array<any>;
  campaignBannerList: Array<any>;
  currencySymbol: string;
  formTab: any;
  formModel: any;
  howDidYouFindUsSourcesBorrower: Array<any>;
  howDidYouFindUsSourcesInvestor: Array<any>;
  howThisWork: Array<any>;
  howThisWorkDataReady: boolean;
  imageBaseUrl: string;
  investForm: FormGroup;
  testimonialContent: Array<any>;
  testimonialContentFilter: Array<any>;
  testimonialDataFlag: boolean;
  totalFunded: String;
  investSelected: boolean;
  loanTenors: Array<any>;
  memberTypeCodes: any;
  signUpCaption: any;
  signUpBorrowCaption: any;
  signUpInvestCaption: any;
  slides: Array<string>;
  storiesCaption: string;
  swiperConfiguration: SwiperConfigInterface;
  bannerSwiperConfiguration: SwiperConfigInterface;
  homepageSwiperConfiguration: SwiperConfigInterface;
  wow: any;
  zohoModel: ZohoLead;
  campaignParameter: string;
  excludeParameter: string;
  CONFIGURATION: any;
  investorPhoneNumberConfig: TwoFaPhoneNumberConfig;
  borrowerPhoneNumberConfig: TwoFaPhoneNumberConfig;
  backgroundImage: string;
  ojkStatistic: any;
  showOjkStatistic: boolean;
  showAfpiLogo: boolean;
  decimalFormat: string;
  localeDecimalFormat: string;
  featureFlagObservable: Observable<any>;

  // Banner
  showCampaignBanner: boolean;
  isMultipleCampaignBanner: boolean;
  campaignBannerModal: string;
  showBannerSticky: boolean;
  isOnHtmlTop: boolean;
  elementPosition: any;
  scrollSubject = new Subject<number>();
  scrollObservable = this.scrollSubject.asObservable().pipe(throttleTime(10));
  activeBannerSlide: number;
  isModalBannerActive: boolean;
  showMoreInfo: boolean;

  @ViewChild('scrafpi', { static: false }) scrafpi: ElementRef;
  @ViewChild('homepageSwipper', { static: false }) homepageSwipper: SwiperDirective;
  @ViewChild('swiperWrapper', { static: false }) swiperWrapper: any;
  @ViewChild('bannerSwipper', { static: false }) bannerSwipper: SwiperDirective;
  @ViewChild('stickyBannerSwipper', { static: false }) stickyBannerSwipper: SwiperDirective;
  @ViewChild('mobileStickyBannerSwipper', { static: false }) mobileStickyBannerSwipper: SwiperDirective;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _cryptographyService: CryptographyService,
    private _dialogService: DialogService,
    private featureFlagService: FeatureFlagService,
    private _financeService: FinanceService,
    private _formBuilder: FormBuilder,
    private _memberService: MemberService,
    private _modalService: ModalService,
    private messageService: MessageService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _translateService: TranslateService,
    private _utilityService: UtilityService,
    private _validatorService: ValidatorService,
    private _windowService: WindowService,
    private _eventService: EventService,
    private _sessionStorageService: SessionStorageService,
    private _maintenanceService: MaintenanceService,
    @Inject(DOCUMENT) private document
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.asFeaturedOnContent = new Array<any>();
    this.asFeaturedInContent = new Array<any>();
    this.countryCode = CONFIGURATION.country_code;
    this.currencySymbol = CONFIGURATION.currency_symbol;
    this.borrowForm = this._formBuilder.group({
      companyName: new FormControl(null, [Validators.required]),
      companyType: new FormControl(null, [Validators.required]),
      companyRevenue: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      fullName: new FormControl(null, [Validators.required]),
      loanAmount: new FormControl(null, [Validators.required, this._validatorService.validatePositiveDecimal]),
      loanTenor: new FormControl(null, [Validators.required]),
      mobilePhoneNumber: new FormControl(null, [Validators.required]),
      howDidYouFindUs: new FormControl(null, [Validators.required]),
      howDidYouFindUsOther: new FormControl(null, [])
    });
    this.borrowFormModel = {
      valueFrom: 0,
      valueTo: 0,
      loanAmount: 0,
      loanTenor: 0
    };
    this.companyTypes = new Array<any>();
    this.investForm = this._formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      fullName: new FormControl(null, [Validators.required]),
      howDidYouFindUs: new FormControl(null, [Validators.required]),
      howDidYouFindUsOther: new FormControl(null, []),
      mobilePhoneNumber: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      referralRemark: new FormControl(null, []),
      retypedPassword: new FormControl(null, [Validators.required])
    });
    this.howThisWorkDataReady = false;
    this.testimonialContent = new Array<any>();
    this.testimonialContentFilter = new Array<any>();
    const storedTotalFunded = this._sessionStorageService.retrieve('totalFunded');
    this.totalFunded = typeof storedTotalFunded === 'string' && storedTotalFunded.length > 0 ? storedTotalFunded : '';
    this.investSelected = false;
    this.formTab = {
      borrow: true,
      invest: false
    };
    this.formModel = {
      borrow: {
        howDidYouFindUsOtherValid: true,
        accepted: true,
        error: '',
        gclid: '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
        success: '',
        showHowDidYouFindUsOther: false,
        validation: false,
        mobilePhoneValidation: true
      },
      invest: {
        accepted: true,
        error: '',
        howDidYouFindUsOtherValid: true,
        memberTypeCode: CONFIGURATION.member_type_code.investor,
        params: new Array<any>(),
        passwordRestrictions: new Array<PasswordRestriction>(),
        passwordValid: true,
        retypedPasswordMatches: true,
        showHowDidYouFindUsOther: false,
        success: '',
        validation: false,
        mobilePhoneValidation: true
      }
    };
    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.backgroundImage = this.imageBaseUrl + '/fs-homepage-main.jpg';
    this.howDidYouFindUsSourcesBorrower = new Array<any>();
    this.howDidYouFindUsSourcesInvestor = new Array<any>();
    this.howThisWork = new Array<any>();
    this.testimonialDataFlag = false;
    this.loanTenors = new Array<any>();
    this.memberTypeCodes = CONFIGURATION.member_type_code;
    this.signUpCaption = {
      button: '',
      caption: '',
      captionStories: '',
      title: ''
    };
    this.signUpBorrowCaption = Array<any>();
    this.signUpInvestCaption = Array<any>();
    this.slides = Array<string>();
    this.storiesCaption = 'Investor Stories';
    this.bannerSwiperConfiguration = {
      slidesPerView: 1,
      autoplay: 4000,
      prevButton: '.swiper-button-prev',
      nextButton: '.swiper-button-next',
    };
    this.homepageSwiperConfiguration = {
      direction: 'horizontal',
      autoplay: 4000,
      pagination: '.swiper-pagination',
      paginationClickable: true,
      slidesPerView: 1
    };
    this.swiperConfiguration = {
      centeredSlides: true,
      direction: 'horizontal',
      loop: true,
      slidesPerView: 3,
      pagination: '.swiper-pagination',
      prevButton: '.swiper-button-prev',
      nextButton: '.swiper-button-next',
      breakpoints: {
        480: {
          slidesPerView: 1,
          autoplay: 3000,
          spaceBetween: 10,
          paginationClickable: true
        },
        860: {
          slidesPerView: 2,
          spaceBetween: 0
        },
      }
    };
    this.wow = new WOW();
    this.campaignParameter = null;
    this.excludeParameter = 'referral';
    this.investorPhoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };
    this.borrowerPhoneNumberConfig = {
      mode: 'ANY',
      allowDropDown: true,
      onlyCountries: [(this.countryCode.toLowerCase())],
      mobilePhoneNumber: '',
      autoPlaceholder: 'polite'
    };
    this.decimalFormat = CONFIGURATION.format.decimal;
    this.localeDecimalFormat = CONFIGURATION.format.locale;
    this.showOjkStatistic = false;
    this.showAfpiLogo = false;
    this.campaignBannerList = Array<any>();
    this.isMultipleCampaignBanner = false;
    this.showCampaignBanner = false;
    this.campaignBannerModal = 'campaignBannerModal';
    this.showBannerSticky = false;
    this.isOnHtmlTop = true;
    this.isModalBannerActive = CONFIGURATION.modalPromoBanner;
    this.activeBannerSlide = 0;
    this.showMoreInfo = false;
  }

  initializeCampaignBannerList() {
    const campaignBannerList = {
      ID: [
        {
          title: 'Yuk, Investasi membangun negeri melalui SR012!',
          caption: 'Masa penawaran 24 Februari - 18 Maret 2020',
          imageName: this.imageBaseUrl + '/sr012/sr012-homepage-banner.png',
          imageMobileName: this.imageBaseUrl + '/sr012/sr012-homepage-banner-mobile.png',
          marketingLink: './sbn-info',
          stickyMoreInfoEvent: 'sr012-sticky-more-info',
          modalMoreInfoEvent: 'sr012-modal-more-info',
          stickyOpenPopUpEvent: 'sr012-sticky-open-pop-up',
          carouselMoreInfoEvent: 'sr012-carousel-more-info',
          showInvestForm: false,
          clickable: true,
        },
        {
          title: 'Layanan Konsumen Modalku',
          caption: 'Hati - hati terhadap penipuan',
          imageName: this.imageBaseUrl + '/information-pop-up/himbauan-penipuan.jpg',
          imageMobileName: this.imageBaseUrl + '/information-pop-up/himbauan-penipuan-mobile.jpg',
          marketingLink: '',
          stickyMoreInfoEvent: 'modalku-cs-info-1-sticky-more-info',
          modalMoreInfoEvent: 'modalku-cs-info-1-modal-more-info',
          stickyOpenPopUpEvent: 'modalku-cs-info-1-sticky-open-pop-up',
          carouselMoreInfoEvent: 'modalku-cs-info-1-carousel-more-info',
          showInvestForm: false,
          clickable: false,
        }
      ],
      MY: [
        {
          title: '',
          caption: '',
          imageName: this.imageBaseUrl + '/running-man/running-man-homepage-banner.jpg',
          imageMobileName: this.imageBaseUrl + '/running-man/running-man-homepage-mobile.jpg',
          marketingLink: 'https://sme.fundingsocieties.com.my/fast-approval-sme-financing/#lp-pom-block-11',
          stickyMoreInfoEvent: '',
          modalMoreInfoEvent: '',
          stickyOpenPopUpEvent: '',
          carouselMoreInfoEvent: 'rocketman-carousel-more-info',
          showInvestForm: false,
          clickable: true,
        }
      ],
      SG: [

      ]
    };
    this.campaignBannerList = campaignBannerList[this.countryCode];
    this.isMultipleCampaignBanner = this.campaignBannerList.length > 1;
    this.showCampaignBanner = this.campaignBannerList.length > 0;
    this.bannerSwiperConfiguration = {
      slidesPerView: 1,
      prevButton: '.swiper-button-prev',
      nextButton: '.swiper-button-next',
      loop: this.isMultipleCampaignBanner,
      allowSwipeToPrev: this.isMultipleCampaignBanner,
      allowSwipeToNext: this.isMultipleCampaignBanner,
    };
  }

  onScroll() {
    this.scrollSubject.next(window.pageYOffset);
  }

  handleScroll(positionY) {
    this.isOnHtmlTop = positionY < 10;
    if (this.showCampaignBanner) {
      this.showBannerSticky = this.isOnHtmlTop;
    }
  }

  ngOnInit() {
    const { afpiLogo, ojkStatistic } = this.featureFlagService.getFeatureFlagKeys();
    this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
    this.featureFlagObservable.subscribe((flags) => {
      this.showAfpiLogo = flags[afpiLogo];
      this.showOjkStatistic = flags[ojkStatistic];
    });
    this._activatedRoute
      .queryParams
      .subscribe((params: Params) => {
        if (params && params['utm_campaign'] === 'panelplace_CTA_01122019' && this.countryCode === 'SG') {
          this.formTab.invest = true;
          this.formTab.borrow = false;
          this.investForm.patchValue({
            referralRemark: 'PPLACE'
          });
        }
      });

    this.scrollObservable.subscribe(x => this.handleScroll(x));
    this.initializeCampaignBannerList();
    this._activatedRoute
      .queryParams
      .subscribe((params: Params) => {
        this.formModel.borrow.gclid = params['gclid'];
        this.formModel.borrow.utmSource = params['utm_source'];
        this.formModel.borrow.utmMedium = params['utm_medium'];
        this.formModel.borrow.utmCampaign = params['utm_campaign'];
        this.formModel.borrow.utmTerm = params['utm_term'];
        this.formModel.borrow.utmContent = params['utm_content'];
        this.formModel.invest.params = params;
        if (this._router.url.indexOf('/activation') >= 0) {
          this._dialogService.displayActivationDialog(params);
        }
      });

    this.howThisWork[0] = { imagePath: 'assets/img/_public/home/page-1.png', label: '' };
    this.howThisWork[1] = { imagePath: 'assets/img/_public/home/page-2.png', label: '' };
    this.howThisWork[2] = { imagePath: 'assets/img/_public/home/page-3.png', label: '' };
    this.howThisWork[3] = { imagePath: 'assets/img/_public/home/page-4.png', label: '' };
    this.howThisWork[4] = { imagePath: 'assets/img/_public/home/page-5.png', label: '' };

    this._translateService
      .get('master.company-types')
      .subscribe(
        companyTypes => {
          this.companyTypes = companyTypes;
        }
      );

    this._translateService
      .get('master.how-did-you-find-us-sources.sign-up-borrower')
      .subscribe(
        howDidYouFindUsSources => {
          this.howDidYouFindUsSourcesBorrower = howDidYouFindUsSources;
        }
      );

    this._translateService
      .get('master.how-did-you-find-us-sources.sign-up-investor')
      .subscribe(
        howDidYouFindUsSourcesInvestor => {
          this.howDidYouFindUsSourcesInvestor = howDidYouFindUsSourcesInvestor.map(source => {
            return {
              'key': source.key,
              'value': source.value
            };
          });
        }
      );

    this._translateService
      .get('homepage.as-featured-in')
      .subscribe(
        asFeaturedIn => {
          this.asFeaturedInContent = asFeaturedIn;
          this.asFeaturedInDataFlag = true;
        });

    this._translateService
      .get('homepage.as-featured-on')
      .subscribe(
        asFeaturedOn => {
          this.asFeaturedOnContent = asFeaturedOn;
          this.asFeaturedOnDataFlag = true;
        });

    this._translateService
      .get('homepage.testimonial')
      .subscribe(
        testimonial => {
          this.testimonialContent = testimonial;
          this.testimonialContentFilter = this.testimonialContent.filter(function (el) {
            return el.type === 'borrower';
          });
          this.testimonialDataFlag = true;
        });

    this._translateService
      .get('homepage.how-this-works')
      .subscribe(
        howThisWork => {
          for (let key in howThisWork) {
            if (howThisWork[key]['label'] !== undefined) {
              this.howThisWork[key].label = howThisWork[key]['label'];
            }
          }
          this.howThisWorkDataReady = true;
        }
      );

    this._translateService
      .get('master.password-restrictions')
      .subscribe(
        passwordRestrictions => {
          passwordRestrictions.forEach(passwordRestriction => {
            this.formModel.invest.passwordRestrictions.push(<PasswordRestriction>({
              label: passwordRestriction.label,
              regex: new RegExp(passwordRestriction.regex),
              valid: true
            }));
          });
        });

    this._translateService
      .get('master.tenors')
      .subscribe(
        loanTenors => {
          for (let key in loanTenors) {
            this.loanTenors.push({
              key: key,
              value: loanTenors[key]
            });
          }
        }
      );

    this._translateService
      .get('form.borrow')
      .subscribe(
        borrow => {
          this.formModel.borrow.error = borrow.error;
          this.formModel.borrow.success = borrow.success;
        }
      );

    this._translateService
      .get('form.invest')
      .subscribe(
        invest => {
          this.formModel.invest.error = invest.error;
          this.formModel.invest.success = invest.success;
        }
      );

    this._translateService
      .get('homepage.sign-up.borrow')
      .subscribe(
        signupBorrow => {
          this.signUpBorrowCaption = signupBorrow;
          this.signUpCaption = this.getSignUpCaption(this.signUpBorrowCaption);
        }
      );

    this._translateService
      .get('homepage.sign-up.invest')
      .subscribe(
        signupInvest => {
          this.signUpInvestCaption = signupInvest;
        });

    this._maintenanceService.onlyGetMaintenanceModeForStagingAndProduction().subscribe(isMaintenance => {
      if (!isMaintenance) { // not in maintenance mode
        this._maintenanceService.onlyGetServiceDownModeForStagingAndProduction().subscribe(isServiceDown => {
          if (!isServiceDown) { // not in service down
            // Todo: Temporary workaround as every route change
            // for sign up modal will trigger getTotalFunded
            // All modal routes should go through header component router
            if (this.totalFunded === '') {
              // Total funded will be stored in session storage
              this.getTotalFunded();
            }
            if (this.countryCode === 'ID') {
              if (this.showOjkStatistic) {
                this.getOJKStatistic();
              } else {
                this.ojkStatistic = null;
              }
            }
          }
        });
      }
    });
  }


  goToPromoLink(link: string, show: boolean, eventName: string) {
    if (show) {
      window.open(link, '_blank');
      this._eventService.sendHomePagePromoBanner(eventName);
    }
  }

  ngAfterViewInit() {
    this.wow.init();
    // To get AFPI verification logo
    if (this.countryCode === 'ID') {
      const s = this.document.createElement('script');
      s.type = 'text/javascript';
      s.src = 'https://afpi.or.id/secure/certificates/member.min.js?key=c62cecef107fa32a4ae785baef5db8ea';
      this.scrafpi.nativeElement.appendChild(s);
    }
  }

  getTotalFunded() {
    this._financeService.getTotalFunded(CONFIGURATION.country_code)
      .subscribe(
        response => {
          const totalFunded = response.value + response.total_bond;
          this._utilityService.truncateDecimal(totalFunded, 2).then((data: any) => {
            this.totalFunded = data;
            this._sessionStorageService.store('totalFunded', data);
          });
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  autoFormatBorrowFormCompanyRevenue(): void {
    this.borrowForm.patchValue({
      companyRevenue: this._validatorService.addDelimiter(this.borrowForm.value.companyRevenue, false)
    });
  }

  autoFormatBorrowFormLoanAmount(): void {
    this.borrowForm.patchValue({
      loanAmount: this._validatorService.addDelimiter(this.borrowForm.value.loanAmount, false)
    });
  }

  onBorrowFormAccept(event: any): void {
    this.formModel.borrow.accepted = event.checked;
  }

  goToSbnInfoPage() {
    this._router.navigate(['/sbn-info']);
  }

  onBorrowFormSubmit(): void {
    this.formModel.borrow.validation = true;
    this.formModel.borrow.howDidYouFindUsOtherValid =
      !this.formModel.borrow.showHowDidYouFindUsOther ||
      (this.formModel.borrow.showHowDidYouFindUsOther &&
        this.borrowForm.value.howDidYouFindUsOther &&
        this.borrowForm.value.howDidYouFindUsOther.length > 0
      );

    if (this.borrowForm.valid && this.formModel.borrow.mobilePhoneValidation && this.formModel.borrow.howDidYouFindUsOtherValid) {
      this.zohoModel = {
        companyName: this.borrowForm.value.companyName,
        companyRevenue: Number(this._validatorService.removeDelimiter(this.borrowForm.value.companyRevenue)),
        companyType: this.borrowForm.value.companyType,
        contactNumber: this.borrowForm.value.mobilePhoneNumber,
        mobile_phone_number: this.borrowForm.value.mobilePhoneNumber,
        countryId: CONFIGURATION.country_code,
        email: this.borrowForm.value.email,
        fullName: this.borrowForm.value.fullName,
        gclid: this.formModel.borrow.gclid,
        utmSource: this.formModel.borrow.utmSource,
        utmMedium: this.formModel.borrow.utmMedium,
        utmCampaign: this.formModel.borrow.utmCampaign,
        utmTerm: this.formModel.borrow.utmTerm,
        utmContent: this.formModel.borrow.utmContent,
        leadType: 'BORROWER',
        loanAmount: Number(this._validatorService.removeDelimiter(this.borrowForm.value.loanAmount)),
        loanTenor: this.borrowForm.value.loanTenor,
        notes: 'How did you find us : ' +
          this.borrowForm.value.howDidYouFindUs + (this.formModel.borrow.showHowDidYouFindUsOther ?
            ' - ' + this.borrowForm.value.howDidYouFindUsOther : ''),
        pic: 'FRONT_END',
        howDidYouFindUs: this.borrowForm.value.howDidYouFindUs,
        howDidYouFindUsDetails: this.borrowForm.value.howDidYouFindUsOther ? this.borrowForm.value.howDidYouFindUsOther : '',
        zohoLeadsOwnerId: CONFIGURATION.zoho_leads_owner_id,
        zohoLeadsOwner: CONFIGURATION.zoho_leads_owner,
        zoho_leads_source: CONFIGURATION.zoho_leads_source,
      };
      this._memberService
        .addLead(this.zohoModel)
        .subscribe(
          response => {
            this._router.navigate(['/borrow/eligibility-results'],
              {
                queryParams:
                {
                  amount: Number(this._validatorService.removeDelimiter(this.borrowForm.value.loanAmount)),
                  tenor: this.borrowForm.value.loanTenor
                },
              });
          },
          error => {
            this._notificationService.error(this.formModel.borrow.error);
          }
        );
    }
  }

  onHowDidYouFindUsChange(value: string): void {
    if (this.formTab.borrow) {
      this.formModel.borrow.showHowDidYouFindUsOther = (value === 'Others' || value === 'Blogs' || value === 'News Articles' || value === 'Events' || value === 'Friends & relatives');
    }
    else if (this.formTab.invest) {
      this.formModel.invest.showHowDidYouFindUsOther = (value === 'Others' || value === 'Blogs' || value === 'News Articles' || value === 'Events' || value === 'Friends & relatives');
    }
  }

  onInvestFormAccept(event: any): void {
    this.formModel.invest.accepted = event.checked;
  }

  onInvestFormSubmit(): void {
    this.onTypePassword();
    this.formModel.invest.howDidYouFindUsOtherValid =
      !this.formModel.invest.showHowDidYouFindUsOther ||
      (this.formModel.invest.showHowDidYouFindUsOther &&
        this.investForm.value.howDidYouFindUsOther &&
        this.investForm.value.howDidYouFindUsOther.length > 0
      );
    this.formModel.invest.retypedPasswordMatches = (this.investForm.value.password === this.investForm.value.retypedPassword);
    this.formModel.invest.validation = true;

    if (
      this.formModel.invest.howDidYouFindUsOtherValid &&
      this.formModel.invest.passwordValid &&
      this.formModel.invest.retypedPasswordMatches &&
      this.formModel.invest.mobilePhoneValidation &&
      this.investForm.valid
    ) {
      if (Object.keys(this.formModel.invest.params).length > 0) {
        this.campaignParameter = JSON.stringify(this._utilityService.getCampaignParameter(this.formModel.invest.params, this.excludeParameter));
      }
      this._cryptographyService
        .regeneratePublicKey()
        .then(response => {
          let signupData = {
            'country_id': CONFIGURATION.country_code,
            'member_type_code': this.formModel.invest.memberTypeCode,
            'username': this.investForm.value.email,
            'fullname': this.investForm.value.fullName,
            'password': this._cryptographyService.encrypt(this.investForm.value.password),
            'mobile_phone_number': this.investForm.value.mobilePhoneNumber,
            'how_did_you_find_us': this.investForm.value.howDidYouFindUs + (this.formModel.invest.showHowDidYouFindUsOther ?
              ' - ' + this.investForm.value.howDidYouFindUsOther
              : ''),
            'referral_remark': this.investForm.value.referralRemark,
            'subscribe_newsletter': false,
            'uuid': this._cryptographyService.getUuid()
          };
          if (this.campaignParameter != null) {
            signupData['campaign_parameters'] = this.campaignParameter;
          }
          this._memberService
            .signUp(signupData)
            .subscribe(
              response => {
                this.formModel.invest.accepted = true;
                this.formModel.invest.howDidYouFindUsOtherValid = true;
                this.formModel.invest.passwordValid = true;
                this.formModel.invest.retypedPasswordMatches = true;
                this.formModel.invest.showHowDidYouFindUsOther = false;
                this.formModel.invest.validation = false;
                this.investForm.reset();
                this._authService.setTwoFaLogin(this.investForm.value.password);
                this._authService.setSignUpCredential(response.data.userName, response.data.token, this.formModel.invest.memberTypeCode);
                this._eventService.sendInvSignupEvent('INV-register');
                this._router.navigate(['/sign-up/forms/investor']);
              },
              error => {
                this._notificationService.error(error.message);
              }
            );
        },
          error => {
            this._notificationService.error(error.message);
          }
        );
    }
  }

  onTypePassword(): void {
    let password = this.investForm.value.password;
    this.formModel.invest.passwordValid = true;
    this.formModel.invest.passwordRestrictions
      .forEach(passwordRestriction => {
        passwordRestriction.valid = passwordRestriction.regex.test(password);
        if (!passwordRestriction.valid) {
          this.formModel.invest.passwordValid = false;
        }
      });
  }

  onRetypePassword(): void {
    this.formModel.invest.retypedPasswordMatches = (this.investForm.value.password === this.investForm.value.retypedPassword);
  }

  selectSignUp(selected: string) {
    if (selected === 'invest') {
      this.investSelected = true;
      this.signUpCaption = {
        button: this.signUpInvestCaption['button'],
        captionStories: this.signUpInvestCaption['caption-stories'],
        title: this.signUpInvestCaption['title'],
        caption: this.signUpInvestCaption['caption']
      };
      this.testimonialContentFilter = this.testimonialContent.filter(function (el) {
        return el.type === 'investor';
      });
      return this.investSelected;
    } else if (selected === 'borrow') {
      this.investSelected = false;
      this.signUpCaption = this.getSignUpCaption(this.signUpBorrowCaption);
      this.testimonialContentFilter = this.testimonialContent.filter(function (el) {
        return el.type === 'borrower';
      });
      return this.investSelected;
    }
  }

  getSignUpCaption({ button = '', title = '', 'caption-stories': captionStories = [], caption = '' }) {
    const signUpCaption = Object.assign({}, {
      button: button,
      captionStories: captionStories,
      title: title,
      caption: caption
    });
    return signUpCaption;
  }

  selectForm(identifier: string) {
    for (const formView in this.formTab) {
      this.formTab[formView] = false;
    }
    this.formTab[identifier] = true;
  }

  goToHowThisWorkSection(link: string = '') {
    if (!link) {
      this._windowService.smoothScroll('howThisWork');
    } else {
      window.open(link, "_blank");
    }
  }

  onCorporateLoanClick() {
    this._router.navigate(['/sign-up-borrower']);
  }

  getInvestorMobilePhoneValidation(validation: string) {
    this.formModel.invest.mobilePhoneValidation = !validation;
  }

  getBorrowerMobilePhoneValidation(validation: string) {
    this.formModel.borrow.mobilePhoneValidation = !validation;
  }


  patchInvestorMobilePhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.investForm.patchValue({
        mobilePhoneNumber: phoneNumber
      });
    }
  }

  patchBorrowerMobilePhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.borrowForm.patchValue({
        mobilePhoneNumber: phoneNumber
      });
    }
  }

  getOJKStatistic() {
    this._financeService.getStatistics(CONFIGURATION.country_code)
      .subscribe(
        response => {
          this.ojkStatistic = {
            countrySuccessRateOverDisbursement: response.value.country_success_rate_over_disbursement,
            countrySuccessRateOverOutstanding: response.value.country_success_rate_over_outstanding,
            countryRepaymentRate: response.value.country_repayment_rate,
            defaultRate: response.value.default_rate,
          };
        },
        error => {
          this._notificationService.error();
        }
      );
  }

  showModal(id: string, ) {
    if (id === 'campaignBannerModal') {
      this
    }
    this._modalService.open(id);
  }

  closeModal(id: string) {
    this._modalService.close(id);
    if (id === this.campaignBannerModal) {
      this.showBannerSticky = true;
    }
  }

  closeStickyBanner() {
    this.showBannerSticky = false;
    this._eventService.sendHomePagePromoBanner('close-sticky-banner');
  }

  stickyBannergoToPromoLink() {
    const activePromo = this.campaignBannerList[this.activeBannerSlide];
    this._eventService.sendHomePagePromoBanner(activePromo.stickyMoreInfoEvent);
    window.open(activePromo.marketingLink, '_blank');
  }

  sendOpenModalEvent() {
    const activePromo = this.campaignBannerList[this.activeBannerSlide];
    this._eventService.sendHomePagePromoBanner(activePromo.stickyOpenPopUpEvent);
  }

  onStickyBannerSlideChange() {
    this.activeBannerSlide = this.stickyBannerSwipper['nativeElement']['swiper']['realIndex'] ||
      this.mobileStickyBannerSwipper['nativeElement']['swiper']['realIndex'];
    this.bannerSwipper['nativeElement']['swiper'].slideTo(this.activeBannerSlide + 1);
    const activePromo = this.campaignBannerList[this.activeBannerSlide];
    this.showMoreInfo = activePromo.clickable;
  }

  onSwiperHover(hover: boolean) {
    if (hover) {
      this.homepageSwipper['nativeElement']['swiper'].stopAutoplay(true);
    } else {
      this.homepageSwipper['nativeElement']['swiper'].startAutoplay(true);
    }
  }
}

