import { Injectable } from '@angular/core';

@Injectable()

export class ModalService {
  private modals: Array<any> = [];
  debug: Boolean = false; // Switch to enable debug message

  addModal(modal: any) {
    this.modals.push(modal);
    if (this.debug) {
      console.log('add %o', modal);
    }
  }

  removeModal(id: string) {
    this.modals = this.modals.filter((modal) => {
      return modal.id !== id;
    });
    if (this.debug) {
      console.log(`remove modal with id : ${id}`);
    }
  }

  open(id: string) {
    const modal = this.modals.find( curModal => {
      return curModal.id === id;
    });
    if (!modal) {
      if (this.debug) {
        console.error(`Unable to find modal with id: ${id}`);
      }
    } else {
      modal.open();
    }
  }

  close(id: string) {
    const modal = this.modals.find( curModal => curModal.id === id);
    if (!modal) {
      if (this.debug) {
        console.error(`Unable to find modal with id: ${id}`);
      }
    } else {
      modal.close();
    }
  }
}

