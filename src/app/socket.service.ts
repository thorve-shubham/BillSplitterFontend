import { Injectable, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable()
export class SocketService implements OnDestroy{

  public socket : any;

  constructor() {
    // this.socket = io("http://localhost:3000/billSplitter");
    this.socket = io("http://api.shubhamthorvetest.in/billSplitter");
  }

  emit(event,data){
    this.socket.emit(event,data);
  }

  listenToEvent(userId) {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
  }

  ngOnDestroy(): void {
    this.socket.destroy();  
  }
}
