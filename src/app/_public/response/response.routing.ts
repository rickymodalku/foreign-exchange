import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { ResponseComponent } from './components/response.component';

const ROUTES: Routes = [
    {
        path: '',
        component: ResponseComponent
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


export class ResponseRouting { }