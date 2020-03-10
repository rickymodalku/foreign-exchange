import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { PrivacyNoticeInvoiceFinancingComponent } from './components/privacy-notice-invoice-financing.component';

const ROUTES: Routes = [
    {
        path: '',
        component: PrivacyNoticeInvoiceFinancingComponent
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


export class PrivacyNoticeInvoiceFinancingRouting { }