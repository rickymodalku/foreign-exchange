// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { XeroRouting } from './xero.routing';
import { XeroComponent } from './components/xero.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        XeroComponent,
    ],
    imports: [
        XeroRouting,
        TranslateModule,
        CommonModule
    ],
})

export class XeroModule { }
