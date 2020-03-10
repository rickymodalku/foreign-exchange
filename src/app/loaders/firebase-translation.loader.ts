import { TranslateLoader } from '@ngx-translate/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import CONFIGURATION from '../../configurations/configuration';

export class FirebaseTranslationLoader implements TranslateLoader {
  constructor(private _angularFireDatabase: AngularFireDatabase) {}
  public getTranslation(lang: string, prefix: string = 'locales/' + CONFIGURATION.country_code + '/'): Observable<any> {
    return this._angularFireDatabase.object(`${prefix}${lang}`).valueChanges() as Observable<any>;
  }
}
