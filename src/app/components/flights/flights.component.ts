import { Component, OnInit } from '@angular/core';
import { MainService } from "src/app/services/main.service";
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  page_info: any = { name: '', description: '' };
  constructor(private __ms: MainService, private __router: Router, private __meta: Meta, private __title: Title) {
    window.scroll(0, 300);
  }

  ngOnInit() {
    this.getPageData();
  }
  getPageData() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/pageDetails/?urlLink=/flights').subscribe(res => {
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