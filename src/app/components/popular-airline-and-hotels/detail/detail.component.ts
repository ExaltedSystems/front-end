import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from "src/app/services/main.service";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  page_info: any;
  baseUrl: any;
  popularVisa: object;
  pageType: string;
  constructor(private __ms: MainService, private __router: Router, private __actRoute: ActivatedRoute, private __meta: Meta, private __title: Title) {
    this.__router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }
  ngOnInit() {
    window.scroll(0, 0);
    this.getPageData();
    this.popularVisas();
    this.pageType = this.__actRoute.snapshot.url[0].path;
  }
  getPageData() {
    this.baseUrl = this.__ms.baseUrl;
    let param = this.__router.url;
    param = param.substring(1);
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/viewAirlineHotelContents/?urlLink=' + param).subscribe(res => {
      this.page_info = res.data;
      this.updateMetaTags(res.data);
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
