import { Component, OnInit } from '@angular/core';
import { MainService } from  "src/app/services/main.service";

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  page_info:any = {name:'', description:''};
  baseUrl: string = '';

  constructor(private __ms:MainService) {
    this.baseUrl = this.__ms.baseUrl;
  }

  ngOnInit() {
    this.getPageData();
  }
  getPageData(){
    this.__ms.getData(this.__ms.backEndUrl+'Cms/pageDetails/?urlLink=/hotels').subscribe(res => {
    this.page_info = res.data;
    });
  }

}