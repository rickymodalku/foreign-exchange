import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import CONFIGURATION from '../../configurations/configuration';
import { ENVIRONMENT } from '../../environments/environment';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { map } from 'rxjs/operators';

@Injectable()
export class MaintenanceService {
  constructor(
    private _angularFireDatabase: AngularFireDatabase
  ) { }

  private getMaintenanceStatus(environmentName) {
    const path = `${environmentName}-maintenance-mode/${CONFIGURATION.country_code.toLowerCase()}/`;
    return this._angularFireDatabase.object(path).valueChanges() as Observable<any>;

  }

  private getServiceDownStatus(environmentName) {
    const path = `${environmentName}-service-down-mode/${CONFIGURATION.country_code.toLowerCase()}/`;
    return this._angularFireDatabase.object(path).valueChanges() as Observable<any>;
  }

  /**
  *  We only enable the maintenance mode for staging and production
  *  The reason is that we try to reduce the dependency on firebase
  *  and only use it for certain use cases.
  *
  *  Please access this functionality at
  *  https://alice-writes-web-3.firebaseio.com/
  *
  *  With the following object:
  *  production-maintenance-mode
  *  staging-maintenance-mode
  *  production-service-down-mode
  *  staging-service-down-mode
  *  Each object would be using the country code to toggle the
  *  maintenance mode. For example, id=true to toggle the maintenance mode or service down mode
  *  and false to disable it.
  */

  onlyGetMaintenanceModeForStagingAndProduction(): Observable<any> {
    const environmentName = ENVIRONMENT.environment_name;
    if (environmentName === 'uat' || environmentName === 'staging' || environmentName === 'production' || environmentName === 'localhost') {
      return this.getMaintenanceStatus(environmentName);
    } else {
      return new EmptyObservable();
    }
  }

  onlyGetServiceDownModeForStagingAndProduction(): Observable<any> {
    const environmentName = ENVIRONMENT.environment_name;
    if (environmentName === 'uat' || environmentName === 'staging' || environmentName === 'production' || environmentName === 'localhost') {
      return this.getServiceDownStatus(environmentName);
    } else {
      return new EmptyObservable();
    }
  }

}
