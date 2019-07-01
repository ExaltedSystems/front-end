import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from "src/app/services/main.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-franchise',
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.css']
})
export class FranchiseComponent implements OnInit {
  page_info: any;
  franchiseForm: FormGroup;
  deviceFullInfo = null;
  browser = null;
  operatingSys = null;
  constructor(private __ms: MainService, private __fb: FormBuilder, private __dd: DeviceDetectorService,
  private __router: Router, private __meta: Meta, private __title: Title) {

  }

  ngOnInit() {
    this.getPageData();
    this.franchiseForm = this.__fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      mobile_no: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(19), Validators.pattern('^(?=.*[0-9])[ +0-9]+$')]],
      investment: ["", Validators.required],
      tel_no :[""],
      city: [""],
      address: [""],
      education: [""],
      cnic : [""],
      details:[""]
    });
  }
  getPageData() {
    this.__ms.getData(this.__ms.backEndUrl + 'Cms/pageDetails/?urlLink=franchise').subscribe(res => {
      this.page_info = res.data;
      this.updateMetaTags(res.data);
    });
  }
  onSubmit(inputs){
    console.log(inputs);
    this.__ms.postData(this.__ms.backEndUrl + 'Cms/franchiseReg', inputs).subscribe(res=>{
      console.log(res.data);
      if (res.status) {
        this.__router.navigate(['/thank-you']);
      }
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
