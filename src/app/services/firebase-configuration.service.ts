import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import {Observable} from 'rxjs';
import CONFIGURATION from '../../configurations/configuration';

@Injectable({
  providedIn: 'root'
})
export class FirebaseConfigurationService {
  constructor(private _angularFireDatabase: AngularFireDatabase) {}
  getConfig(config: string): Observable<any> {
    return this._angularFireDatabase.object(`configs/${CONFIGURATION.country_code}/${config}`).valueChanges();
  }
}
