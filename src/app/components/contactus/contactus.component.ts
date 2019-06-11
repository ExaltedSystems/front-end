import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from  "src/app/services/main.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';


@Component({
    selector: 'app-contactus',
    templateUrl: './contactus.component.html',
    styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
	page_info:any;
    contactForm: FormGroup;
    deviceFullInfo = null;
    browser = null;
    operatingSys = null;

    constructor(private __ms:MainService, private __fb: FormBuilder, private __dd: DeviceDetectorService, 
        private __router: Router) {
        this.deviceFullInfo = this.__dd.getDeviceInfo();
        this.browser = this.__dd.browser;
        this.operatingSys = this.__dd.os;
        // console.log('qP:', window.location.search)
        // console.log(this.__router.url);
    }

    ngOnInit() {
  	     this.getPageData();
        this.contactForm = this.__fb.group({
            name: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            phone: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(19), Validators.pattern('^(?=.*[0-9])[ +0-9]+$')]],
            emailMessage: ["", Validators.required],
        });
    }
    getPageData(){
      	this.__ms.getData(this.__ms.backEndUrl+'Cms/pageDetails/?urlLink=/contactUs').subscribe(res => {
    	    this.page_info = res.data;
    	    // console.log(this.page_info.data);
        });
    }
    onSubmit(inputs) {
        Object.assign(inputs, {
            ipAddress:this.__ms.ipAddress,
            browser: this.browser,
            emailSubject: "Query from Contact-Us",
            operatingSys: this.operatingSys,
            deviceFullInfo: this.deviceFullInfo,
            country:"PK",
            referrerUrl: this.__router.url,
            inquiryType: 9 // For Contact-Us and About-Us
        });
        this.__ms.postData('http://192.168.101.215/rgtapp/index.php/services/cms/inquiryCallBack', inputs).subscribe(result => {
            console.log('post:', result);
            if(result.status) {
                this.__router.navigate(['/thank-you']);
            }
        });
        console.log(this.contactForm.value);
    }
}
