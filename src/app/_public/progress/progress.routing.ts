import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';

import { ProgressComponent } from './components/progress.component';
import { ProgressIDComponent } from './components/progress-id.component';
import { ProgressMYComponent } from './components/progress-my.component';
import { ProgressSGComponent } from './components/progress-sg.component';


const ROUTES: Routes = [
  {
    path: 'indonesia',
    component: ProgressIDComponent,
  },
  {
    path: 'singapore',
    component: ProgressSGComponent,
  },
  {
    path: 'malaysia',
    component: ProgressMYComponent,
  },
  {
    path: '',
    component: ProgressComponent
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


export class ProgressRouting { }
