import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';

@Injectable()
export class MessageService {
  private LoginSubject: ReplaySubject<any> = new ReplaySubject<any>();

  constructor() {
  }

  sendMessage(message: string) {
    this.LoginSubject.next(message);
  }

  getLoginSubject(): Observable<any> {
    return this.LoginSubject.asObservable();
  }
}
