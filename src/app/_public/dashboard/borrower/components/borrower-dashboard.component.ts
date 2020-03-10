import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  SwiperComponent,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import { DialogService } from '../../../../services/dialog.service';
import { WindowService } from '../../../../services/window.service';
import { TranslateService } from '@ngx-translate/core';
import CONFIGURATION from '../../../../../configurations/configuration';
import { FeatureFlagService } from '../../../../services/feature-flag.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'borrower',
  templateUrl: './borrower-dashboard.html'
})

export class BorrowerDashboardComponent implements OnInit {
  benefits: Array<any>;
  currency: string;
  imageBaseUrl: string;
  invoiceFlag: boolean;
  FSBoltFlag: boolean;
  mobileSwipeConfig: SwiperConfigInterface;
  masterData: any;
  products: Array<any>;
  productsFlag: boolean;
  productSwiperConfig: SwiperConfigInterface;
  smeFlag: boolean;
  CONFIGURATION: any;
  countryCode: string;
  showXero: boolean;
  featureFlagObservable: Observable<any>;

  @ViewChild('productSwiper', { static: false }) swiperWrapper: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dialogService: DialogService,
    private _router: Router,
    private _translateService: TranslateService,
    private _windowService: WindowService,
    private featureFlagService: FeatureFlagService,
  ) {
    this.smeFlag = true;
    this.invoiceFlag = false;
    this.currency = CONFIGURATION.currency_symbol;
    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.FSBoltFlag = false;
    this.benefits = new Array<any>();
    this.products = new Array<any>();
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
      paginationClickable: true,
    };

    this.productSwiperConfig = {
      scrollbar: null,
      direction: 'horizontal',
      slidesPerView: 1,
      scrollbarHide: false,
      keyboardControl: true,
      mousewheelControl: false,
      scrollbarDraggable: true,
      scrollbarSnapOnRelease: true
    };
    this.masterData = {
      tenors: new Array<any>(),
      companyTypes: new Array<any>(),
      howDidYouFindUsSources: new Array<any>()
    };
    this.CONFIGURATION = CONFIGURATION;
    this.countryCode = CONFIGURATION.country_code;
    this.showXero = false;
  }

  ngOnInit() {
    this._activatedRoute
    .queryParams
    .subscribe((params: Params) => {
      if (this._router.url.indexOf('/activation') >= 0) {
        this._dialogService.displayActivationDialog(params);
      }
    });

    const benefits = [
      { key: 'application-easy', logo: 'assets/img/_public/dashboard/application-icon.svg', desc: '' },
      { key: 'platform-safe', logo: 'assets/img/_public/dashboard/safe-icon.svg', desc: '' },
      { key: 'processing-fast-loan', logo: 'assets/img/_public/dashboard/computer-icon.svg', desc: '' },
      { key: 'rate-attractive', logo: 'assets/img/_public/dashboard/progress-icon.svg', desc: '' },
      { key: 'based-on-need', logo: 'assets/img/_public/dashboard/building-icon.svg', desc: '' },
      { key: 'happy-to-help', logo: 'assets/img/_public/dashboard/heart-icon.svg', desc: '' }
    ];
    this._translateService
      .get('borrow.benefit-clear')
      .subscribe(
        translatedBenefits => {
          benefits.forEach(benefit => {
            benefit.desc = translatedBenefits[benefit.key];
          });
          this.benefits = benefits;
        }
      );

    this._translateService
      .get('borrow.product-offer.product-list')
      .subscribe(
        translatedProducts => {
          this.products = translatedProducts;
        }
      );
    this._translateService
      .get('master.company-types')
      .subscribe(
        companyTypes => {
          for (const data of companyTypes) {
            if (data) {
              this.masterData.companyTypes.push({
                value: data.key,
                label: data.value
              });
            }
          }
        });

    this._translateService
      .get('master.how-did-you-find-us-sources.sign-up-borrower')
      .subscribe(
        howDidYouFindUsSources => {
          for (const data of howDidYouFindUsSources) {
            if (data) {
              this.masterData.howDidYouFindUsSources.push({
                value: data.key,
                label: data.value
              });
            }
          }
        });

    this._translateService
      .get('master.tenors')
      .subscribe(
        tenors => {
          for (const key in tenors) {
            if (key) {
              this.masterData.tenors.push({
                value: key,
                label: tenors[key]
              });
            }
          }
        });
    if (this.countryCode === 'SG') {
      const { xero } = this.featureFlagService.getFeatureFlagKeys();
      this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
      this.featureFlagObservable.subscribe((flags) => {
        this.showXero = flags[xero];
      });
    }
  }

  changeProductOffer(string: any) {
    this.smeFlag = false;
    this.invoiceFlag = false;
    this.FSBoltFlag = false;
    if (string === 'sme') {
      this.smeFlag = true;
      this.swiperWrapper.nativeElement.swiper.slideTo(0);
      return;
    } else if (string === 'invoice') {
      this.invoiceFlag = true;
      this.swiperWrapper.nativeElement.swiper.slideTo(1);
      return;
    }
  }

  scrollDown(string: any) {
    this._windowService.smoothScroll(string);
  }

  goToFinancingBlog() {
    window.open('https://sme.fundingsocieties.com.my/fast-approval-sme-financing/#lp-pom-block-11', '_blank');
  }
}
