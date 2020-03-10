// =====================
// == SERVICES IMPORT ==
// =====================
import { ModalService } from '../../services/modal.service';

// =======================
// == COMPONENTS IMPORT ==
// =======================
import { NgModule } from '@angular/core';
import { ModalComponent } from './modal.component';

@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [],
  exports: [
    ModalComponent
  ],
  providers: [
    ModalService
  ]
})

export class ModalModule {}
