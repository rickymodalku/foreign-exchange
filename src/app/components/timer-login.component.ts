
import {fromEvent as observableFromEvent,  Subscription ,  Observable } from 'rxjs';

import {debounceTime} from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';


@Component({
  selector: 'timer-login-section',
  template: ``
})

export class TimerLoginComponent implements OnInit, OnDestroy {
  idleInMiliseconds = 900000; // 15 mins
  idleId: any;
  stopTimer: boolean;

  mouseMoveSubscription: Subscription;
  mouseDownSubscription: Subscription;
  keyPressSubscription: Subscription;
  touchMoveSubscription: Subscription;

  public constructor() {
    this.stopTimer = true;
  }

  ngOnInit() {
    this.idleTime();
  }

  doInactive() {
    window.location.reload();
  }

  idleTime() {
    this.mouseMoveSubscription = observableFromEvent(window, 'mousemove').pipe(
      debounceTime(1000))
      .subscribe(e => {
        this.resetTimer();
      });
    this.mouseDownSubscription = observableFromEvent(window, 'mousedown').pipe(
      debounceTime(1000))
      .subscribe(e => {
        this.resetTimer();
      });
    this.keyPressSubscription = observableFromEvent(window, 'keypress').pipe(
      debounceTime(1000))
      .subscribe(e => {
        this.resetTimer();
      });
    this.touchMoveSubscription = observableFromEvent(window, 'touchmove').pipe(
      debounceTime(1000))
      .subscribe(e => {
        this.resetTimer();
      });
    this.startTimer();
  }

  resetTimer() {
    clearTimeout(this.idleId);
    this.startTimer();
  }

  startTimer() {
    this.stopTimer = false;
    this.idleId = setTimeout(() => { this.doInactive(); }, this.idleInMiliseconds);
  }

  ngOnDestroy() {
    clearTimeout(this.idleId);
    this.keyPressSubscription.unsubscribe();
    this.mouseDownSubscription.unsubscribe();
    this.mouseMoveSubscription.unsubscribe();
    this.touchMoveSubscription.unsubscribe();
  }
}
