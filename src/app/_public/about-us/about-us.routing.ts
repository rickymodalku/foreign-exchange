import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

import { AboutUsComponent } from './components/about-us.component';

const ROUTES: Routes = [
    {
        path: '',
        component: AboutUsComponent
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


export class AboutUsRouting { }