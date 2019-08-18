import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from "src/app/services/main.service";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { isObject } from 'util';


@Component({
    selector: 'app-contactus',
    templateUrl: './contactus.component.html',
    styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
    page_info: any;
    contactForm: FormGroup;
    deviceFullInfo = null;
    browser = null;
    operatingSys = null;
    disableSubmitBtn: boolean = false;
    isLoad: boolean = false;
    errors;

    constructor(private __ms: MainService, private __fb: FormBuilder, private __dd: DeviceDetectorService,
        private __router: Router, private __meta: Meta, private __title: Title) {
        this.deviceFullInfo = this.__dd.getDeviceInfo();
        this.browser = this.__dd.browser;
        this.operatingSys = this.__dd.os;
        window.scroll(0, 300);
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
    getPageData() {
        this.__ms.getData(this.__ms.backEndUrl + 'Cms/pageDetails/?urlLink=/contactUs').subscribe(res => {
            this.page_info = res.data;
            this.updateMetaTags(res.data);
        });
    }
    onSubmit(inputs) {
        this.isLoad = true;
        if (this.contactForm.valid) {
            this.disableSubmitBtn = true;
            Object.assign(inputs, {
                ipAddress: this.__ms.ipAddress,
                browser: this.browser,
                emailSubject: "Query from Contact-Us",
                operatingSys: this.operatingSys,
                deviceFullInfo: this.deviceFullInfo,
                pageUrl: this.__router.url,
                country: "PK",
                referrerUrl: this.__router.url,
                inquiryType: 9 // For Contact-Us and About-Us
            });
            this.__ms.postData(this.__ms.backEndUrl + 'cms/inquiryCallBack', inputs).subscribe(result => {
                console.log('post:', result);
                if (result.status) {
                    this.disableSubmitBtn = false;
                    this.__router.navigate(['/thank-you']);
                } else {
                    this.disableSubmitBtn = false;
                    if (isObject(result.data)) {
                        for (let i in result.data) {
                            this.contactForm.controls[i].setErrors({ 'incorrect': true });
                            this.errors = result.data;
                        }
                        this.isLoad = false;
                    }
                }
            });
        }
    }
    updateMetaTags(result) {
        this.__title.setTitle(result.metaTitle);
        this.__meta.updateTag({ name: 'description', content: result.metaDescription });
        this.__meta.updateTag({ property: "og:title", content: result.metaTitle });
        this.__meta.updateTag({ property: "og:description", content: result.metaDescription });
        this.__meta.updateTag({ property: "og:url", content: window.location.href });
    }
}
