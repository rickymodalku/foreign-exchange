import { Injectable } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-webstorage';
import { SecurityService } from './security.service';
import CONFIGURATION from '../../configurations/configuration';
import { EventEmitter } from '../models/generic.class';
@Injectable()
export class LanguageService {
    languages: Array<any>;
    languageKey: string;
    languageChangeEventEmitter: EventEmitter;
    localeMapping: any;

    constructor(
        private _localStorageService: LocalStorageService,
        private _securityService: SecurityService,
        private _cookieService: CookieService
    ) {
        this.languages = new Array<any>();
        this.languageKey = this._securityService.encode(CONFIGURATION.encryption_key, "language");
        this.languageChangeEventEmitter = new EventEmitter();

        this.registerConstant('en', 'English');
        this.registerConstant('aa', 'Afar');
        this.registerConstant('ab', 'Abkhazian');
        this.registerConstant('af', 'Afrikaans');
        this.registerConstant('am', 'Amharic');
        this.registerConstant('ar', 'Arabic');
        this.registerConstant('as', 'Assamese');
        this.registerConstant('ay', 'Aymara');
        this.registerConstant('az', 'Azerbaijani');
        this.registerConstant('ba', 'Bashkir');
        this.registerConstant('be', 'Byelorussian');
        this.registerConstant('bg', 'Bulgarian');
        this.registerConstant('bh', 'Bihari');
        this.registerConstant('bi', 'Bislama');
        this.registerConstant('bn', 'Bengali/Bangla');
        this.registerConstant('bo', 'Tibetan');
        this.registerConstant('br', 'Breton');
        this.registerConstant('ca', 'Catalan');
        this.registerConstant('co', 'Corsican');
        this.registerConstant('cs', 'Czech');
        this.registerConstant('cy', 'Welsh');
        this.registerConstant('da', 'Danish');
        this.registerConstant('de', 'German');
        this.registerConstant('dz', 'Bhutani');
        this.registerConstant('el', 'Greek');
        this.registerConstant('eo', 'Esperanto');
        this.registerConstant('es', 'Spanish');
        this.registerConstant('et', 'Estonian');
        this.registerConstant('eu', 'Basque');
        this.registerConstant('fa', 'Persian');
        this.registerConstant('fi', 'Finnish');
        this.registerConstant('fj', 'Fiji');
        this.registerConstant('fo', 'Faeroese');
        this.registerConstant('fr', 'French');
        this.registerConstant('fy', 'Frisian');
        this.registerConstant('ga', 'Irish');
        this.registerConstant('gd', 'Scots/Gaelic');
        this.registerConstant('gl', 'Galician');
        this.registerConstant('gn', 'Guarani');
        this.registerConstant('gu', 'Gujarati');
        this.registerConstant('ha', 'Hausa');
        this.registerConstant('hi', 'Hindi');
        this.registerConstant('hr', 'Croatian');
        this.registerConstant('hu', 'Hungarian');
        this.registerConstant('hy', 'Armenian');
        this.registerConstant('ia', 'Interlingua');
        this.registerConstant('ie', 'Interlingue');
        this.registerConstant('ik', 'Inupiak');
        this.registerConstant('id', 'Bahasa Indonesia');
        this.registerConstant('is', 'Icelandic');
        this.registerConstant('it', 'Italian');
        this.registerConstant('iw', 'Hebrew');
        this.registerConstant('ja', 'Japanese');
        this.registerConstant('ji', 'Yiddish');
        this.registerConstant('jw', 'Javanese');
        this.registerConstant('ka', 'Georgian');
        this.registerConstant('kk', 'Kazakh');
        this.registerConstant('kl', 'Greenlandic');
        this.registerConstant('km', 'Cambodian');
        this.registerConstant('kn', 'Kannada');
        this.registerConstant('ko', 'Korean');
        this.registerConstant('ks', 'Kashmiri');
        this.registerConstant('ku', 'Kurdish');
        this.registerConstant('ky', 'Kirghiz');
        this.registerConstant('la', 'Latin');
        this.registerConstant('ln', 'Lingala');
        this.registerConstant('lo', 'Laothian');
        this.registerConstant('lt', 'Lithuanian');
        this.registerConstant('lv', 'Latvian/Lettish');
        this.registerConstant('mg', 'Malagasy');
        this.registerConstant('mi', 'Maori');
        this.registerConstant('mk', 'Macedonian');
        this.registerConstant('ml', 'Malayalam');
        this.registerConstant('mn', 'Mongolian');
        this.registerConstant('mo', 'Moldavian');
        this.registerConstant('mr', 'Marathi');
        this.registerConstant('ms', 'Bahasa Melayu');
        this.registerConstant('mt', 'Maltese');
        this.registerConstant('my', 'Burmese');
        this.registerConstant('na', 'Nauru');
        this.registerConstant('ne', 'Nepali');
        this.registerConstant('nl', 'Dutch');
        this.registerConstant('no', 'Norwegian');
        this.registerConstant('oc', 'Occitan');
        this.registerConstant('om', '(Afan);/Oromoor/Oriya');
        this.registerConstant('pa', 'Punjabi');
        this.registerConstant('pl', 'Polish');
        this.registerConstant('ps', 'Pashto/Pushto');
        this.registerConstant('pt', 'Portuguese');
        this.registerConstant('qu', 'Quechua');
        this.registerConstant('rm', 'Rhaeto-Romance');
        this.registerConstant('rn', 'Kirundi');
        this.registerConstant('ro', 'Romanian');
        this.registerConstant('ru', 'Russian');
        this.registerConstant('rw', 'Kinyarwanda');
        this.registerConstant('sa', 'Sanskrit');
        this.registerConstant('sd', 'Sindhi');
        this.registerConstant('sg', 'Sangro');
        this.registerConstant('sh', 'Serbo-Croatian');
        this.registerConstant('si', 'Singhalese');
        this.registerConstant('sk', 'Slovak');
        this.registerConstant('sl', 'Slovenian');
        this.registerConstant('sm', 'Samoan');
        this.registerConstant('sn', 'Shona');
        this.registerConstant('so', 'Somali');
        this.registerConstant('sq', 'Albanian');
        this.registerConstant('sr', 'Serbian');
        this.registerConstant('ss', 'Siswati');
        this.registerConstant('st', 'Sesotho');
        this.registerConstant('su', 'Sundanese');
        this.registerConstant('sv', 'Swedish');
        this.registerConstant('sw', 'Swahili');
        this.registerConstant('ta', 'Tamil');
        this.registerConstant('te', 'Tegulu');
        this.registerConstant('tg', 'Tajik');
        this.registerConstant('th', 'Thai');
        this.registerConstant('ti', 'Tigrinya');
        this.registerConstant('tk', 'Turkmen');
        this.registerConstant('tl', 'Tagalog');
        this.registerConstant('tn', 'Setswana');
        this.registerConstant('to', 'Tonga');
        this.registerConstant('tr', 'Turkish');
        this.registerConstant('ts', 'Tsonga');
        this.registerConstant('tt', 'Tatar');
        this.registerConstant('tw', 'Twi');
        this.registerConstant('uk', 'Ukrainian');
        this.registerConstant('ur', 'Urdu');
        this.registerConstant('uz', 'Uzbek');
        this.registerConstant('vi', 'Vietnamese');
        this.registerConstant('vo', 'Volapuk');
        this.registerConstant('wo', 'Wolof');
        this.registerConstant('xh', 'Xhosa');
        this.registerConstant('yo', 'Yoruba');
        this.registerConstant('zh', 'Chinese 中文');
        this.registerConstant('zu', 'Zulu');

        this.localeMapping = {
            'zh': 'zh-CN',
            'id': 'id-ID',
            'en': 'en-US'
        }
    }

    changeLanguage(code: string): void {
        if (this.checkLanguage(code)) {
            this._localStorageService.store(this.languageKey, this._securityService.encode(CONFIGURATION.encryption_key, code));
            this.languageChangeEventEmitter.emit(true);
            // set cookie for the new landing page framework so that nginx can pick it up and switch between different folders
            this._cookieService.set('locale', this.localeMapping[code]);
        }
    }

    private checkLanguage(code: string): boolean {
        let language = this.languages.find(language => {
            return language.code === code;
        });

        return language ? true : false;
    }

    getLocaleMapping () {
        return Object.assign({}, this.localeMapping);
    }

    getDefaultLanguage(): string {
        const result = this._localStorageService.retrieve(this.languageKey);
        return typeof result !== "undefined" && result !== "" && result !== null ? this._securityService.decode(CONFIGURATION.encryption_key, result) : CONFIGURATION.language;
    }

    getDefaultLanguageLabel(code): string {
        const language = this.languages.find(language => {
            return language.code === code;
        });

        return language ? language.label : '';
    }

    getLanguage(code): object {
        const curlanguage = this.languages.find( language => {
            return language.code === code;
        });

        return curlanguage ? curlanguage : undefined;
    }

    getSupportLanguages(supportedLanguages): Array<Object> {
        const languages = supportedLanguages.slice().map( (languageKey) => {
            const language = this.getLanguage(languageKey)
            return language;
        });
        return languages;
    }

    private registerConstant(code: string, label: string): void {
        this.languages.push({
            code: code,
            label: label
        });
    }
}
