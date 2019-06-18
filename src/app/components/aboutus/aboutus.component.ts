import { Component, OnInit } from '@angular/core';
import { MainService } from "src/app/services/main.service";
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  page_info: any;
  bankDetails: object;
  aboutUsPdf:string = "http://www.cheapfly.pk/doc/profile-book-version-02April.pdf";
  constructor(private __ms: MainService, private __router: Router, private __meta: Meta, private __title: Title) { }

  ngOnInit() {
    if (this.__router.url != '/bank-details') {
      this.getPageData();
    } else {
      this.getAllBankDetails();
    }
  }
  getPageData() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/pageDetails/?urlLink=/aboutUs').subscribe(res => {
      this.page_info = res.data;
      this.updateMetaTags(res.data);
    });
  }
  getAllBankDetails() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/allBankDetails').subscribe(res => {
      this.bankDetails = res.data;
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
