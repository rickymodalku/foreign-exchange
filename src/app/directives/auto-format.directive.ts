import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer
} from '@angular/core';

import { NgControl } from '@angular/forms';
import { AutoFormatService } from '../services/auto-format.service';

@Directive({
  selector: '[autoFormat]',
})

export class AutoFormatDirective {
  @Input() autoFormatType: string;
  @HostListener('input') onInput(event) {
    if (this.control.value) {
      const newValue = this._autoFormatService.formatValue(this.control.value, this.autoFormatType);
      this.control.viewToModelUpdate(newValue);
      this.control.valueAccessor.writeValue(newValue);
      this.control.control.setValue(newValue);
    }
  }
  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private control: NgControl,
    private _autoFormatService: AutoFormatService
  ) {
  }
}
