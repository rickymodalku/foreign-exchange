// ====================
// == MODULES IMPORT ==
// ====================
import { NgModule } from '@angular/core';

import { MyInfoCallbackRouting } from './myinfo-callback.routing';
// =======================
// == COMPONENTS IMPORT ==
// =======================
import { MyInfoCallbackComponent } from './components/myinfo-callback.component';

@NgModule({
  declarations: [
    MyInfoCallbackComponent,
  ],
  imports: [
    MyInfoCallbackRouting
  ]

})

export class MyInfoCallbackModule {}
