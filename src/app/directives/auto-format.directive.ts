import {
  Directive,
  HostListener,
  Input,
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
      const newValue = this.autoFormatService.formatValue(this.control.value, this.autoFormatType);
      this.control.viewToModelUpdate(newValue);
      this.control.valueAccessor.writeValue(newValue);
      this.control.control.setValue(newValue);
    }
  }
  constructor(
    private control: NgControl,
    private autoFormatService: AutoFormatService
  ) {
  }
}
