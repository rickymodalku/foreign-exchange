// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AllocationPolicyRouting } from './allocation-policy.routing';
import { AllocationPolicyComponent } from './components/allocation-policy.component';

@NgModule({
    declarations: [
        AllocationPolicyComponent,
    ],
    imports: [
        AllocationPolicyRouting,
        TranslateModule,
    ],
})

export class AllocationPolicyModule { }
