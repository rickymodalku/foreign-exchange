import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgControl,
    Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MemberService } from '../../../services/member.service';
import { NotificationService } from '../../../services/notification.service';
import { ValidatorService } from '../../../services/validator.service';
import CONFIGURATION from '../../../../configurations/configuration';

@Component({
    selector: 'newsletter',
    templateUrl: './newsletter.html'
})
export class NewsletterComponent implements OnInit {
    formModel: any;
    subscribeForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _memberService: MemberService,
        private _notificationService: NotificationService,
        private _translateService: TranslateService,
        private _validatorService: ValidatorService
    ) {
        this.formModel = {
            subscribe: {
                error: '',
                success: '',
                validation: false
            }
        };
        this.subscribeForm = this._formBuilder.group({
            email: new FormControl(null, [Validators.required, Validators.email])
        });
    }

    ngOnInit() {
        this._translateService
            .get('form.subscribe.error')
            .subscribe(
            errorMessage => {
                this.formModel.subscribe.error = errorMessage;
            }
            );

        this._translateService
            .get('form.subscribe.success')
            .subscribe(
            successMessage => {
                this.formModel.subscribe.success = successMessage;
            }
            );
    }

    onSubscribeFormSubmit() {
        this.formModel.subscribe.validation = true;
        if (this.subscribeForm.valid) {
            this._memberService
                .subscribeNewsletter({
                    countryId: CONFIGURATION.country_code,
                    userName: this.subscribeForm.value.email
                })
                .subscribe(
                response => {
                    this.formModel.subscribe.validation = false;
                    this.subscribeForm.reset();
                    this._notificationService.success(this.formModel.subscribe.success);
                },
                error => {
                    this._notificationService.error(this.formModel.subscribe.error);
                }
                );
        }
    }
}