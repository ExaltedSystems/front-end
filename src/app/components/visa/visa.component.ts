import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MainService } from  "src/app/services/main.service";
@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html',
  styleUrls: ['./visa.component.css']
})
export class VisaComponent implements OnInit {
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
			let param = this.router.url;
			param     = param.substring(1);
	  	this._ms.getData(this._ms.backEndUrl+'Cms/viewVisaDetailsByUrl/?visaUrl='+param).subscribe(res => {
	    this.page_info = res.data;
	    // console.log(this.page_info.data);
	    });
	  }

}
