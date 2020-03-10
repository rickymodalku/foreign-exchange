import {
  Directive, ElementRef, EventEmitter,
  HostListener, Input, OnInit, Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as $ from 'jquery';
import 'intl-tel-input';
import 'intl-tel-input/build/js/utils';

@Directive({
  selector: '[telInput]',
})
export class TelInputDirective implements OnInit {
  @Input('telInputOptions') telInputOptions: any;
  @Output('isValid') isValid: EventEmitter<boolean> = new EventEmitter();
  @Output('telOutput') telOutput: EventEmitter<any> = new EventEmitter();
  @Output('countryChange') countryChange: EventEmitter<any> = new EventEmitter();
  @Output('intlTelInputObject') intlTelInputObject: EventEmitter<any> = new EventEmitter();
  ngTelInput: any;
  private debounceIsInputValid = new Subject();
  private debounceTelOutput = new Subject();

  constructor(private el: ElementRef) { }
  ngOnInit() {
    this.ngTelInput = $(this.el.nativeElement);
    // For the list of options please refer to https://github.com/jackocnr/intl-tel-input#public-methods
    if (this.telInputOptions) {
      this.ngTelInput.intlTelInput(this.telInputOptions);
    }
    this.ngTelInput.on('countrychange', (e: any, countryData: any) => {
      this.countryChange.emit(countryData);
    });
    this.intlTelInputObject.emit(this.ngTelInput);
    this.debounceIsInputValid.pipe(debounceTime(200)).subscribe( e => this.isValid.emit(<boolean> e));
    this.debounceTelOutput.pipe(debounceTime(200)).subscribe( e => this.telOutput.emit(e));
  }

  @HostListener('keyup', ['$event'])
  onKeyup(event) {
    const isInputValid: boolean = this.isInputValid();
    if (isInputValid) {
      const telOutput = this.ngTelInput.intlTelInput('getNumber');
      this.debounceTelOutput.next(telOutput);
    }
    this.debounceIsInputValid.next(isInputValid);
  }

  isInputValid(): boolean {
    return this.ngTelInput.intlTelInput('isValidNumber');
  }

  checkIsInputValid(): void {
    const isInputValid: boolean = this.isInputValid();
    this.debounceIsInputValid.next(isInputValid);
  }

  setCountry(country: any) {
    this.ngTelInput.intlTelInput('setCountry', country);
  }

  setNumber(number: any) {
    this.ngTelInput.intlTelInput('setNumber', number);
  }
}
