
import {of as observableOf,  Observable } from 'rxjs';
import { PreloadingStrategy, Route } from '@angular/router';

export class CustomPreloading implements PreloadingStrategy {
  preload(route: Route, preload: Function): Observable<any> {
    if (route.data && route.data.preload) {
      return preload();
    } else {
      return observableOf(null);
    }
  }
}
