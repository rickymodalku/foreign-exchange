import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { ModalService } from 'app/services/modal.service';
import { MemberService } from '../../services/member.service';
import { NotificationService } from '../../services/notification.service'
import { BaseParameterService } from '../../services/base-parameter.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { debounce } from 'lodash';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'sg-risk-disclosure',
  templateUrl: './risk-disclosure.html'
})
export class SGRiskDisclosureComponent implements OnInit {
  countryCode: string;
  @ViewChild('content', { static: false }) content: any;
  riskDisclosureScrollFlag: boolean;
  @ViewChild('riskDisclosureContainer', { static: false }) private riskDisclosureContainer: ElementRef;
  debounceOnScrollEvent: any;
  riskDisclosureTemplate: SafeHtml;
  isGracePeriod: boolean;
  @Output('onSignoffSuccess') onSignoffSuccess = new EventEmitter<any>();

  constructor(
    private _modalService: ModalService,
    private _domSanitizer: DomSanitizer,
    private _translateService: TranslateService,
    private _memberService: MemberService,
    private _notificationService: NotificationService,
    private _localStorageService: LocalStorageService,
    private _router: Router,
    private _baseParameterService: BaseParameterService,
  ) {
    this.countryCode = CONFIGURATION.country_code;
    this.riskDisclosureScrollFlag = false;
    this.debounceOnScrollEvent = debounce(
      (container) => this.onScroll(container),
      100);
    this.isGracePeriod = false;
  }

  ngOnInit() {
    this._translateService
      .get('investor-agreement.risk-disclosure.content')
      .subscribe(
        content => {
          this.riskDisclosureTemplate = this._domSanitizer.bypassSecurityTrustHtml(content);
        }
      );
  }

  openRiskDisclosureModal(source: string = '') {
    this.openModal('fsRiskDisclosureModal');
    if (source === 'grace-period') {
      this._localStorageService.store('riskDisclosurePopup', true);
      this.isGracePeriod = true;
    }
  }

  onScrollDebounce(container: string): void {
    this.debounceOnScrollEvent(container);
  }

  onScroll(container: string) {
    let element;
    this.riskDisclosureScrollFlag = false;
    element = this.riskDisclosureContainer.nativeElement;
    const atBottom = Math.round(element.scrollHeight - element.scrollTop) <=
      (element.clientHeight + this._baseParameterService.getScrollTolerance());
    if (atBottom) {
      this.riskDisclosureScrollFlag = true;
    }
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  scrollDown(el: HTMLElement) {
    el.scrollTop = el.scrollTop + 300;
  }

  onRiskDisclosureAgreementAgree() {
    this._memberService.signRiskDisclosure()
      .subscribe(
        response => {
          this.closeModal('fsRiskDisclosureModal');
          if (!this.isGracePeriod) {
            this._router.navigate(['/admin-investor/setting/subscription-agreement']);
            this.onSignoffSuccess.emit();
          } else {
            this._localStorageService.store('reverification', false);
            this._memberService.triggerMemberStatusRetrieval();
          }
        },
        error => {
          this._notificationService.error(error.message);
          this.closeModal('fsRiskDisclosureModal');
        }
      );

  }

}
