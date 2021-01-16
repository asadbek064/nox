import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StatusService {
    camStream: boolean;
    camStream_Change: BehaviorSubject<boolean> = new BehaviorSubject(false);

    connected: boolean;
    connected_Change: BehaviorSubject<boolean> = new BehaviorSubject(false);
    callEnd: boolean;
    callEnd_Change: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    constructor() {
        this.camStream_Change.subscribe(
            newState => {
                this.camStream = newState;
            }
        );

        this.connected_Change.subscribe(
            newState => {
                this.connected = newState;
                if (newState) {
                        
                }
            }
        );

        this.callEnd_Change.subscribe(
            newState => {
                this.callEnd = newState;
            }
        );
    }
}