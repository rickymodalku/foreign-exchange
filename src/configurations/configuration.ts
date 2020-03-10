import baseConfiguration from './base.configuration';
import myConfiguration from './my.configuration';
import sgConfiguration from './sg.configuration';
import idConfiguration from './id.configuration';
import vnConfiguration from './vn.configuration';
import { ReviewAppService } from '../app/services/review-app.service';
import { ENVIRONMENT } from '../environments/environment';

const DEFAULT_COUNTRY_CODE = 'my';
const REVIEW_APP_URL_KEY = 'herokuapp';
const configurations = {
  'my': myConfiguration,
  'sg': sgConfiguration,
  'id': idConfiguration,
  'vn': vnConfiguration
};

let selectedCountry = '';

function getCountryCodeAccordingToUrl(baseUrls, host): string {
  if (!baseUrls || !host) {
    return '';
  } else {
    for (const key in baseUrls) {
      if (baseUrls[key].find(baseUrl => baseUrl === host)) {
        return key;
      }
    }
    return '';
  }
}

export function isReviewApp(): Boolean {
  return window.location.origin.indexOf(REVIEW_APP_URL_KEY) > -1;
}
// For review app, get country code from localstorage
if (isReviewApp()) {
  const countryService = new ReviewAppService();
  selectedCountry = countryService.getCountry() || DEFAULT_COUNTRY_CODE;
  // else gettting it from the url
} else {
  const countryCode = getCountryCodeAccordingToUrl(ENVIRONMENT.baseUrls, window.location.host);
  selectedCountry = countryCode !== '' ? countryCode : DEFAULT_COUNTRY_CODE;
}

export default Object.freeze(Object.assign({}, baseConfiguration, configurations[selectedCountry]));
