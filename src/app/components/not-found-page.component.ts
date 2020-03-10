import {
    Component,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute,
    Params,
    Router
} from '@angular/router';
import { DialogService } from '../services/dialog.service';


@Component({
    selector: 'not-found-page',
    templateUrl: './not-found-page.html'
})

export class NotFoundPageComponent implements OnInit {
    constructor(private _activatedRoute: ActivatedRoute, private _dialogService: DialogService) {

    }
    ngOnInit() {
    }

}
