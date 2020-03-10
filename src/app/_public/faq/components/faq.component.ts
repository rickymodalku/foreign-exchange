import {
  Component,
  OnInit
} from '@angular/core';
import {
  CompleterService,
  CompleterData
} from 'ng2-completer';
import { TranslateService } from '@ngx-translate/core';
import { WindowService } from '../../../services/window.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
  selector: 'faq',
  templateUrl: './faq.html'
})
export class FaqComponent implements OnInit {
  buttonWidth: number;
  matchClass: boolean;
  dataService: CompleterData;
  faqCategory: string;
  faqMasterData: Array<any>;
  questionMasterData: Array<any>;
  countryCode: string;
  searchStr: string;

  constructor(
    private _completerService: CompleterService,
    private _translateService: TranslateService,
    private _router: Router,
    private _authService: AuthService,
    private _windowService: WindowService
  ) {
    this.buttonWidth = 0;
    this.faqCategory = '';
    this.faqMasterData = new Array();
    this.questionMasterData = new Array();
    this.matchClass = false;
    this.countryCode = CONFIGURATION.country_code;
  }

  ngOnInit() {
    if (this.countryCode === 'SG') {
      switch (this._authService.getMemberTypeCode()) {
        case CONFIGURATION.member_type_code.investor:
          window.location.href = CONFIGURATION.reference.intercom_help_investor;
          break;
        case CONFIGURATION.member_type_code.borrower:
          window.location.href = CONFIGURATION.reference.intercom_help_investor;
          break;
        // Help on public page
        default:
          window.location.href = CONFIGURATION.reference.intercom_help;
      }
    } else {
      this._translateService
        .get('faq-content')
        .subscribe(
          faqMasterData => {
            for (let i = 0; i < faqMasterData.length; i++) {
              this.faqMasterData.push({
                category: faqMasterData[i]
              });
            }
            for (let i = 0; i < this.faqMasterData.length; i++) {
              let index = 0;
              for (let j = 0; j < this.faqMasterData[i].category['sub-category'].length; j++) {
                for (let k = 0; k < this.faqMasterData[i].category['sub-category'][j].content.length; k++) {
                  this.faqMasterData[i].category['sub-category'][j].content[k].id
                    = this.faqMasterData[i].category.title.substring(0, 3) + index;
                  this.faqMasterData[i].category['sub-category'][j].content[k].expand = false;
                  this.questionMasterData.push(this.faqMasterData[i].category['sub-category'][j].content[k]);
                  index++;
                }
              }
            }
            this.buttonWidth = 100 / this.faqMasterData.length;
            this.faqCategory = this.faqMasterData[0].category.title;
            this.dataService = this._completerService.local(this.questionMasterData, 'question', 'question');
          }
        );
    }
  }

  goToSelectedFAQ(string: any) {
    if (string !== null) {
      for (let i = 0; i < this.faqMasterData.length; i++) {
        if (this.faqMasterData[i].category.title.substring(0, 3) === string.originalObject.id.substring(0, 3)) {
          this.faqCategory = this.faqMasterData[i].category.title;
        }
      }
      var self = this;
      setTimeout(function () {
        self._windowService.smoothScroll(string.originalObject.id);
        for (let i = 0; i < self.faqMasterData.length; i++) {
          for (let j = 0; j < self.faqMasterData[i].category['sub-category'].length; j++) {
            for (let k = 0; k < self.faqMasterData[i].category['sub-category'][j].content.length; k++) {
              if (self.faqMasterData[i].category['sub-category'][j].content[k].id === string.originalObject.id) {
                self.faqMasterData[i].category['sub-category'][j].content[k].expand = true;
                return;
              }
            }
          }
        }
      }, 250);
    }
  }
}
