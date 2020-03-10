import { BaseParameterService } from '../../../services/base-parameter.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WindowService } from '../../../services/window.service';
import { ModalService } from 'app/services/modal.service';
import { Country } from 'app/models/baseParameters.class';
import CONFIGURATION from '../../../../configurations/configuration';


class JobCountry extends Country {
  active: Boolean;
}

class Job {
  category: String;
  country: String; // mapped to country name
  description: String;
  position: String;
  email: String;
}

@Component({
  selector: 'career',
  templateUrl: './career.html'
})

export class CareerComponent implements OnInit {
  jobCountry: Array<JobCountry>;
  jobDetailPage: boolean;
  selectedJobDetail: string;
  selectedCountry: string;
  filteredJobs: any;
  jobLov: Array<Job>;
  jobCategory: Array<any>;
  hrEmails: Object;
  imageBaseUrl: any;
  dataAnaylstExternalLink: string;
  showJobCategory: boolean;
  careerBambooHRLink: string;

  constructor(
    private _baseParameterService: BaseParameterService,
    private _translateService: TranslateService,
    private _windowService: WindowService,
    private _renderer2: Renderer2,
    private _modalService: ModalService,
  ) {

    this.imageBaseUrl = CONFIGURATION.image_base_url;
    this.jobCategory = new Array;
    this.jobDetailPage = false;
    this.jobLov = new Array;
    this.selectedCountry = 'ALL';
    this.dataAnaylstExternalLink = 'https://app.beapplied.com/apply/vSi1ivZFyM';
    this.showJobCategory = false;
    this.careerBambooHRLink = CONFIGURATION.careerBambooHRLink;
  }

  ngOnInit() {
    this.hrEmails = {
      ID: 'hcmk@modalku.co.id',
      SG: 'hcsg@fundingsocieties.com',
      MY: 'hcmy@fundingsocieties.com'
    };

    this.jobCountry = this._baseParameterService.getCountryList()
      .map( obj => {
         obj['active'] = false;
         return <JobCountry> obj;
      });
    this.jobCountry[this.jobCountry.findIndex(el => el.code === 'ALL')].active = true;
    this._translateService
      .get('job-vacancy')
      .subscribe(
      jobLov => {
        this.jobLov = jobLov.map( job => {
          const countryCode = this._baseParameterService.getCountryList().find( country => country.name === job.country).code;
          job['email'] = this.hrEmails[countryCode];
          job['externalLink'] = job.position.includes('Data Analyst') ? this.dataAnaylstExternalLink : '';
          return job;
        });
        this.filteredJobs = this.jobLov;
        this._translateService
          .get('career.job-category')
          .subscribe(
          jobCategory => {
            for (const key of jobCategory) {
              this.jobCategory.push({
                category: key['category'],
                jobopen: 0
              });
            }
            this.calculateNumberOfOpenedPosition();
          }
          );
      });
  }

  calculateNumberOfOpenedPosition() {
    const self = this;
    for (const job of this.jobCategory) {
      job['jobopen'] = this.filteredJobs.filter(function (v) { return v.category === job['category']}).length;
    }
  }

  filterJobByCountry(country: any) {
    this.filteredJobs = this.jobLov;
    this.jobCountry.map(function(x) {
      x.active = false;
      return x;
    });
    this.selectedCountry = country.name;
    this.jobCountry[this.jobCountry.findIndex(el => el.code === country.code)].active = true;
    if (country.code !== 'ALL') {
      this.filteredJobs = this.jobLov.filter(job => job.country === country.name);
    }
    this.calculateNumberOfOpenedPosition();
  }

  goToListJob(selectedjob: any) {
    if (selectedjob.jobopen > 0) {
      window.scrollTo(0, 0);
      this.selectedJobDetail = selectedjob.category;
      this.jobDetailPage = true;
      if (this.selectedCountry !== 'ALL') {
        this.filteredJobs = this.jobLov.filter(job => job.category === selectedjob.category && job.country === this.selectedCountry);
      } else {
        this.filteredJobs = this.jobLov.filter(job => job.category === selectedjob.category);
      }
    }
  }

  goTocurrentOpportunities() {
    if (this.showJobCategory) {
      this._windowService.smoothScroll('careerVacancyTitle');
    } else {
      window.open(this.careerBambooHRLink, '_blank');
    }
  }

  emailJob(email, position, country) {
    const emailLink = `mailto:${email}?Subject=[${country}] - ${position}`;
    const link = document.createElement('a');
    link.href = window['encodeURI'](emailLink);
    this._renderer2.appendChild(document.body, link);
    link.click();
    this._renderer2.removeChild(document.body, link);
  }

  openModal(id: string ): void {
    this._modalService.open(id);
  }

  closeModal(id: string ): void {
    this._modalService.close(id);
  }
}
