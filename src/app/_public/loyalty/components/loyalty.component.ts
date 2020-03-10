import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { TranslateService } from '@ngx-translate/core';
import { BaseParameterService } from '../../../services/base-parameter.service';
import { WindowService } from '../../../services/window.service';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'loyalty',
  templateUrl: './loyalty.html'
})

export class LoyaltyComponent implements OnInit {
  CONFIGURATION: any;
  currency: string;
  mobileSwiperConfiguration: SwiperConfigInterface;
  benefitList: any;
  faqList: any;
  rewardList: any;
  constructor(
    private baseParameterService: BaseParameterService,
    private translateService: TranslateService,
    private windowService: WindowService) {
    this.CONFIGURATION = CONFIGURATION;
    this.benefitList = new Array();
    this.rewardList = new Array();
    this.currency = CONFIGURATION.currency_symbol;
    this.mobileSwiperConfiguration = {
      direction: 'horizontal',
      keyboardControl: true,
      loop: true,
      mousewheelControl: false,
      pagination: '.swiper-pagination',
      paginationClickable: true,
      scrollbar: null,
      scrollbarDraggable: true,
      scrollbarHide: false,
      scrollbarSnapOnRelease: true,
      slidesPerView: 1,
      slidesPerGroup: 1,
      autoplay: 5000
    };
  }

  goToBenefitSection() {
    this.windowService.smoothScroll('loyalty-benefit-box');
  }

  goToFaqSection() {
    this.windowService.smoothScroll('loyalty-faq-box');
  }

  ngOnInit() {
    this.rewardList = [];
    this.translateService
      .get('loyalty.reward.list')
      .subscribe(
        rewardList => {
          this.rewardList = rewardList;
        });

    this.translateService
      .get('loyalty.faq-content')
      .subscribe(
        faqList => {
          this.faqList = faqList;
        });

    this.translateService
      .get('loyalty.tier-detail')
      .subscribe(
        benefitListResponse => {
          benefitListResponse.forEach(benefitList => {
            this.benefitList.push({
              amount: this.baseParameterService.getTierAmount().find(o => o.name === benefitList.id).amount,
              active: false,
              benefit: benefitList.benefit,
              caption: benefitList.caption,
              class: benefitList.class,
              tier: benefitList.name
            });
          });
        });
  }

  changeBenefitDetail(i: number) {
    this.benefitList.forEach(element => {
      element.active = false;
    });
    this.benefitList[i].active = true;
  }
}
