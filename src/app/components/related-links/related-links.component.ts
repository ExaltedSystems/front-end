import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-related-links',
  templateUrl: './related-links.component.html',
  styleUrls: ['./related-links.component.css']
})
export class RelatedLinksComponent implements OnInit {
  relatedLinks: object;
  isMobile: boolean = false;
  constructor(private __ms: MainService, private __router: Router, private __actRoute: ActivatedRoute) {
    if(window.matchMedia('(max-width:768px').matches) {
      this.isMobile = true;
    }
  }

  ngOnInit() {
    console.log('Link:', [this.__actRoute.snapshot.url[0].path, this.__actRoute])
    this.getRelatedLinks();
  }
  getRelatedLinks() {
    let url = this.__actRoute.snapshot.url[0].path;
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/relatedLinks/?url=' + url).subscribe(res => {
      console.log(res)
      if(res.status) {        
        this.relatedLinks = res.data;
      }
    });
  }

}
