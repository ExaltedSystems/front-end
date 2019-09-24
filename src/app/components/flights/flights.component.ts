import { Component, OnInit, Input } from '@angular/core';
import { MainService } from "src/app/services/main.service";
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  @Input()
  page_info: any = { name: '', description: '' };
  sideForm:boolean = false;
  baseUrl: string = '';
  constructor(private __ms: MainService, private __router: Router, private __meta: Meta, private __title: Title, private __device: DeviceDetectorService) {
    // window.scroll(0, 300);
    this.baseUrl = this.__ms.baseUrl;
    if(this.__device.isMobile()){
      this.sideForm = true;
    }
  }

  ngOnInit() {
    this.getPageData();
  }
  getPageData() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/pageDetails/?urlLink=/flights').subscribe(res => {
      this.page_info = res.data;
      this.updateMetaTags(res.data);
    });
  }
  updateMetaTags(result) {
    this.__title.setTitle(result.metaTitle);
    this.__meta.updateTag({ name: 'description', content: result.metaDescription });
    this.__meta.updateTag({ property: "og:title", content: result.metaTitle });
    this.__meta.updateTag({ property: "og:description", content: result.metaDescription });
    this.__meta.updateTag({ property: "og:url", content: window.location.href });
  }
}