// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { VirtualAccountRouting } from './virtual-account.routing';
import { VirtualAccountComponent } from './components/virtual-account.component';
import { AccordionModule } from 'primeng/primeng';

@NgModule({
    declarations: [
        VirtualAccountComponent,
    ],
    imports: [
        CommonModule,
        VirtualAccountRouting,
        TranslateModule,
        AccordionModule
    ],
})

export class VirtualAccountModule { }
