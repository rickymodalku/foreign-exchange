import {
    AfterViewInit,
    Component,
    OnInit,
    Renderer2
} from '@angular/core';
import { LoadingMessage } from '../models/loading.class';
import { LoadingService } from '../services/loading.service';
import { ScriptInjectorService } from '../services/script-injector.service';
import CONFIGURATION from '../../configurations/configuration';

@Component({
    selector: 'loading',
    templateUrl: './loading.html'
})
export class LoadingComponent implements OnInit, AfterViewInit {
    display: boolean;
    message: string;
    queue: Array<string>;
    timeout: number;

    constructor(
        private _loadingService: LoadingService,
        private _renderer: Renderer2,
        private _scriptInjectorService: ScriptInjectorService,
    ) {
        this.display = false;
        this.message = "";
        this.queue = new Array<string>();
        this.timeout = CONFIGURATION.loading_delay;
    }

    ngOnInit() {
        this._loadingService.beforeRequest.subscribe((data: string) => {
            this.enqueue(data);
        });
        this._loadingService.clearRequest.subscribe(isEnable => {
            if (isEnable) {
              this.queue = [];
            }
        });
        this._loadingService.afterRequest.subscribe((data: string) => {
            setTimeout(() => {
                this.dequeue(data);
            }, this.timeout);
        });
        this._loadingService.messageRequest.subscribe((data: LoadingMessage) => {
            this.display = true;
            this.message = data.message;
            this.timeout = data.delay;
            this._loadingService.afterRequest.emit(data.key);
        });
    }

    ngAfterViewInit() {
        this._scriptInjectorService.append(this._renderer, 'loading_hype_generated_script', './assets/js/Loading.hyperesources/loading_hype_generated_script.js');
    }

    dequeue(url: string): void {
        this.queue = this.queue.filter(element => {
            return element !== url;
        });
        this.display = this.queue.length > 0;
        if (!this.display) {
            this._renderer.addClass(document.body, 'loaded');
            this.message = "";
            this.timeout = CONFIGURATION.loading_delay;
        }
    }

    enqueue(url: string): void {
        let item = this.queue.find(element => {
            return element === url;
        });
        if (!item) {
            this.queue.push(url);
        }
        this.display = this.queue.length > 0;
        if (this.display) {
          this._renderer.removeClass(document.body, 'loaded');
        }
    }
}
