import { Component, OnInit } from '@angular/core';
import { MainService } from  "src/app/services/main.service";
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
	page_info:any;
  constructor(private _ms:MainService) { }

  ngOnInit() {
  	this.getPageData();
  }
  getPageData(){
  	this._ms.getData(this._ms.backEndUrl+'Cms/pageDetails/?urlLink=/aboutUs').subscribe(res => {
    this.page_info = res.data;
    console.log(this.page_info.data);
    });
  }
}
