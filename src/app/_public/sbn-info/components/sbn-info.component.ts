import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ValidatorService } from '../../../services/validator.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ModalService } from 'app/services/modal.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import CONFIGURATION from '../../../../configurations/configuration';
import { WindowService } from '../../../services/window.service';


@Component({
  selector: 'sbn-info',
  templateUrl: './sbn-info.html'
})
export class SbnInfoComponent implements OnInit {
  faqList: any;
  showVideo: boolean;
  swiperConfiguration: SwiperConfigInterface;
  imageBaseUrl: string;
  coverContent: Array<any>;
  bondGeneralInfo: any;
  percentFormat: string;
  isSlideMoreThanOne: boolean;
  @ViewChild('swiperBanner', { static: false }) swiperBanner: any;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private validatorService: ValidatorService,
    private authService: AuthService,
    private modalService: ModalService,
    private windowService: WindowService) {
    this.imageBaseUrl = CONFIGURATION.image_base_url;


    this.percentFormat = '1.2-5';
    this.swiperConfiguration = {
      direction: 'horizontal',
      autoplay: 4000,
      pagination: '.swiper-pagination',
      slidesPerView: 1
    };
    this.bondGeneralInfo = {
      name: 'SR012',
      interest: '6,30',
      tenorLengthInYear: '2',
      simulation: {
        initialSimulationAmount: 10000000,
        simulationAmount: '0',
        cashbackBonus: '0',
        oneYearRevenue: '0',
        monthlyRevenue: '0',
        maximumRevenue: '0',
        yearlyInterest: 0.0630,
        nettYearlyInterest: 0.05355,
        nettOneYearRevenue: '0',
        nettMaximumRevenue: '0',
        nettMonthlyRevenue: '0',
        cashbackBonusPercentage: 0.025
      }
    }
  }

  ngOnInit() {
    this.coverContent = [
      {
        imageName: this.imageBaseUrl + '/sr012/sr012-landing-page-banner.png',
        imageMobileName: this.imageBaseUrl + '/sr012/sr012-landing-page-banner-mobile.png',
        type: 'login',
        clickable: true
      },
      {
        imageName: this.imageBaseUrl + '/sr012/sr012-landing-page-banner-cashback.png',
        imageMobileName: this.imageBaseUrl + '/sr012/sr012-landing-page-banner-cashback-mobile.png',
        type: 'cashback',
        clickable: true
      }
    ];
    this.isSlideMoreThanOne = this.coverContent.length > 1;
    this.swiperConfiguration = {
      direction: 'horizontal',
      autoplay: 4000,
      pagination: '.swiper-pagination',
      paginationClickable: this.isSlideMoreThanOne,
      allowSwipeToPrev: this.isSlideMoreThanOne,
      allowSwipeToNext: this.isSlideMoreThanOne,
      slidesPerView: 1
    };
    this.translateService
      .get('sbn-retail.sr-landing-page.faq-content')
      .subscribe(
        faqList => {
          this.faqList = faqList;
        });
    this.calculateProfit(this.bondGeneralInfo.simulation.initialSimulationAmount);
  }

  sbnBannerEvent(type: string) {
    if (type === 'login') {
      this.registerSBN();
    } else if (type === 'cashback') {
      this.windowService.smoothScroll('cashback');
    }
  }

  registerSBN() {
    const memberID = this.authService.getMemberId();
    if (memberID) {
      this.router.navigate(['/admin-investor/sbn-retail']);
    } else {
      this.localStorageService.store('fromSBN', true);
      this.router.navigate(['/log-in']);
    }
  }

  displaySukukVideo(id) {
    this.modalService.open(id);
    this.showVideo = true;
  }

  closeModal(id: string): void {
    this.modalService.close(id);
    this.showVideo = false;
  }

  calculateProfit(value: string) {
    this.bondGeneralInfo.simulation.simulationAmount = this.validatorService.addDelimiter(value, true);
    const amount = Number(this.validatorService.removeDelimiter(value));
    this.bondGeneralInfo.simulation.oneYearRevenue = '0';
    this.bondGeneralInfo.simulation.maximumRevenue = '0';
    this.bondGeneralInfo.simulation.nettOneYearRevenue = '0';
    this.bondGeneralInfo.simulation.nettMaximumRevenue = '0';
    this.bondGeneralInfo.simulation.nettMonthlyRevenue = '0';
    this.bondGeneralInfo.simulation.cashbackBonus = '0';
    if (amount >= 1000000 && amount <= 3000000000) {
      // const cashbackBonus = Math.ceil(amount * this.cashbackBonusPercentage);
      const cashbackBonus = 100000;
      const oneYearRevenue = Math.ceil(amount * this.bondGeneralInfo.simulation.yearlyInterest);
      const maximumRevenue = Math.ceil((amount * this.bondGeneralInfo.simulation.yearlyInterest) * Number(this.bondGeneralInfo.tenorLengthInYear));
      const nettOneYearRevenue = Math.ceil(amount * this.bondGeneralInfo.simulation.nettYearlyInterest);
      const nettMaximumRevenue = Math.ceil((amount * this.bondGeneralInfo.simulation.nettYearlyInterest) * Number(this.bondGeneralInfo.tenorLengthInYear));
      const monthlyRevenue = Math.ceil(oneYearRevenue / 12);
      const nettMonthlyRevenue = Math.ceil(nettOneYearRevenue / 12);
      this.bondGeneralInfo.simulation.monthlyRevenue = this.validatorService.addDelimiter(String(monthlyRevenue));
      this.bondGeneralInfo.simulation.oneYearRevenue = this.validatorService.addDelimiter(String(oneYearRevenue));
      this.bondGeneralInfo.simulation.maximumRevenue = this.validatorService.addDelimiter(String(maximumRevenue));
      this.bondGeneralInfo.simulation.nettOneYearRevenue = this.validatorService.addDelimiter(String(nettOneYearRevenue));
      this.bondGeneralInfo.simulation.nettMaximumRevenue = this.validatorService.addDelimiter(String(nettMaximumRevenue));
      this.bondGeneralInfo.simulation.nettMonthlyRevenue = this.validatorService.addDelimiter(String(nettMonthlyRevenue));
      this.bondGeneralInfo.simulation.cashbackBonus = this.validatorService.addDelimiter(String(cashbackBonus <= 100000 ? cashbackBonus : 100000));
    }
  }
}
