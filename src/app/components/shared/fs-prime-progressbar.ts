import {Component, Input} from '@angular/core';

@Component({
    selector: 'fs-p-progressBar',
    template: `
        <div [class]="styleClass" [ngStyle]="style" role="progressbar" aria-valuemin="0" [attr.aria-valuenow]="value" aria-valuemax="100"
            [ngClass]="{'ui-progressbar ui-widget ui-widget-content ui-corner-all': true, 'ui-progressbar-determinate': (mode === 'determinate'), 'ui-progressbar-indeterminate': (mode === 'indeterminate')}">
            <div class="ui-progressbar-value ui-progressbar-value-animate ui-widget-header ui-corner-all" [style.width]="value + '%'" style="display:block"></div>
            <div class="ui-progressbar-label" [style.display]="value != null ? 'block' : 'none'" *ngIf="showValue">{{label}}{{unit}}</div>
        </div>
    `
})
export class FsProgressBar {
    @Input() value: any;
    @Input() label: any;
    @Input() showValue: boolean = true;
    @Input() style: any;
    @Input() styleClass: string;
    @Input() unit: string = '%';
    @Input() mode: string = 'determinate';
}
