import {
    Inject,
    Injectable,
    Renderer2
} from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Injectable()
export class ScriptInjectorService {
    constructor(
        @Inject(DOCUMENT)
        private _document
    ) {
    }

    append(renderer: Renderer2, id: string, link: string, onload?: any ): void {
        let node = renderer.createElement('script');
        node.type = 'text/javascript';
        node.id = id;
        node.src = link;
        node.async = false;
        node.charset = 'utf-8';
        node.onload = onload;
        renderer.appendChild(this._document.head, node);
    }

    remove(renderer: Renderer2, id: string): void {
        var node = this._document.getElementById(id);
        if(node) {
            renderer.removeChild(this._document.head, node);
        }
    }
}
