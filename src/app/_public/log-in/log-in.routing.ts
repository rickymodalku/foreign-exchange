import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { LogInComponent } from './components/log-in.component';

const ROUTES: Routes = [
    {
        path: '',
        component: LogInComponent
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


export class LogInRouting { }
