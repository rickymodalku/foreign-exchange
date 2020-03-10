// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordRouting } from './password.routing';
import { PasswordComponent } from './components/password.component';

@NgModule({
    declarations: [
        PasswordComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        CommonModule,
        PasswordRouting,
    ],
})

export class PasswordModule { }