import { Injectable } from '@angular/core';
import { StatusService } from './status.service'; 
import Peer from 'peerjs';
import { stringify } from '@angular/compiler/src/util';
import { regularConstraints, lowMobileConstraints, regularMobileConstraints, networkSpeedTest, deviceWidth } from './constraints';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {
  peer: Peer;
  myStream: MediaStream;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;

  stun = 'stun.l.google.com:19302';
  mediaConnection: Peer.MediaConnection;
  options: Peer.PeerJSOption;
  stunServer: RTCIceServer = {
    urls: 'stun:' + this.stun,
  };
  

  constructor(private statusService: StatusService) {
    this.options = {  // not used, by default it'll use peerjs server
      key: 'cd1ft79ro8g833di',
      debug: 3
    };
  }

  getMedia() {
    /* Test Connection */
    let speed =  networkSpeedTest();
    let width = deviceWidth();

    console.log(width, 'device width');
    /*  MOBILE */
    if (speed < 2 /* mbps */ && width < 600 /*px*/) { // if speed is less than 5mbps use low resolution constraints 
      navigator.mediaDevices.getUserMedia(lowMobileConstraints)
        .then( (stream) => {
          this.handleSuccess(stream);
        },
          (error: any) => {
            this.handleError(error);
        });
    } else if (width < 600) {
      navigator.mediaDevices.getUserMedia(regularMobileConstraints)
        .then( (stream) => {
          this.handleSuccess(stream);
        },
          (error: any) => {
            this.handleError(error);
          });
        } 
        /*  REGULAR */
      else if ( speed < 2 && width > 600) {
        navigator.mediaDevices.getUserMedia(regularConstraints)
          .then( (stream) => {
            this.handleSuccess(stream);
          },
            (error: any) => {
              this.handleError(error);
          });
    } else if ( width > 600) {
        navigator.mediaDevices.getUserMedia(regularConstraints)
        .then( (stream) => {
          this.handleSuccess(stream);
        },
          (error: any) => {
            this.handleError(error);
        });
    }
    
    
  
  }

  async init(userId: string, myEl: HTMLMediaElement, partnerEl: HTMLMediaElement) {
    this.myEl = myEl;
    this.partnerEl = partnerEl;
    try {
      this.getMedia();
    } catch (e) {
      this.handleError(e);
    }
    await this.createPeer(userId);
  }

  async createPeer(userId: string) {
    this.peer = new Peer(userId);
    this.peer.on('open', () => {
      this.wait();
    });
  }

  call(partnerId: string) {
    const call = this.peer.call(partnerId, this.myStream);
    call.on('stream', (stream) => {
      this.partnerEl.srcObject = stream;
      this.statusService.connected_Change.next(true);
    });
  }

  wait() {
    this.peer.on('call', (call) => {
      call.answer(this.myStream);
      call.on('stream', (stream) => {
        this.partnerEl.srcObject = stream;
      });
    });
  }


  /* Stream Controls */
  endCall() {
    /* end stream */
    this.peer.disconnect();
    this.statusService.connected_Change.next(false);
    this.statusService.callEnd_Change.next(true);
    localStorage.setItem('sessionReload', stringify(false));
    
  }

  sharingCam() {
    this.myStream.getVideoTracks()[0].enabled = !this.myStream.getVideoTracks()[0].enabled;
  }

  sharingAudio() {
    this.myStream.getAudioTracks()[0].enabled = !this.myStream.getAudioTracks()[0].enabled;
  }


  handleSuccess(stream: MediaStream) {
    /* echo cancellation on */
    this.statusService.camStream_Change.next(true);
    this.myStream = stream;
    this.myEl.srcObject = stream;

  }



  handleError(error: any) {
    if (error.name === 'PermissionDeniedError') {
     this.errorMsg('Permissions have not been granted to use your camera and ' +
       'microphone, you need to allow the page access to your devices in ' +
       'order for the demo to work.');
   }
   this.errorMsg(`getUserMedia error: ${error.name}`, error);
 } 
 
 errorMsg(msg: string, error?: any) {
   const errorElement = document.querySelector('#errorMsg');
   errorElement.innerHTML += `<p>${msg}+ Please use Safari on IOS device</p>`;
   if (typeof error !== 'undefined') {
     console.error(error);
   }
 }
}
