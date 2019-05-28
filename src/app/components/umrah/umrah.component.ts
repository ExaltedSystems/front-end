import { Component, OnInit } from '@angular/core';
 import {Router} from '@angular/router';
import { MainService } from  "src/app/services/main.service";
@Component({
  selector: 'app-umrah',
  templateUrl: './umrah.component.html',
  styleUrls: ['./umrah.component.css']
})
export class UmrahComponent implements OnInit {
		page_info:any;
	  constructor(private _ms:MainService,private router: Router) {
  		this.router.routeReuseStrategy.shouldReuseRoute = function(){
      	return false;
				} 
	  }
	  ngOnInit() {
	  	this.getPageData();
	  }
	  getPageData(){
	  	console.log(this.router.url);
	  	this._ms.getData(this._ms.backEndUrl+'Cms/pageDetails/?urlLink='+this.router.url).subscribe(res => {
	    this.page_info = res.data;
	    // console.log(this.page_info.data);
	    });
	  }
}
