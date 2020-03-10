// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ResponseRouting } from './response.routing';
import { ResponseComponent } from './components/response.component';
import { FormsModule } from '@angular/forms';

// =====================
// == SERVICES IMPORT ==
// =====================

@NgModule({
    declarations: [
        ResponseComponent,
    ],
    imports: [
        TranslateModule,
        CommonModule,
        ResponseRouting,
        FormsModule
    ],
})

export class ResponseModule { }
