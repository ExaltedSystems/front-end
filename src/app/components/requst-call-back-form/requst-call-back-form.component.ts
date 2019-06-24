import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { MainService } from '../../services/main.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-requst-call-back-form',
  templateUrl: './requst-call-back-form.component.html',
  styleUrls: ['./requst-call-back-form.component.css']
})

export class RequstCallBackFormComponent implements OnInit {
  page_info: any;
  contactForm: FormGroup;
  deviceFullInfo = null;
  browser = null;
  operatingSys = null;
  isLoad:boolean = false;

  constructor(private __ms: MainService, private __fb: FormBuilder, private __dd: DeviceDetectorService,
    private __router: Router, private __actRoute: ActivatedRoute, private __ngZone: NgZone) {
    this.deviceFullInfo = this.__dd.getDeviceInfo();
    this.browser = this.__dd.browser;
    this.operatingSys = this.__dd.os;
  }
@ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  ngOnInit() {
    this.contactForm = this.__fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(19), Validators.pattern('^(?=.*[0-9])[ +0-9]+$')]],
      emailMessage: ["", Validators.required],
    });
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.__ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  onSubmit(inputs) {
    if (this.contactForm.valid) {
      this.isLoad = true;
      let emailSubject: string;
      let urlStr = this.__actRoute.snapshot.url;
      if (urlStr.length > 1) {
        emailSubject = urlStr[urlStr.length - 1].path
      }
      Object.assign(inputs, {
        ipAddress: this.__ms.ipAddress,
        browser: this.browser,
        emailSubject: "Query from " + emailSubject,
        operatingSys: this.operatingSys,
        deviceFullInfo: this.deviceFullInfo,
        pageUrl: this.__router.url,
        country: "PK",
        referrerUrl: this.__router.url,
        inquiryType: 9 // For Contact-Us and About-Us
      });
      this.__ms.postData(this.__ms.backEndUrl + 'cms/inquiryCallBack', inputs).subscribe(result => {
        if (result.status) {
          this.isLoad = false;
          this.__router.navigate(['/thank-you']);
        }
      });
    }
  }

}
