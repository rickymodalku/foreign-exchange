import { Component, OnInit, Input } from '@angular/core';
import CONFIGURATION from '../../../configurations/configuration';
import { MaintenanceService } from '../../services/maintenance.service';
@Component({
  selector: 'maintenance',
  templateUrl: './maintenance.component.html'
})
export class MaintenanceComponent implements OnInit {
  @Input() msgToggle: string;
  logoSrc: String;
  CONFIGURATION: any;
  isMaintenanceMode: boolean;
  isServiceDownMode: boolean;
  mode: string;
  constructor(
    private _maintenanceService: MaintenanceService
  ) {
    this.logoSrc = CONFIGURATION.countryCode === 'ID' ? '/assets/img/header/logo-mk.png' : '/assets/img/header/logo.png';
    this.mode = '';
  }

  ngOnInit() {
    this._maintenanceService.onlyGetMaintenanceModeForStagingAndProduction().subscribe( response => {
      this.isMaintenanceMode = response || false;
      if (this.isMaintenanceMode) {
        this.mode = 'maintenance';
      }
    });

    this._maintenanceService.onlyGetServiceDownModeForStagingAndProduction().subscribe( response => {
      this.isServiceDownMode = response || false;
      if (this.isServiceDownMode) {
        this.mode = 'serviceDown';
      }
    });

    this.CONFIGURATION = CONFIGURATION;
  }
}
