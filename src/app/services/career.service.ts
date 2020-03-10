import { Injectable } from '@angular/core';

@Injectable()
export class CareerService {
    logCareerLink () {
        let cssRule = `
            'color: 'blue';
            font-size: 120px;
            font-weight: bold;
            '`;
        console.log(`
%cWe are hiring!

%cCheck us out at http://bit.ly/2UMk66k-software-engineer-frontend and let's have a chat.
        `, 
        'font-weight: bold; font-size: 30px; color:rgba(62,126,255,1); text-shadow: 4px 4px 4px #CCCCCC;',
        'font-weight: bold; font-size: 12px; color: rgba(62,126,255,1);',
        )
    }
}