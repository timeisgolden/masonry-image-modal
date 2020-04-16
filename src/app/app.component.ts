import { Component, OnInit } from '@angular/core';
import { IpDetectService } from './shared/services/ip-detect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angularfirebase-authentication';
  ipAddress: string;
  constructor(private ip: IpDetectService) {
    this.getIP();
  }

  ngOnInit() {
  }
  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      localStorage.setItem('fp_myip', this.ipAddress);
    });
  }
}
