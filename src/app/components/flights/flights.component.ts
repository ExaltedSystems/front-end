import { Component, OnInit } from '@angular/core';
import { MainService } from  "src/app/services/main.service";

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  	page_info:any = {name:'', description:''};
    constructor(private _ms:MainService) { }

    ngOnInit() {
    	this.getPageData();
    }
    getPageData(){
    	this._ms.getData(this._ms.backEndUrl+'Cms/pageDetails/?urlLink=/flights').subscribe(res => {
      this.page_info = res.data;
      // console.log(this.page_info.data);
      });
    }
}
