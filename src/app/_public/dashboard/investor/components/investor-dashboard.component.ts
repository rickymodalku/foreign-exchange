import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  SwiperComponent,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import { DialogService } from '../../../../services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { WindowService } from '../../../../services/window.service';
import CONFIGURATION from '../../../../../configurations/configuration';

@Component({
  selector: 'investor',
  templateUrl: './investor-dashboard.html'
})
export class InvestorDashboardComponent implements OnInit {
  appLink: any;
  benefitFlag: string;
  config: SwiperConfigInterface;
  countryCode: string;
  imageBaseUrl: string;
  investInformation: Array<any>;
  investmentBenefitData: Array<any>;
  investmentBenefitDataFlag: boolean;
  mobileSwipeConfig: SwiperConfigInterface;
  CONFIGURATION: any;
  maximizingInvestmentArticle: string;
  @ViewChild('swiperWrapper', { static: false }) swiperWrapper: any;
  constructor(
    private _dialogService: DialogService,
    private _translateService: TranslateService,
    private _windowService: WindowService
  ) {
    this.CONFIGURATION = CONFIGURATION;
    this.maximizingInvestmentArticle = this.CONFIGURATION.maximizingInvestmentArticle;
    this.appLink = {
      appStore: CONFIGURATION.mobileAppUrl.investor.appStore,
      googlePlay: CONFIGURATION.mobileAppUrl.investor.googlePlay
    };
    this.benefitFlag = 'security';
    this.investInformation = new Array();
    this.mobileSwipeConfig = {
      scrollbar: null,
      autoplay: 2000,
      direction: 'horizontal',
      slidesPerView: 1,
      scrollbarHide: false,
      keyboardControl: false,
      mousewheelControl: false,
      loop: true,
      scrollbarDraggable: false,
      scrollbarSnapOnRelease: true
    };

    this.config = {
      scrollbar: null,
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
    this.investmentBenefitData = new Array();
    this.investmentBenefitDataFlag = false;
    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.countryCode = CONFIGURATION.country_code;
  }

  ngOnInit() {
    this._translateService
      .get('invest.benefit')
      .subscribe(
        investmentBenefitData => {
          for (let key in investmentBenefitData) {
            this.investmentBenefitData.push({
              title: investmentBenefitData[key]['title'],
              fundingSocieties: investmentBenefitData[key]['funding-societies'],
              traditional: investmentBenefitData[key]['traditional']
            });
          }
          this.investmentBenefitDataFlag = true;
        });


    this._translateService
      .get('invest.invest-information')
      .subscribe(
        investInformationData => {
          for (let key in investInformationData) {
            this.investInformation.push({
              description: investInformationData[key]['description'],
              amount: investInformationData[key]['amount'],
            });
          }
        });
  }

  changeinvestInfo(string: any) {
    if (string === 'security') {
      this.benefitFlag = 'security';
      this.swiperWrapper.nativeElement.swiper.slideTo(1);
      return;
    }
    if (string === 'ownership') {
      this.benefitFlag = 'ownership';
      this.swiperWrapper.nativeElement.swiper.slideTo(2);
      return;
    }
    if (string === 'knowledge') {
      this.benefitFlag = 'knowledge';
      this.swiperWrapper.nativeElement.swiper.slideTo(3);
      return;
    }
    if (string === 'entry') {
      this.benefitFlag = 'entry';
      this.swiperWrapper.nativeElement.swiper.slideTo(4);
      return;
    }
    if (string === 'flexible') {
      this.benefitFlag = 'flexible';
      this.swiperWrapper.nativeElement.swiper.slideTo(5);
      return;
    }
    if (string === 'return') {
      this.benefitFlag = 'return';
      this.swiperWrapper.nativeElement.swiper.slideTo(6);
      return;
    }
  }

  scrollDown(string: any) {
    this._windowService.smoothScroll(string);
  }

  openLearningCenter() {
    window.open(`${CONFIGURATION.blog}/learning-center/`, '_blank');
  }

  openMinimiseYourRisk() {
    window.open(`${this.CONFIGURATION.minimizingRiskArticle}`, '_blank');
  }

  openMaximisingInvestments() {
    window.open(`${this.CONFIGURATION.maximizingInvestmentArticle}`, '_blank');
  }

  openGooglePlay() {
    window.open(this.appLink.googlePlay, '_blank');
  }

  openAppStore() {
    window.open(this.appLink.appStore, '_blank');
  }
}
