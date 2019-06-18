import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from "src/app/services/main.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Meta, Title } from '@angular/platform-browser';
@Component({
	selector: 'app-visa',
	templateUrl: './visa.component.html',
	styleUrls: ['./visa.component.css']
})
export class VisaComponent implements OnInit {
	page_info: any;	
	popularVisa: object;
	constructor(private __ms: MainService, private router: Router, private __meta: Meta, private __title: Title
		, private __device: DeviceDetectorService) {
		if(this.__device.isDesktop()){
		  window.scrollTo(0, 400);
		}
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		}
	}
	ngOnInit() {
		this.getPageData();
		this.popularVisas();
	}
	getPageData() {
		let param = this.router.url;
		param = param.substring(1);
		this.__ms.getData(this.__ms.backEndUrl + 'Cms/viewVisaDetailsByUrl/?visaUrl=' + param).subscribe(res => {
			this.page_info = res.data;
			this.updateMetaTags(res.data[0]);
		});
	}
	popularVisas() {
		this.__ms.getData(this.__ms.backEndUrl + 'Cms/popularVisaRecords/').subscribe(res => {
			this.popularVisa = res.data;
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
