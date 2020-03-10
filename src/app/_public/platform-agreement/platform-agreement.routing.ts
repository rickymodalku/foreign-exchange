import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { PlatformAgreementComponent } from './components/platform-agreement.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PlatformAgreementComponent
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


export class PlatformAgreementRouting { }
