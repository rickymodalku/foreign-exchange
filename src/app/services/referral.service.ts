import { Injectable } from '@angular/core';

@Injectable()
export class ReferralService {
    private windowProperties: string;

    constructor() {
        this.windowProperties = 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0';
    }

    shareOnFacebook(referralLink: string): void {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + referralLink, '', this.windowProperties);
    }

    shareOnGooglePlus(referralLink: string) {
        window.open('https://plus.google.com/share?url=' + referralLink, '', this.windowProperties);
    }

    shareOnLinkedIn(referralLink: string, sharedTitle: string) {
        window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + referralLink + '&title= ' + sharedTitle , '', this.windowProperties);
    }

    shareOnTwitter(referralLink: string,) {
        window.open('https://twitter.com/home?status=' + ' ' + referralLink, '', this.windowProperties);
    }
}
