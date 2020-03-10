import {
    Inject,
    Injectable,
    Renderer2
} from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Injectable()
export class MetaService {
    constructor(
        @Inject(DOCUMENT)
        private _document
    ) {
    }

    removeElement(renderer: Renderer2, id: string): void {
        var node = this._document.getElementById(id);
        if(node) {
            renderer.removeChild(this._document.body, node);
        }
    }

    setTitle(value: string) {
        this._document.title = value;
    }

    setKeyword(renderer: Renderer2, value: string): void {
        let id = 'page_keyword';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('name', 'keyword');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }

    setDescription(renderer: Renderer2, value: string): void {
        let id = 'page_description';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('name', 'description');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }

    setOgUrl(renderer: Renderer2, value: string): void {
      let id = 'page_og_url';
      this.removeElement(renderer, id);

      let meta = this._document.createElement('meta');
      meta.setAttribute('id', id);
      meta.setAttribute('property', 'og:url');
      meta.setAttribute('content', value)
      renderer.appendChild(this._document.head, meta);
    }

    setOgTitle(renderer: Renderer2, value: string): void {
        let id = 'page_og_title';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('property', 'og:title');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }

    setOgType(renderer: Renderer2, value: string): void {
        let id = 'page_og_type';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('property', 'og:type');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }

    setOgImage(renderer: Renderer2, value: string): void {
        let id = 'page_og_image';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('property', 'og:image');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }

    setOgDescription(renderer: Renderer2, value: string): void {
        let id = 'page_og_description';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('property', 'og:description');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }

    setTwitterCard(renderer: Renderer2, value: string): void {
        let id = 'page_twitter_card';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('name', 'twitter:card');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }

    setTwitterSite(renderer: Renderer2, value: string): void {
        let id = 'page_twitter_site';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('name', 'twitter:site');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }

    setTwitterDescription(renderer: Renderer2, value: string): void {
        let id = 'page_twitter_description';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('name', 'twitter:description');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }

    setTwitterImageSrc(renderer: Renderer2, value: string): void {
        let id = 'page_twitter_image_src';
        this.removeElement(renderer, id);

        let meta = this._document.createElement('meta');
        meta.setAttribute('id', id);
        meta.setAttribute('name', 'twitter:image:src');
        meta.setAttribute('content', value)
        renderer.appendChild(this._document.head, meta);
    }
}
