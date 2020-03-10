import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { SbnInfoComponent } from './components/sbn-info.component';
import { CommonModule } from '@angular/common';

const ROUTES: Routes = [
  {
    path: '',
    component: SbnInfoComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    RouterModule,
    CommonModule
  ]
})


export class SbnInfoRouting { }
