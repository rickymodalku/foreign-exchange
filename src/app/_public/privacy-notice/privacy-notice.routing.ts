import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { PrivacyNoticeComponent } from './components/privacy-notice.component';

const ROUTES: Routes = [
    {
        path: '',
        component: PrivacyNoticeComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES)
    ],
    exports: [
        RouterModule
    ]
})


export class PrivacyNoticeRouting { }