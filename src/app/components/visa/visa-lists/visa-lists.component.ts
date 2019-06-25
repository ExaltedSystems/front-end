import { Component, OnInit } from '@angular/core';
import { MainService } from './../../../services/main.service';
import { Meta, Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-visa-lists',
	templateUrl: './visa-lists.component.html',
	styleUrls: ['./visa-lists.component.css']
})
export class VisaListsComponent implements OnInit {
	allVisas: any;
	baseUrl: string;
	popularVisa: any;
	visaName: string;
	searchVisaByNameForm: FormGroup;
	constructor(private __ms: MainService, private __meta: Meta, private __title: Title,
		private __device: DeviceDetectorService, private __fb: FormBuilder) {
			window.scroll(0, 300);
		this.baseUrl = this.__ms.baseUrl;
		if (this.__device.isDesktop()) {
			window.scrollTo(0, 400);
		}
	}

	ngOnInit() {
		this.searchVisaByNameForm = this.__fb.group({
			visaName: ["", Validators.required]
		})
		this.getAllVisaRecords();
		this.popularVisas();
	}
	getAllVisaRecords() {
		this.__ms.getData(this.__ms.backEndUrl + 'Cms/allVisaRecords/').subscribe(res => {
			if (res.data) {
				this.updateMetaTags(res.message);
			}
			this.allVisas = res.data;
		});
	}
	popularVisas() {
		this.__ms.getData(this.__ms.backEndUrl + 'Cms/popularVisaRecords/').subscribe(res => {
			this.popularVisa = res.data;
		});
	}
	searchVisaByName(inputs) {
		if (this.searchVisaByNameForm.valid) {
			this.visaName = inputs.visaName;
		// 	console.log(inputs)
		// 	this.allVisas = this.allVisas.filter(it => {
		// 		return it.toLowerCase().includes(inputs.visaName);
		// 	});
		}
		// this.allVisas = this.allVisas
	}
	updateMetaTags(result) {
		this.__title.setTitle(result.metaTitle);
		this.__meta.updateTag({ name: 'description', content: result.metaDescription });
		this.__meta.updateTag({ property: "og:title", content: result.metaTitle });
		this.__meta.updateTag({ property: "og:description", content: result.metaDescription });
		this.__meta.updateTag({ property: "og:url", content: window.location.href });
	}

}
