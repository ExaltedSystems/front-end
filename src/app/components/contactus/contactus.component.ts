import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MainService } from  "src/app/services/main.service";


@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
	page_info:any;
	contactForm = new FormGroup({
		name   : new FormControl(''),
		email  : new FormControl('',[Validators.email]),
		phone  : new FormControl(''),
		message:new FormControl('')
  });
  constructor(private _ms:MainService) { }

  ngOnInit() {
  	this.getPageData();
  }
  getPageData(){
  	this._ms.getData(this._ms.backEndUrl+'Cms/pageDetails/?urlLink=/contactUs').subscribe(res => {
	    this.page_info = res.data;
	    // console.log(this.page_info.data);
    });
  }
  onSubmit() {
  // TODO: Use EventEmitter with form value
  console.warn(this.contactForm.value);
}
}
