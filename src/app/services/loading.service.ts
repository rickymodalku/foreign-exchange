import { Injectable } from "@angular/core";
import { UUID } from 'angular2-uuid';
import {
    LoadingMessage,
    MessageEventEmitter,
    RequestEventEmitter,
    ResponseEventEmitter
} from '../models/loading.class';

@Injectable()
export class LoadingService {
   beforeRequest: RequestEventEmitter;
   afterRequest: ResponseEventEmitter;
   messageRequest: MessageEventEmitter;
   clearRequest: MessageEventEmitter;

   constructor() {
       this.beforeRequest = new RequestEventEmitter();
       this.afterRequest = new ResponseEventEmitter();
       this.messageRequest = new MessageEventEmitter();
       this.clearRequest = new MessageEventEmitter();
   }

   message(message: string, delay: number) {
        return this.messageRequest.emit(<LoadingMessage>({
            delay: delay,
            key: UUID.UUID(),
            message: message
        }));
   }
}
