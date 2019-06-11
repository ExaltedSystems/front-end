import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router, RouterState, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-requst-call-back-form',
  templateUrl: './requst-call-back-form.component.html',
  styleUrls: ['./requst-call-back-form.component.css']
})
export class RequstCallBackFormComponent implements OnInit {
	page_info:any;
    contactForm: FormGroup;
    deviceFullInfo = null;
    browser = null;
    operatingSys = null;

  constructor(private __ms:MainService, private __fb: FormBuilder, private __dd: DeviceDetectorService, 
    private __router: Router, private __actRoute: ActivatedRoute) {
      this.deviceFullInfo = this.__dd.getDeviceInfo();
      this.browser = this.__dd.browser;
      this.operatingSys = this.__dd.os;
    }

  ngOnInit() {
    console.log(this.__actRoute.snapshot.url);
    console.log(this.__actRoute.snapshot.url[this.__actRoute.snapshot.url.length - 1].path);
    this.contactForm = this.__fb.group({
        name: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        phone: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(19), Validators.pattern('^(?=.*[0-9])[ +0-9]+$')]],
        emailMessage: ["", Validators.required],
    });
  }
  onSubmit(inputs) {
      let emailSubject:string;
      let urlStr = this.__actRoute.snapshot.url;
      if(urlStr.length > 1){
        emailSubject = urlStr[urlStr.length - 1].path
      }
      Object.assign(inputs, {
          ipAddress:this.__ms.ipAddress,
          browser: this.browser,
          emailSubject: "Query from "+emailSubject,
          operatingSys: this.operatingSys,
          deviceFullInfo: this.deviceFullInfo,
          pageUrl: this.__router.url,
          country:"PK",
          referrerUrl: this.__router.url,
          inquiryType: 9 // For Contact-Us and About-Us
      });
      this.__ms.postData('http://192.168.101.215/rgtapp/index.php/services/cms/inquiryCallBack', inputs).subscribe(result => {
          if(result.status) {
              this.__router.navigate(['/thank-you']);
          }
      });
      console.log(this.contactForm.value);
  }

}
