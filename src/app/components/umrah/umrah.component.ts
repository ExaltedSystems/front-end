import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from "src/app/services/main.service";
import { Meta, Title } from '@angular/platform-browser';
@Component({
	selector: 'app-umrah',
	templateUrl: './umrah.component.html',
	styleUrls: ['./umrah.component.css']
})
export class UmrahComponent implements OnInit {
	page_info: any;
	constructor(private _ms: MainService, private router: Router, private __meta: Meta, private __title: Title) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		}
	}
	ngOnInit() {
		this.getPageData();
	}
	getPageData() {
		console.log(this.router.url);
		this._ms.getData(this._ms.backEndUrl + 'Cms/pageDetails/?urlLink=' + this.router.url).subscribe(res => {
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
