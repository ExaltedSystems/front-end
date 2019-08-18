import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatStep, MatStepper, DateAdapter, MAT_DATE_FORMATS, MatHorizontalStepper } from '@angular/material';
import { MainService } from 'src/app/services/main.service';
import { APP_DATE_FORMATS, AppDateAdapter } from 'src/app/date.adapter';
import { isObject } from 'util';

declare var jQuery

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class JobsComponent implements OnInit {
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  isLinear = true;
  personalInfoForm: FormGroup;
  familyInfoForm: FormGroup;
  educationForm: FormGroup;
  courseForm: FormGroup;
  workForm: FormGroup;
  refrenceForm: FormGroup;
  guaranterForm: FormGroup;
  intTravelForm: FormGroup;
  languageForm: FormGroup;
  Preview: FormGroup;
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
  //  Date Picker Max Date
  newDate = new Date();
  minDate = new Date(1970, 0, 1);
  minBirthDate = new Date(this.minDate.setDate(this.minDate.getDate() + 1));
  maxBirthDate = new Date(this.newDate.setDate(this.newDate.getDate() - (8 * 365)));

  // Get Data For CV Details
  personalInfoDetails: object;
  faimlyInfoDetails: object;
  educationInfoDetails: object;
  coursesInfoDetails: object;
  workExpInfoDetails: object;
  referencesInfoDetails: object;
  guaranterInfoDetails: object;
  intTravelInfoDetails: object;
  // Success / Error Message
  pInfoErrors: any;
  fInfoErrors: any;
  eInfoErrors: any;
  succErrMsg: string = '';

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
    if (localStorage.getItem("jobId") !== null) {
      this.personalInfoId = localStorage.getItem("jobId");
      this.getApplicantInformations();
    }
    console.log('pID:', this.personalInfoId)

    this.personalInfoForm = this._fb.group({
      ID: [this.personalInfoId],
      applicationId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      title: ['Mr', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      DOB: ['', Validators.required],
      gender: ['Male', Validators.required],
      maritalStatus: ['Single', Validators.required],
      cellNum: ['', Validators.required],
      phoneNum: [''],
      conveyance: ['None'],
      nationality: ['Pakistan', Validators.required],
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
      ID: [this.familyInfoId],
      personalInfoId: [this.personalInfoId],
      relation: ['Father', Validators.required],
      name: ['', Validators.required],
      phoneNum: [''],
      cellNum: ['', Validators.required],
      email: ['', Validators.required],
      occupation: ['', Validators.required],
      jobLocation: ['', Validators.required],
      orgName: ['', Validators.required],
      designation: ['', Validators.required]
    });
    this.educationForm = this._fb.group({
      personalInfoId: [this.personalInfoId],
      educations: this._fb.array([this.createEducation()]),
      languages: this._fb.array([this.createLanguage()])
    });
    this.languageForm = this._fb.group({
      personalInfoId: [this.personalInfoId],
    });
    this.courseForm = this._fb.group({
      ID: [''],
      personalInfoId: [this.personalInfoId],
      title: ['', Validators.required],
      institute: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      duration: ['', Validators.required],
      year: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.workForm = this._fb.group({
      personalInfoId: [this.personalInfoId],
      works: this._fb.array([this.createWorkExperience()]),
      expectedSalary: ['', Validators.required],
      joinAfter: ['', Validators.required]
    });
    this.refrenceForm = this._fb.group({
      personalInfoId: [this.personalInfoId],
      refrences: this._fb.array([this.createRefrence()])
    });
    this.guaranterForm = this._fb.group({
      personalInfoId: [this.personalInfoId],
      guaranters: this._fb.array([this.createGuaranter()])
    });
    this.intTravelForm = this._fb.group({
      personalInfoId: [this.personalInfoId],
      intTravels: this._fb.array([this.createintTravel()])
    });

    // set contactlist to this field
    this.intTravelList = this.intTravelForm.get('intTravels') as FormArray;
    this.educationList = this.educationForm.get('educations') as FormArray;
    this.languageList = this.educationForm.get('languages') as FormArray;
    this.refrenceList = this.refrenceForm.get('refrences') as FormArray;
    this.guaranterList = this.guaranterForm.get('guaranters') as FormArray;
    this.workList = this.workForm.get('works') as FormArray;
  }

  // // contact formgroup
  createintTravel(): FormGroup {
    return this._fb.group({
      ID: [''],
      country: ['', Validators.required],
      travelDate: ['', Validators.required],
      durationStay: ['', Validators.required]
    });
  }
  createEducation(): FormGroup {
    return this._fb.group({
      ID: [''],
      qualification: ['', Validators.required],
      majorSubject: ['', Validators.required],
      boardUniversity: ['', Validators.required],
      startDate: ['', Validators.required],
      passingDate: ['', Validators.required],
      GPA: ['', Validators.required]
    });
  }
  createLanguage(): FormGroup {
    return this._fb.group({
      ID: [''],
      language: ['', Validators.required],
      speaking: ['', Validators.required],
      writting: ['', Validators.required],
      reading: ['', Validators.required],
      listening: ['', Validators.required]
    });
  }
  createRefrence(): FormGroup {
    return this._fb.group({
      ID: [''],
      name: ['', Validators.required],
      relation: ['', Validators.required],
      CNIC: ['', Validators.required],
      cellNum: ['', Validators.required],
      phoneNum: ['', Validators.required],
      email: ['', Validators.required],
      presentAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required]
    });
  }
  createGuaranter(): FormGroup {
    return this._fb.group({
      ID: [''],
      name: ['', Validators.required],
      relation: ['', Validators.required],
      CNIC: ['', Validators.required],
      cellNum: ['', Validators.required],
      phoneNum: ['', Validators.required],
      email: ['', Validators.required],
      presentAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required]
    });
  }
  createWorkExperience(): FormGroup {
    return this._fb.group({
      ID: [''],
      organization: ['', Validators.required],
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
      lastSalaryDrawn: ['', Validators.required],
      joiningDate: ['', Validators.required],
      leavingDate: ['',],
      isCurrOrg: ['', Validators.required],
      isContactSupervisor: [''],
      supervisorName: [''],
      supContactNum: [''],
      supEmail: [''],
      jobDescription: ['', Validators.required],
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
  showHideCurrJob(key) {
    let isShow = jQuery(".curr-job-" + key).hasClass('cj-show');
    if (isShow) {
      console.log("here")
      jQuery(".curr-job-" + key).addClass('cj-hide').removeClass('cj-show')
    }
    else {
      console.log("elsehere")
      jQuery(".curr-job-" + key).removeClass('cj-hide').addClass('cj-show')
    }
  }
  // Insert Data to Database Functions
  addPersonalInfo(formInputs) {
    if (this.personalInfoForm.valid) {
      this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertPersonalInfo', formInputs).subscribe(result => {
        // console.log('Post:', result);
        if (result.status) {
          let pID = result.data['ID'];
          localStorage.setItem('jobId', pID);
          this.personalInfoId = pID;
          this.personalInfoForm.controls['ID'].setValue(pID);
          this.familyInfoForm.controls['personalInfoId'].setValue(pID);
          this.educationForm.controls['personalInfoId'].setValue(pID);
          this.courseForm.controls['personalInfoId'].setValue(pID);
          this.workForm.controls['personalInfoId'].setValue(pID);
          this.refrenceForm.controls['personalInfoId'].setValue(pID);
          this.guaranterForm.controls['personalInfoId'].setValue(pID);
          this.intTravelForm.controls['personalInfoId'].setValue(pID);
          this.personalInfoDetails = result.data;
          // this.stepper.selected.completed = true;
          // this.stepper.selected.editable = true;
          // this.stepper.next();
          this.succErrMsg = '';
        } else {
          this.stepper.selectedIndex = 0;
          this.succErrMsg = result.message;
          if (isObject(result.data)) {
            for (let i in result.data) {
              this.personalInfoForm.controls[i].setErrors({ 'incorrect': true });
              this.pInfoErrors = result.data;
            }
          }
          return false;
        }
      });
    }
  }
  addFamilyInfo(formInputs) {
    console.log('FamilyInfo:', formInputs)
    if (this.familyInfoForm.valid) {
      this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertFamilyInfo', formInputs).subscribe(result => {
        if (result.status) {
          this.familyInfoId = result.data['ID'];
          this.familyInfoForm.controls['ID'].setValue(result.data['ID']);
          this.faimlyInfoDetails = result.data;
          this.succErrMsg = '';
        } else {
          this.stepper.selectedIndex = 1;
          this.succErrMsg = result.message;
          if (isObject(result.data)) {
            for (let i in result.data) {
              this.familyInfoForm.controls[i].setErrors({ 'incorrect': true });
              this.fInfoErrors = result.data;
            }
          }
        }
      });
    }
  }
  addEducationInfo(formInputs) {
    const qualification = [];
    const boardUniversity = [];
    const majorSubject = [];
    const passingDate = [];
    const startDate = [];
    const GPA = [];
    const language = [];
    const speaking = [];
    const writting = [];
    const reading = [];
    const listening = [];
    formInputs.educations.forEach(element => {
      qualification.push(element.qualification);
      boardUniversity.push(element.boardUniversity);
      majorSubject.push(element.majorSubject);
      passingDate.push(element.passingDate);
      startDate.push(element.startDate);
      GPA.push(element.GPA);
    });
    formInputs.languages.forEach(element => {
      language.push(element.language);
      speaking.push(element.speaking);
      writting.push(element.writting);
      reading.push(element.reading);
      listening.push(element.listening);
    });
    let __obj = {
      qualification: qualification,
      boardUniversity: boardUniversity,
      majorSubject: majorSubject,
      passingDate: passingDate,
      startDate: startDate,
      GPA: GPA,
      language: language,
      speaking: speaking,
      writting: writting,
      reading: reading,
      listening: listening,
    }
    // console.log('educationInfoInputs:', __obj);
    if (this.educationForm.valid) {
    this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertEducationInfo', __obj).subscribe(result => {
      if (result.status) {
        // this.familyInfoId = result.data['ID'];
        // this.familyInfoForm.controls['ID'].setValue(result.data['ID']);
        this.educationInfoDetails = result.data;
        this.succErrMsg = '';
      } else {
        this.stepper.selectedIndex = 2;
        this.succErrMsg = result.message;
        // console.log('EduErrors:', result.data);
        // if (isObject(result.data)) {
        //   for (let i in result.data) {
        //     this.educationForm.controls[i].setErrors({ 'incorrect': true });
        //     this.eInfoErrors = result.data;
        //   }
        // }
      }
    });
    }
  }
  addCourseInfo(formInputs) {
    console.log('CourseInfo:', formInputs)
    if (this.courseForm.valid) {
      this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertCourseInfo', formInputs).subscribe(result => {
        console.log('Post:', result);
      });
    }
  }
  addWorkInfo(formInputs) {
    console.log('WorkInfo:', formInputs)
    if (this.workForm.valid) {
      this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertWorkInfo', formInputs).subscribe(result => {
        console.log('Post:', result);
      });
    }
  }
  addRefrenceInfo(formInputs) {
    console.log('RefrencesInfo:', formInputs)
    if (this.refrenceForm.valid) {
      this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertRefrenceInfo', formInputs).subscribe(result => {
        console.log('Post:', result);
      });
    }
  }
  addGuaranterInfo(formInputs) {
    console.log('GuarantersInfo:', formInputs)
    if (this.guaranterForm.valid) {
      this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertGuaranterInfo', formInputs).subscribe(result => {
        console.log('Post:', result);
      });
    }
  }
  addIntTravelInfo(formInputs) {
    console.log('IntTravelInfo:', formInputs)
    if (this.intTravelForm.valid) {
      this.__ms.postData(this.__ms.backEndUrl + 'Jobs/insertIntTravelsInfo', formInputs).subscribe(result => {
        console.log('Post:', result);
      });
    }
  }
  getApplicantInformations() {
    let ID = this.personalInfoId;
    this.__ms.postData(this.__ms.backEndUrl + 'Jobs/applicantInformations', { ID }).subscribe(results => {
      console.log('Results:', results)
      this.__setPersonalInfoDefault(results.data['personalInfo']);
      this.__setFamilyInfoDefault(results.data['familyInfo']);
    });
  }
  __setPersonalInfoDefault(__obj) {
    if (isObject(__obj)) {
      this.personalInfoDetails = __obj;
      this.personalInfoForm.controls['applicationId'].setValue(__obj.applicationId);
      this.personalInfoForm.controls['title'].setValue(__obj.title);
      this.personalInfoForm.controls['firstName'].setValue(__obj.firstName);
      this.personalInfoForm.controls['lastName'].setValue(__obj.lastName);
      this.personalInfoForm.controls['DOB'].setValue(__obj.DOB);
      this.personalInfoForm.controls['maritalStatus'].setValue(__obj.maritalStatus);
      this.personalInfoForm.controls['gender'].setValue(__obj.gender);
      this.personalInfoForm.controls['nationality'].setValue(__obj.nationality);
      this.personalInfoForm.controls['conveyance'].setValue(__obj.conveyance);
      this.personalInfoForm.controls['phoneNum'].setValue(__obj.phoneNum);
      this.personalInfoForm.controls['cellNum'].setValue(__obj.cellNum);
      this.personalInfoForm.controls['email'].setValue(__obj.email);
      this.personalInfoForm.controls['passportNum'].setValue(__obj.passportNum);
      this.personalInfoForm.controls['CNIC'].setValue(__obj.CNIC);
      this.personalInfoForm.controls['drivingLicence'].setValue(__obj.drivingLicence);
      this.personalInfoForm.controls['presentAddress'].setValue(__obj.presentAddress);
      this.personalInfoForm.controls['permanentAddress'].setValue(__obj.permanentAddress);
      this.personalInfoForm.controls['aboutInfo'].setValue(__obj.aboutInfo);
      this.personalInfoForm.controls['facebook'].setValue(__obj.facebook);
      this.personalInfoForm.controls['twitter'].setValue(__obj.twitter);
      this.personalInfoForm.controls['linkedIn'].setValue(__obj.linkedIn);
      this.workForm.controls['expectedSalary'].setValue(__obj.expectedSalary);
      this.workForm.controls['joinAfter'].setValue(__obj.joinAfter);
    }
  }
  __setFamilyInfoDefault(__obj) {
    // console.log('defaultFamily', __obj)
    if (isObject(__obj)) {
      this.faimlyInfoDetails = __obj;
      this.familyInfoId = __obj.ID;
      this.familyInfoForm.controls['ID'].setValue(__obj.ID);
      this.familyInfoForm.controls['personalInfoId'].setValue(__obj.personalInfoId);
      this.familyInfoForm.controls['relation'].setValue(__obj.relation);
      this.familyInfoForm.controls['name'].setValue(__obj.name);
      this.familyInfoForm.controls['cellNum'].setValue(__obj.cellNum);
      this.familyInfoForm.controls['phoneNum'].setValue(__obj.phoneNum);
      this.familyInfoForm.controls['email'].setValue(__obj.email);
      this.familyInfoForm.controls['occupation'].setValue(__obj.occupation);
      this.familyInfoForm.controls['jobLocation'].setValue(__obj.jobLocation);
      this.familyInfoForm.controls['orgName'].setValue(__obj.orgName);
      this.familyInfoForm.controls['designation'].setValue(__obj.designation);
    }
  }
}
