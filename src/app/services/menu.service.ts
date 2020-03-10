import { Injectable } from "@angular/core";
import { 
    MenuEventEmitter
} from '../models/menu.class';

@Injectable()
export class MenuService {
    menuEventEmitter: MenuEventEmitter;
    
    constructor() {
        this.menuEventEmitter = new MenuEventEmitter();
    }

    displayMenu() {
        return this.menuEventEmitter.emit(true);
    }

}