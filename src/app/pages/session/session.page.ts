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

  
  constructor(private statusService: StatusService) {
    this.statusService.connected_Change.subscribe(
      newState => {
        this.isConnected.next(newState)
      }
    )

    this.statusService.camStream_Change.subscribe(
      newState => {
        this.isCamConnected.next(newState);
      }
    )
}

  ngOnInit() {
  }

}
