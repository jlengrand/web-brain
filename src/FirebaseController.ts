import {ReactiveController, ReactiveControllerHost} from 'lit';

import { FirebaseApp, initializeApp } from "firebase/app";
import {FIREBASE_CONFIG} from "./constants.js";

export class FirebaseController implements ReactiveController {
    host: ReactiveControllerHost;
  
    value = [];
    
    private firebaseApp: FirebaseApp;

    constructor(host: ReactiveControllerHost) {
      (this.host = host).addController(this);
      this.firebaseApp = initializeApp(FIREBASE_CONFIG);
    }
  
    hostConnected() {
      // TODO
    }
  
    hostDisconnected() {
      // TODO
    }
  }

// export class ClockController implements ReactiveController {
//   host: ReactiveControllerHost;

//   value = new Date();
  
//   timeout: number;

//   private _timerID?: number;

//   constructor(host: ReactiveControllerHost) {
//     (this.host = host).addController(this);
//   }

//   hostConnected() {
//     // Start a timer when the host is connected
//     this._timerID = window.setInterval(() => {
//       this.value = new Date();
//       // Update the host with new value
//       this.host.requestUpdate();
//     }, this.timeout);
//   }

//   hostDisconnected() {
//     // Clear the timer when the host is disconnected
//     clearInterval(this._timerID);
//     this._timerID = undefined;
//   }
// }
