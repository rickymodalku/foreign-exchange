import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MyInfoCallbackComponent } from './components/myinfo-callback.component';

const ROUTES: Routes = [
    {
        path: '',
        component: MyInfoCallbackComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES)
    ],
    exports: [
        RouterModule,
        TranslateModule
    ]
})


export class MyInfoCallbackRouting { }
