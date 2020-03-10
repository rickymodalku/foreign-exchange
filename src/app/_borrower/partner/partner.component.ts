import {
  Component,
  OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import CONFIGURATION from '../../../configurations/configuration';

interface PartnerContent {
  description: string;
  image: string;
  name: string;
  url: string;
}

@Component({
  templateUrl: './partner.html'
})

export class PartnerComponent implements OnInit {
  partnerContent: any;
  constructor(private _translateService: TranslateService) {
    this.partnerContent = new Array<PartnerContent>();
  }

  ngOnInit() {
    this._translateService
      .get('partner.content')
      .subscribe(
        partnerContent => {
          this.partnerContent = partnerContent;
        });
  }
}
