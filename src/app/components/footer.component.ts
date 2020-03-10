import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import CONFIGURATION from '../../configurations/configuration';
import { ENVIRONMENT } from 'environments/environment';
import { ModalService } from 'app/services/modal.service';

declare var window: any;
declare var google: any;

@Component({
  selector: 'footer-section',
  templateUrl: './footer.html'
})
export class FooterComponent {
  appLink: any;
  blogLink: string;
  countryCode: string;
  mediaPressLink: string;
  learningCenterLink: string;
  mediaSocialLink: any;
  referralProgram: any;
  showPrivacyNoticeInvoiceFinancing: boolean;
  showPrivacyNoticeMalay: boolean;
  languages; Array;
  headerLogoClassNamePrefix: any;
  ENVIRONMENT: any;
  crowdfundtalkLinkFooter: string;
  showCrowdfundtalk: boolean;
  storyLink: string;
  CONFIGURATION: any;
  showDisclosureNotice: boolean;
  disclosureNoticeLink: string;

  public constructor(
    private _languageService: LanguageService,
    private _router: Router,
    private _modalService: ModalService
  ) {
    this.appLink = {
      investorAppStore: CONFIGURATION.mobileAppUrl.investor.appStore,
      investorGooglePlay: CONFIGURATION.mobileAppUrl.investor.googlePlay,
      borrowerGooglePlay: CONFIGURATION.mobileAppUrl.borrower.googlePlay
    };
    this.ENVIRONMENT = ENVIRONMENT;
    this.blogLink = CONFIGURATION.blog;
    this.mediaPressLink = CONFIGURATION.mediapress;
    this.mediaSocialLink = {
      facebook: CONFIGURATION.facebook,
      twitter: CONFIGURATION.twitter,
      linkedin: CONFIGURATION.linkedin
    };
    this.CONFIGURATION = CONFIGURATION;
    this.countryCode = CONFIGURATION.country_code;
    this.learningCenterLink = CONFIGURATION.learningCenter;
    this.referralProgram = CONFIGURATION.referProgram;
    this.storyLink = CONFIGURATION.story;
    this.showPrivacyNoticeInvoiceFinancing = CONFIGURATION.showPrivacyNoticeInvoiceFinancing;
    this.showPrivacyNoticeMalay = CONFIGURATION.showPrivacyNoticeMalay;
    this.languages = this._languageService.getSupportLanguages(CONFIGURATION.supportedLanguages);
    this.headerLogoClassNamePrefix = CONFIGURATION.header_logo_classname_prefix;
    this.crowdfundtalkLinkFooter = CONFIGURATION.crowdfundtalkLinkFooter;
    this.showCrowdfundtalk = CONFIGURATION.showCrowdfundtalk;
    this.showDisclosureNotice = CONFIGURATION.showDisclosureNotice;
    this.disclosureNoticeLink = CONFIGURATION.disclosureNoticeLink;
  }

  changeLanguage(languageCode: string): void {
    window.location = window.location.origin + '/?lang=' + languageCode;
  }

  displayMap() {
    this.openModal('DirectionModal');
    this.initializeMap();
  }

  getDefaultLanguageLabel(): string {
    return this._languageService.getDefaultLanguageLabel(this._languageService.getDefaultLanguage());
  }

  goToLearningCenter() {
    window.open(this.learningCenterLink, '_blank');
  }

  goToFacebookLink() {
    window.open(this.mediaSocialLink.facebook, '_blank');
  }

  goToTwitterLink() {
    window.open(this.mediaSocialLink.twitter, '_blank');
  }

  goToLinkedinLink() {
    window.open(this.mediaSocialLink.linkedin, '_blank');
  }

  goToDisclosureNotice() {
    window.open(this.disclosureNoticeLink, '_blank');
  }

  initMap() {
    let currentContext = this;
    return function () {
      var initialPosition = { lat: CONFIGURATION.googleMap.initialPositionLat, lng: CONFIGURATION.googleMap.initialPositionLong };
      var map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: initialPosition,
        zoom: 10,
        streetViewControl: false,
        zoomControl: false
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var currentLat = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var map = new google.maps.Map(document.getElementById('map'), {
              mapTypeControl: false,
              center: currentPosition,
              zoom: 10,
              streetViewControl: false,
              zoomControl: false
            });
            var travel_mode = google.maps.TravelMode.DRIVING;
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var officePosition = new google.maps.LatLng(CONFIGURATION.googleMap.officePositionLat, CONFIGURATION.googleMap.officePositionLong);
            route(currentLat, officePosition, travel_mode, directionsService, directionsDisplay);
            directionsDisplay.setMap(map);
          },
          error => {
            console.error('Geolocation cannot detect current position');
          }
        );
      }

      function route(
        origin_place_id: any,
        destination_place_id: any,
        travel_mode: any,
        directionsService: any,
        directionsDisplay: any
      ) {
        if (!origin_place_id || !destination_place_id) {
          return;
        }
        directionsService.route({
          origin: origin_place_id,
          destination: destination_place_id,
          travelMode: travel_mode
        }, function (response: any, status: any) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
    };
  }

  initializeMap() {
    return new Promise((resolve, reject) => {
      let geoReady = navigator.geolocation || undefined;
      window.google = {};
      window.initMap = this.initMap();
      let script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + ENVIRONMENT.google.map_api_key + 'U&libraries=places&callback=initMap';
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (geoReady) {
          navigator.geolocation.getCurrentPosition(
            position => {
              let geocoder = new google.maps.Geocoder();
              let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              geocoder.geocode({ 'location': location }, function (results: any, status: any) {
                if (status === google.maps.GeocoderStatus.OK) {
                }
              });
              resolve();
            },
            error => {
              console.error(error);
              reject();
            }
          );
        } else {
          console.error('Device not ready');
        }
      }
      document.getElementsByTagName("head")[0].appendChild(script);
    });
  }

  showMapFooter() {
    var currentUrl = this._router.url;
    return currentUrl.indexOf("admin-investor") > -1 ||
      currentUrl.indexOf("admin-borrower") > -1 ||
      currentUrl.indexOf("signup-form") > -1;
  }

  openModal(id: string): void {
    this._modalService.open(id);
  }

  closeModal(id: string): void {
    this._modalService.close(id);
  }

  openAppLink(type: string) {
    if (type === 'googlePlayBorrower') {
      window.open(this.appLink.borrowerGooglePlay, '_blank');
    }
    if (type === 'googlePlayInvestor') {
      window.open(this.appLink.investorGooglePlay, '_blank');
    }
    if (type === 'appStoreInvestor') {
      window.open(this.appLink.investorAppStore, '_blank');
    }
  }
}
