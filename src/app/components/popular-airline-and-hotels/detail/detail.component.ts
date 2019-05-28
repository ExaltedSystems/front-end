import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MainService } from  "src/app/services/main.service";
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
	page_info:any;
	baseUrl : any;
  constructor(private _ms:MainService,private router: Router) {
		this.router.routeReuseStrategy.shouldReuseRoute = function(){
    	return false;
		}
  }
  ngOnInit() {
  	this.getPageData();
  }
 getPageData(){
 	this.baseUrl = this._ms.baseUrl;
	let param = this.router.url;
	param     = param.substring(1);
	this._ms.getData(this._ms.backEndUrl+'Cms/viewAirlineHotelContents/?urlLink='+param).subscribe(res => {
  this.page_info = res.data;
  // console.log(this.page_info.data);
  });
}

}
