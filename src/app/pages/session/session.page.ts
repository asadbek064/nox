import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage implements OnInit {
  isConnected: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isCamConnected: BehaviorSubject<boolean> = new BehaviorSubject(false);
  progressBarColor: string;
  
  constructor(private statusService: StatusService) {
    this.statusService.connected_Change.subscribe(
      newState => {
        this.isConnected.next(newState);
 
        if (newState) {
          this.progressBarColor = 'success';
        }
      
        // user end call refresh session
        if (!newState && !this.statusService.callEnd.valueOf()) {
          console.log('call has ended reload'); 
          this.reloadSessionAfterEndCall();
        }
      }
    )
    
    this.statusService.camStream_Change.subscribe(
    newState => {
        this.progressBarColor = 'warning';
        this.isCamConnected.next(newState);
      }
    )
}

  reloadSessionAfterEndCall() {
    console.log('reload session');
    
    if( window.localStorage )
    {
      if( !localStorage.getItem('sessionReload') )
      {
        localStorage['sessionReload'] = true;
        window.location.reload();
      }  
      else
        localStorage.removeItem('sessionReload');
    }
  }

  ngOnInit() {
  }

}
