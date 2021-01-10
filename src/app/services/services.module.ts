import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebRTCService } from './webrtc.service';
import { StatusService } from './status.service';

const SERVICES = [
    WebRTCService,
    StatusService,
]

@NgModule({
    declarations: [],
    imports: [ CommonModule ],
    exports: [],
    providers: [...SERVICES],
})
export class ServicesModule {}