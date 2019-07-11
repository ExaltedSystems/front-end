import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material';
import { MainService} from 'src/app/services/main.service';

declare var  jQuery

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  isLinear = false;
  personalInfoForm: FormGroup;
  familyInfoForm: FormGroup;
  educationForm: FormGroup;
  courseForm: FormGroup;
  workForm: FormGroup;
  refrenceForm: FormGroup;
  guaranterForm: FormGroup;
  intTravelForm: FormGroup;
  languageForm: FormGroup;
  Preview:FormGroup;

  // educationInfoRows: FormArray;
 intTravelList: FormArray;
 educationList: FormArray;
 languageList: FormArray;
 refrenceList: FormArray;
 guaranterList: FormArray;
 workList: FormArray;
 // Id's for Editing Form
 personalInfoId = '';
 familyInfoId = '';
 educationInfoId = '';
 languageId = '';
 courseId = '';
 workExpId = '';
 referenceId = '';
 guranterId = '';
 intlTravelId = '';
//  Get Data For CV Details
personalInfoDetails:object;

  constructor(private _fb: FormBuilder, private __ms: MainService) { }

  // returns all form groups
  get intTravelFormGroup() {
    return this.intTravelForm.get('intTravels') as FormArray;
  }
  get educationFormGroup() {
    return this.educationForm.get('educations') as FormArray;
  }
  get languageFormGroup() {
    return this.educationForm.get('languages') as FormArray;
  }
  get refrenceFormGroup() {
    return this.refrenceForm.get('refrences') as FormArray;
  }
  get guaranterFormGroup() {
    return this.guaranterForm.get('guaranters') as FormArray;
  }
  get workFormGroup() {
    return this.workForm.get('works') as FormArray;
  }

  ngOnInit() {
  	this.personalInfoForm = this._fb.group({
      ID:[this.personalInfoId],
      applicationId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      DOB: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      cellNum: ['', Validators.required],
      phoneNum: [''],
      conveyance: [''],
      nationality: ['', Validators.required],
      CNIC: ['', Validators.required],
      passportNum: [''],
      drivingLicence: [''],
      presentAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      aboutInfo: ['', Validators.required],
      facebook: [''],
      twitter: [''],
      linkedIn: ['']
    });
    this.familyInfoForm = this._fb.group({
      ID:[this.familyInfoId],
      personalInfoId:[this.personalInfoId],
      relation: ['', Validators.required],
      name: ['', Validators.required],
      phoneNum: ['', Validators.required],
      cellNum: ['', Validators.required],
      email: ['', Validators.required],
      occupation: ['', Validators.required],
      jobLocation: ['', Validators.required],
      orgName: ['', Validators.required],
      designation: ['', Validators.required]
    });
    this.educationForm = this._fb.group({
      personalInfoId:[this.personalInfoId],
      educations: this._fb.array([this.createEducation()]),
      languages: this._fb.array([this.createLanguage()])
    });
    this.languageForm = this._fb.group({
      personalInfoId:[this.personalInfoId],
    });
    this.courseForm = this._fb.group({
      ID:[''],
      personalInfoId:[this.personalInfoId],
      title: ['', Validators.required],
      institute: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      duration: ['', Validators.required],
      year: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.workForm = this._fb.group({
      personalInfoId:[this.personalInfoId],
      works: this._fb.array([this.createWorkExperience()])
    });
    this.refrenceForm = this._fb.group({
      personalInfoId:[this.personalInfoId],
      refrences: this._fb.array([this.createRefrence()])
    });
    this.guaranterForm = this._fb.group({
      personalInfoId:[this.personalInfoId],
      guaranters: this._fb.array([this.createGuaranter()])
    });
    this.intTravelForm = this._fb.group({
      personalInfoId:[this.personalInfoId],
      intTravels: this._fb.array([this.createintTravel()])
    });

        // set contactlist to this field
    this.intTravelList = this.intTravelForm.get('intTravels') as FormArray;
    this.educationList = this.educationForm.get('educations') as FormArray;
    this.languageList = this.languageForm.get('languages') as FormArray;
    this.refrenceList = this.refrenceForm.get('refrences') as FormArray;
    this.guaranterList = this.guaranterForm.get('guaranters') as FormArray;
    this.workList = this.workForm.get('works') as FormArray;
  }

// // contact formgroup
  createintTravel(): FormGroup {
    return this._fb.group({
      ID:[''],
      country: ['', Validators.required],
      travelDate: ['' , Validators.required],
      durationStay: ['' , Validators.required]
    });
  }
  createEducation(): FormGroup {
    return this._fb.group({
      ID:[''],
      qualification: ['', Validators.required],
      majorSubject: ['' , Validators.required],
      boardUniversity: ['' , Validators.required],
      startDate: ['', Validators.required],
      passingDate: ['' , Validators.required],
      GPA: ['' , Validators.required]
    });
  }
  createLanguage(): FormGroup {
    return this._fb.group({
      ID:[''],
      language: ['', Validators.required],
      speaking: ['' , Validators.required],
      writting: ['' , Validators.required],
      reading: ['', Validators.required],
      listening: ['' , Validators.required]
    });
  }
  createRefrence(): FormGroup {
    return this._fb.group({
      ID:[''],
      name: ['', Validators.required],
      relation: ['' , Validators.required],
      CNIC: ['' , Validators.required],
      cellNum: ['', Validators.required],
      phoneNum: ['' , Validators.required],
      email: ['' , Validators.required],
      presentAddress: ['' , Validators.required],
      permanentAddress: ['' , Validators.required]
    });
  }
  createGuaranter(): FormGroup {
    return this._fb.group({
      ID:[''],
      name: ['', Validators.required],
      relation: ['' , Validators.required],
      CNIC: ['' , Validators.required],
      cellNum: ['', Validators.required],
      phoneNum: ['' , Validators.required],
      email: ['' , Validators.required],
      presentAddress: ['' , Validators.required],
      permanentAddress: ['' , Validators.required]
    });
  }
  createWorkExperience(): FormGroup {
    return this._fb.group({
      ID:[''],
      organization: ['', Validators.required],
      jobTitle: ['' , Validators.required],
      department: ['' , Validators.required],
      lastSalaryDrawn: ['', Validators.required],
      joiningDate: ['' , Validators.required],
      leavingDate: ['' ,],
      isCurrOrg: ['' , Validators.required],
      isContactSupervisor: [''],
      supervisorName: [''],
      supContactNum: [''],
      supEmail: [''],
      jobDescription: ['' , Validators.required],
      leavingReason: ['']
    });
  }


// add More 
  addintTravel() {
    this.intTravelList.push(this.createintTravel());
  }

  addEducation() {
    this.educationList.push(this.createEducation());
  }
  addLanguage() {
    this.languageList.push(this.createLanguage());
  }
  addRefrence() {
    this.refrenceList.push(this.createRefrence());
  }
  addGuaranter() {
    this.guaranterList.push(this.createGuaranter());
  }
  addWork() {
    this.workList.push(this.createWorkExperience());
  }

// remove IntTravel from group
  removeintTravel(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.intTravelList.removeAt(index);
  }
  removeEducation(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.educationList.removeAt(index);
  }
  removeLanguage(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.languageList.removeAt(index);
  }
  removeRefrence(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.refrenceList.removeAt(index);
  }
  removeGuaranter(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.guaranterList.removeAt(index);
  }
  removeWork(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.workList.removeAt(index);
  }

 // // method triggered when form is submitted
  showHideCurrJob(key){
    let isShow=jQuery(".curr-job-"+key).hasClass('cj-show');
    if(isShow){
      console.log("here")
        jQuery(".curr-job-"+key).addClass('cj-hide').removeClass('cj-show')
    }
    else{
      console.log("elsehere")
        jQuery(".curr-job-"+key).removeClass('cj-hide').addClass('cj-show')
    }
  }
  // Insert Data to Database Functions
  addPersonalInfo(formInputs){
    console.log('PersonalInfo:', formInputs)
    if(this.personalInfoForm.valid) {
        this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertPersonalInfo', formInputs).subscribe(result => {
            // console.log('Post:', result);
            let pID = result.data['ID'];
            this.personalInfoId = pID;
            this.personalInfoForm.controls['personalInfoId'].setValue(pID);
            this.familyInfoForm.controls['personalInfoId'].setValue(pID);
            this.educationForm.controls['personalInfoId'].setValue(pID);
            this.courseForm.controls['personalInfoId'].setValue(pID);
            this.workForm.controls['personalInfoId'].setValue(pID);
            this.refrenceForm.controls['personalInfoId'].setValue(pID);
            this.guaranterForm.controls['personalInfoId'].setValue(pID);
            this.intTravelForm.controls['personalInfoId'].setValue(pID);
            this.personalInfoDetails = result.data;
        });
    }
  }
  addFamilyInfo(formInputs){
    console.log('FamilyInfo:', formInputs)
    if(this.familyInfoForm.valid) {
        this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertFamilyInfo', formInputs).subscribe(result => {
            console.log('Post:', result);
        });
    }
  }
  addEducationInfo(formInputs){
    console.log('EducationInfo:', formInputs)
    if(this.educationForm.valid) {
        this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertEducationInfo', formInputs).subscribe(result => {
            console.log('Post:', result);
        });
    }
  }
  addCourseInfo(formInputs){
    console.log('CourseInfo:', formInputs)
    if(this.courseForm.valid) {
        this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertCourseInfo', formInputs).subscribe(result => {
            console.log('Post:', result);
        });
    }
  }
  addWorkInfo(formInputs){
    console.log('WorkInfo:', formInputs)
    if(this.workForm.valid) {
        this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertWorkInfo', formInputs).subscribe(result => {
            console.log('Post:', result);
        });
    }
  }
  addRefrenceInfo(formInputs){
    console.log('RefrencesInfo:', formInputs)
    if(this.refrenceForm.valid) {
        this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertRefrenceInfo', formInputs).subscribe(result => {
            console.log('Post:', result);
        });
    }
  }
  addGuaranterInfo(formInputs){
    console.log('GuarantersInfo:', formInputs)
    if(this.guaranterForm.valid) {
        this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertGuaranterInfo', formInputs).subscribe(result => {
            console.log('Post:', result);
        });
    }
  }
  addIntTravelInfo(formInputs){
    console.log('IntTravelInfo:', formInputs)
    if(this.intTravelForm.valid) {
        this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertIntTravelsInfo', formInputs).subscribe(result => {
            console.log('Post:', result);
        });
    }
  }       
}
