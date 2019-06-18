import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from "src/app/services/main.service";
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  page_info: any;
  constructor(private _ms: MainService, private router: Router, private activatedRoute: ActivatedRoute,
    private __meta: Meta, private __title: Title) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

  ngOnInit() {
    this.getPageData();
  }
  getPageData() {
    // let param = this.router.url;
    let clsName = this.activatedRoute.snapshot.url[0].path;
    let ftnName = this.activatedRoute.snapshot.url[1].path;
    this._ms.getData(this._ms.backEndUrl + 'Cms/viewDealsDetailsByUrl/?clsName=' + clsName + '&ftnName=' + ftnName).subscribe(res => {
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
