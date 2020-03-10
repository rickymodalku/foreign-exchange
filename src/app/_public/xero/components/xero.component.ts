import { Component, OnInit } from '@angular/core';
import CONFIGURATION from '../../../../configurations/configuration';
import { ENVIRONMENT } from '../../../../environments/environment';
import { FeatureFlagService } from '../../../services/feature-flag.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'xero',
  templateUrl: './xero.html'
})
export class XeroComponent implements OnInit {
  boltLink: string;
  xeroLink: string;
  xeroFaqLink: string;
  showXero: boolean;
  featureFlagObservable: Observable<any>;

  constructor(
    private featureFlagService: FeatureFlagService,
    private _router: Router,
  ) {
    this.boltLink = ENVIRONMENT.boltLinkXero;
    this.xeroLink = CONFIGURATION.xeroLink + '?xtid=' + CONFIGURATION.xeroXTID;
    this.xeroFaqLink = CONFIGURATION.xeroFaq;
    this.showXero = false;
  }

  ngOnInit() {
    if (CONFIGURATION.country_code === 'SG') {
      const { xero } = this.featureFlagService.getFeatureFlagKeys();
      this.featureFlagObservable = this.featureFlagService.getFeatureFlagObservable();
      this.featureFlagObservable.subscribe((flags) => {
        this.showXero = flags[xero];
        if(!this.showXero) {
          this._router.navigate(['/not-found-page']);
        }
      });
    }
  }

  goToBoltLink() {
    window.open(this.boltLink, '_blank');
  }

  goToXeroLink() {
    window.open(this.xeroLink, '_blank');
  }

  goToXeroFaqLink() {
    window.open(this.xeroFaqLink, '_blank');
  }
}
