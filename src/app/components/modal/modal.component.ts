import { Component, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'modal',
    template: '<ng-content></ng-content>'
})

export class ModalComponent implements OnInit, OnDestroy {
    @Input() id: string;
    @Input() enableCloseOnBackgroundClicked: boolean;
    @Input() enableIOSfix; boolean;

    private element: HTMLElement;

    constructor (
      private modalService: ModalService,
      private el: ElementRef,
      private renderer: Renderer2
    ) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        let modal = this;
        if (!this.id) {
          console.error('modal must have an id');
          return;
        }

        this.renderer.appendChild(document.body, modal.element);
        this.modalService.addModal(this);
    }

    ngOnDestroy(): void {
      this.modalService.removeModal(this.id);
      this.removeNoScroll();
      this.element.remove();
      if (this.enableCloseOnBackgroundClicked) {
        this.element.removeEventListener('click', (e) => {
        });
      }
    }

    open(): void {
      this.renderer.addClass(document.body, 'no-scroll');
      if (this.enableIOSfix ) {
        this.renderer.addClass(document.body, 'modal-open-fix-for-ios');
      }
      this.renderer.removeClass(this.element, 'fs-modal--hidden');
      this.renderer.setStyle(this.element, 'display', 'block');
    }

    close(): void {
      this.renderer.removeClass(document.body, 'no-scroll');
      if (this.enableIOSfix ) {
        this.renderer.removeClass(document.body, 'modal-open-fix-for-ios');
      }
      this.renderer.addClass(this.element, 'fs-modal--hidden');
      this.renderer.setStyle(this.element, 'display', 'none');
    }

    removeNoScroll(): void {
      this.renderer.removeClass(document.body, 'no-scroll');
      this.renderer.removeClass(document.body, 'modal-open-fix-for-ios');
    }
}
