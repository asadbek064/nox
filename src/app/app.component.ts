import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StatusService } from './services/status.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private statusService: StatusService,
  ) {
    this.initializeApp();

    /* connected make it full screen no overflow */
    this.statusService.connected_Change.subscribe(
      newState => {
        if (newState) {
          document.querySelector('main-content').classList.add('full-height');
        } else {
          document.querySelector('main-content').classList.remove('full-height');
        }
      }
    )
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {}
}
