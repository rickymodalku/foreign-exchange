import {
  Component,
  OnInit
} from '@angular/core';
import {
  SwiperComponent,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import { TranslateService } from '@ngx-translate/core';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'about-us',
  templateUrl: './about-us.html'
})
export class AboutUsComponent implements OnInit {
  cLeadershipList: Array<any>;
  countryCode: any;
  imageBaseUrl: string;
  swiperConfiguration: SwiperConfigInterface;
  selectedLeader: any;
  constructor(private _translateService: TranslateService) {
    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.countryCode = CONFIGURATION.country_code;
    this.swiperConfiguration = {
      centeredSlides: true,
      direction: 'horizontal',
      autoplay: 5000,
      keyboardControl: true,
      loop: true,
      mousewheelControl: false,
      pagination: '.swiper-pagination',
      paginationClickable: true,
      scrollbar: null,
      scrollbarDraggable: true,
      scrollbarHide: false,
      slidesPerView: 1
    };
  }

  ngOnInit() {
    this.initiateAboutList();
  }

  findSelectedLeader() {
    this.selectedLeader = this.cLeadershipList.find(value => {
      return value.active;
    });
  }

  initiateAboutList() {
    if (this.countryCode === 'ID') {
      this.cLeadershipList = new Array();
      this._translateService.get('about-us.c-leadership.list-leadership').subscribe(
        listLeadership => {
          for (const key in listLeadership) {
            if (key) {
              this.cLeadershipList.push({
                name: listLeadership[key]['name'],
                role: listLeadership[key]['role'],
                description: listLeadership[key]['description'],
                photo: listLeadership[key]['photo'],
                active: Number(key) === 1
              });
            }
          }
          this.findSelectedLeader();
        });
    }
  }

  selectCLeadProfile(i: number) {
    this.cLeadershipList.forEach(function (cLeadershipList, index) {
      cLeadershipList.active = false;
    });
    this.cLeadershipList[i].active = true;
    this.findSelectedLeader();
  }
}
