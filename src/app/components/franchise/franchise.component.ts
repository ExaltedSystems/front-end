import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from "src/app/services/main.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { isObject } from 'util';

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
  errorStr: string = '';
  errorObj: any = '';
  constructor(private __ms: MainService, private __fb: FormBuilder, private __dd: DeviceDetectorService,
  private __router: Router, private __meta: Meta, private __title: Title) {

  }

  ngOnInit() {
    this.getPageData();
    this.franchiseForm = this.__fb.group({
      name: ["", [Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      email: ["", [Validators.required, Validators.email, Validators.pattern(this.__ms.emailPattern)]],
      mobile_no: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(19), Validators.pattern('^(?=.*[0-9])[ +0-9]+$')]],
      investment: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(9), Validators.pattern('^(?=.*[0-9])[ +0-9]+$')]],
      tel_no: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(19), Validators.pattern('^(?=.*[0-9])[ +0-9]+$')]],
      city: [""],
      address: [""],
      education: [""],
      cnic : ["", [Validators.required, Validators.minLength(13), Validators.maxLength(15), Validators.pattern('^(?=.*[0-9])[ +0-9]+$')]],
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
    this.__ms.postData(this.__ms.backEndUrl + 'Cms/franchiseReg', inputs).subscribe(res=>{
      if (res.status) {
        this.__router.navigate(['/thank-you']);
      } else {
        this.errorStr = res.message;
        if (isObject(res.data)) {
          for (let i in res.data) {
            this.franchiseForm.controls[i].setErrors({ 'incorrect': true });
            this.errorObj = res.data;
          }
        }
        return false;
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
