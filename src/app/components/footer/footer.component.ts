import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  footerLinks: object;
  branches: object;
  isMobile: boolean;
  constructor(private __ms: MainService, private __device: DeviceDetectorService) { }

  ngOnInit() {
    this.isMobile = this.__device.isMobile();
    this.getFooterLinks();
    this.getAllBranches();
  }
  getFooterLinks() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/navbarFooterLinks').subscribe(res => {
      this.footerLinks = res.data;
    });
  }
  getAllBranches() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/allBranches').subscribe(res => {
      this.branches = res.data;
    });
  }

}
