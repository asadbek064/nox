import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebRTCService } from '../../../services/webrtc.service';
import { ToastController } from '@ionic/angular';
import { StatusService } from '../../../services/status.service';
import shortid   from 'shortid32';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

const { Clipboard } = Plugins;
shortid.characters('23456789ABCDEFGHJKLMNPQRSTUVWXYZ'); // override defaults
@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.scss'],
})
export class UserContainerComponent implements OnInit {
  topVideoFrame = 'partner-video';
  userId: string;
  partnerId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  
  userCamStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  connectedStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

  VIDEO_AUDIO_CONSTRAINTS = { video: true, audio: true};
  
  /* STEPPER STATE */
  isJoinRoom: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isCreateRoom: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /* VIDEO CONTROL BUTTONS */
  HIDE_CAMERA: string;
  MUTE_AUDIO: string;

  constructor(
    private webRTCservice : WebRTCService,     
    public elRef: ElementRef,
    public toastController: ToastController,
    private statusService: StatusService,
    ) {
      this.initUserId();
      this.HIDE_CAMERA = "success";
      this.MUTE_AUDIO = "success";
      this.statusService.camStream_Change.subscribe(
        newState => {
          if (newState) {
            this.snackbar('Turning on Camera','top');
            this.userCamStatus.next(newState);

          } else {
            this.userCamStatus.next(newState);
          }
        }
      );

      this.statusService.connected_Change.subscribe(
        newState => {
          if(newState) {
            this.snackbar(`Joined Room: ${this.partnerId}`, 'top');
            this.connectedStatus.next(newState);
          } else {
            this.connectedStatus.next(newState);
          }
        }
      );

     }

  async snackbar(message: string, pos: any) {
    const toast = await this.toastController.create({
      position: pos,
      message: message,
      duration: 2000,
      buttons:[
         {
          icon: 'close-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
      
    });
    toast.present();
  }
  
  init() {
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
    this.partnerEl = this.elRef.nativeElement.querySelector('#partner-video');
    this.webRTCservice.init(this.userId, this.myEl, this.partnerEl);
  }

  call() {
    this.webRTCservice.call(this.partnerId.toLocaleUpperCase());
    this.swapVideo('my-video');
  }
  
  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }
  
  ngOnInit() {}
  
  initUserId() {
    let userId = localStorage.getItem('USER_ID');
    
    if (userId) {
      this.userId = userId;
    } else {
      // generate new userId
      this.userId = shortid.generate();
      localStorage.setItem('USER_ID', this.userId);
    }
  }

  copyText(text: string) {
    Clipboard.write({
      string: text
    });

    this.snackbar('copy to clipboard', 'bottom');
  }

  /* Stream Controls */
  endCall() {
    this.webRTCservice.endCall();
  }

  sharingCam() {
    this.webRTCservice.sharingCam();
    this.HIDE_CAMERA = (this.HIDE_CAMERA == 'success')?'medium':'success';

  }

  sharingAudio() {
    this.webRTCservice.sharingAudio();
    this.MUTE_AUDIO = (this.MUTE_AUDIO == 'success')?'medium':'success';
  } 

  /* stepper status */
  async changeIsJoinRoom(status: boolean) {
    this.isJoinRoom.next(status);
    await this.timeout(10);
    this.init();
  }
  async changeIsCreateRoom(status: boolean) {
    this.isCreateRoom.next(status);
    await this.timeout(10);
    this.init()
  }

  timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
