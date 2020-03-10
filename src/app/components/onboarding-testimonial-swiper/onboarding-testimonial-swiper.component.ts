import { Component, OnInit, Input } from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BaseParameterService } from '../../services/base-parameter.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-onboarding-testimonial-swiper',
  templateUrl: './onboarding-testimonial-swiper.html'
})

export class OnboardingTestimonialSwiperComponent implements OnInit {
  @Input() memberType: string;
  testimonialContentFlag: boolean;
  testimonialContent: Array<any>;
  swiperConfiguration: SwiperConfigInterface;
  imageBaseUrl: string;
  memberTypeCode: any;

  constructor(
    private baseParameterService: BaseParameterService,
    private translateService: TranslateService
  ) {
    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.memberTypeCode = CONFIGURATION.member_type_code;
  }

  ngOnInit() {
    this.swiperConfiguration = this.baseParameterService.sign_up_swipper_config;
    if (this.memberType === this.memberTypeCode.investor) {
      this.translateService.get('form.onboarding-investor.image-swipper')
        .subscribe(
          testimonial => {
            this.testimonialContent = testimonial;
            this.testimonialContentFlag = true;
          });
    } else if (this.memberType === this.memberTypeCode.borrower) {
      this.translateService.get('form.onboarding-borrower.image-swipper')
        .subscribe(
          testimonial => {
            this.testimonialContent = testimonial;
            this.testimonialContentFlag = true;
          });
    }
  }


}
