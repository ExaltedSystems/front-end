import { Component, OnInit } from '@angular/core';
import { MainService } from './../../../services/main.service';

@Component({
  selector: 'app-visa-lists',
  templateUrl: './visa-lists.component.html',
  styleUrls: ['./visa-lists.component.css']
})
export class VisaListsComponent implements OnInit {
	allVisas : any;
	baseUrl: string;
  	popularVisa : any;
  	constructor(private __ms: MainService) {
	    this.baseUrl = this.__ms.baseUrl;
    }

  	ngOnInit() {
  		this.getAllVisaRecords();
  		this.popularVisas();
  	}
  	getAllVisaRecords() {
	    this.__ms.getData(this.__ms.backEndUrl+'Cms/allVisaRecords/').subscribe(res => {
	    	console.log(res)
	      	this.allVisas = res.data;
	    });
  	}
  	popularVisas(){
  		this.__ms.getData(this.__ms.backEndUrl+'Cms/popularVisaRecords/').subscribe(res => {
	      	this.popularVisa = res.data;
	    });
  	}

}
