import {
    Component,
    OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ReferralService } from '../../services/referral.service';
import CONFIGURATION from '../../../configurations/configuration';
import {PlatformLocation } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../services/validator.service';
import { ModalService } from '../../services/modal.service';
import { MemberService } from '../../services/member.service';


@Component({
    selector: 'referral',
    templateUrl: './referral.html'
})
export class ReferralComponent implements OnInit {
    memberTypeCodes: any;
    referralModel: any;
    countryCode = CONFIGURATION.country_code;
    referralBorrowerForm: FormGroup;
    memberDetail: any;
    referralBorrowerModel = {
      error: '',
      success: '',
      validation: false
    };

    constructor(
        private _authService: AuthService,
        private _notificationService: NotificationService,
        private _referralService: ReferralService,
        private _translateService: TranslateService,
        private _platformLocation: PlatformLocation,
        private _formBuilder: FormBuilder,
        private _validatorService: ValidatorService,
        private _modalService: ModalService,
        private _memberService: MemberService,
    ) {
        this.memberTypeCodes = CONFIGURATION.member_type_code;
        this.referralModel = {
            borrowerLink: CONFIGURATION.referralLink.borrower,
            code: this._authService.getReferralCode(),
            copiedMessage: '',
            investorLink: CONFIGURATION.referralLink.investor,
            sharedTitle: ''
        };
        this.referralBorrowerForm = this._formBuilder.group({
          referralCompany: new FormControl(null, [Validators.required]),
          referralEmail: new FormControl(null, [Validators.required, Validators.email]),
          referralFullName: new FormControl(null, [Validators.required]),
          referralMobilePhoneNumber: new FormControl(null, [Validators.required, Validators.minLength(6)]),
          referrerCompany: new FormControl(null, []),
          referrerEmail: new FormControl(null, []),
          referrerFullName: new FormControl(null, []),
          referrerMobilePhoneNumber: new FormControl(null, []),
        });
    }

    ngOnInit() {
        this._translateService
            .get('referral')
            .subscribe(
                labels => {
                    this.referralModel.copiedMessage = labels['copied'];
                    this.referralModel.sharedTitle = labels['shared-title'];
                }
            );
        if (this.countryCode === 'SG') {
            this._memberService.getMemberDetail()
            .subscribe(
                member => {
                    this.memberDetail = member;
                    this.referralBorrowerForm.patchValue({
                        referrerCompany: this.memberDetail.companyName,
                        referrerEmail: this.memberDetail.userName,
                        referrerFullName: this.memberDetail.firstName,
                        referrerMobilePhoneNumber: this.memberDetail.mobilePhoneNumber,
                    });
                },
                error => {
                    this._notificationService.error();
                }
          );
          this._translateService.get('form.referral').subscribe(
              referral => {
                  this.referralBorrowerModel.error = referral.error;
                  this.referralBorrowerModel.success = referral.success;
              }
          );
        }
    }

    getMemberTypeCode(): string {
        return this._authService.getMemberTypeCode();
    }

    onCopyToClipboard(): void {
        this._notificationService.success(this.referralModel.copiedMessage);
    }

    share(platform: string): void {
        let referralLink = this._authService.getMemberTypeCode() === this.memberTypeCodes.investor ?
            this.referralModel.investorLink + this.referralModel.code :
            this.referralModel.borrowerLink + this.referralModel.code;
        let sharedMessage = '';
        switch(platform) {
            case 'facebook':
                this._referralService.shareOnFacebook(referralLink);
                break;
            case 'google-plus':
                this._referralService.shareOnGooglePlus(referralLink);
                break;
            case 'linked-in':
                this._referralService.shareOnLinkedIn(referralLink, this.referralModel.sharedTitle);
                break;
            case 'twitter':
                this._referralService.shareOnTwitter(referralLink);
                break;
        }
    }

    openReferralTermCondition() {
        window.open(this._platformLocation['location']['origin'] + '/term-condition-referral','_blank');
    }

    openModal(id: string): void {
      this._modalService.open(id);
    }

    closeModal(id: string): void {
      this._modalService.close(id);
    }

    onReferralBorrowerFormSubmit(): void {
        this.referralBorrowerModel.validation = true;
        const referralBorrowerValid = this.referralBorrowerForm.valid;
        if (referralBorrowerValid) {
            if (!this.referralBorrowerForm.value.referrerCompany) {
                this.referralBorrowerForm.patchValue({
                    referrerCompany: '-'
                });
            }
            this._memberService
                .addReferralBorrower(this.referralBorrowerForm.value, this.countryCode, CONFIGURATION.member_type_code.borrower)
                .subscribe(
                    response => {
                        this.closeModal('referralBorrower');
                        this.referralBorrowerModel.validation = false;
                        this.referralBorrowerForm.reset();
                        this._notificationService.success(this.referralBorrowerModel.success);
                    },
                    error => {
                        this._notificationService.error(this.referralBorrowerModel.error);
                    }
                );
        }
    }

}
