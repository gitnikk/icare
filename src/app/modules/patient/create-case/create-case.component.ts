import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PatientService } from 'src/app/shared/services/patient.service';
import { SharedApiService } from 'src/app/shared/services/common-services/shared-api.service';
import { QuestionairService } from 'src/app/shared/services/questionair.service';
import { CaseService } from 'src/app/shared/services/case.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { saveAs } from 'file-saver';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
declare var require: any

@Component({
  selector: 'app-create-case',
  templateUrl: './create-case.component.html',
  styleUrls: ['./create-case.component.css']
})
export class CreateCaseComponent implements OnInit {

  modalRef: BsModalRef;
  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;
  isSubmittedStep1:boolean = false;
  isSubmittedStep2:boolean = false;
  isSubmittedStep3:boolean = false;
  isSubmittedStep4:boolean = false;

  public step:number = 1;     // Set selected step number
  public familyMembers = [];  // Options for dropdown list of family members
  private caseId:string = "";         // Set After case id created
  
  constructor(
      public formBuilder: FormBuilder, 
      private PatientService: PatientService, 
      private QuestionairService: QuestionairService,
      private SharedApiService: SharedApiService,
      private CaseService: CaseService,
      private router: Router,
      private sessionService: SessionService,
      private AlertService: AlertService,
      private modalService: BsModalService,
    ) {
      
      
    /**
     * Service Details form: step1
     */
    this.step1Form = this.formBuilder.group({
      caseType: ['',[Validators.required]],
      serviceCategory: ['',[Validators.required]], 
      serviceSubCategory: ['',[Validators.required]],
      patient: ['',[Validators.required]],
      firstName: [{value:'', disabled:true}],
      lastName: [{value:'', disabled:true}],
      email: [{value:'', disabled:true}],
      contactNumber: [{value:'', disabled:true}],
      address: this.formBuilder.group({
        street1:[{value:'', disabled:true}],   
        street2:[{value:'', disabled:true}],   
        city:[{value:'', disabled:true}],   
        state:[{value:'', disabled:true}],   
        postalCode:[{value:'', disabled:true}],   
        country:[{value:'', disabled:true}]
      }), 
      age: [''],
      gender: [{value:'', disabled:true}],
      weight: ['',[Validators.required]],
      height: ['',[Validators.required]],
      nationality: [{value:'', disabled:true}],
      occupation: [{value:'', disabled:true}],
    });
    
    /**
     * Patient History form: step2
     */
    this.step2Form = this.formBuilder.group({
      maritalStatus: ['', Validators.required],
      childrens: [''],
      smoking: ['No'],
      smokingType: [''],
      smokingFrequency: [''],
      smokingTimePeriod: [''],
      drinking: ['No'],
      drinkingType: [''],
      drinkingFrequency: [''],
      drinkingTimePeriod: [''],
      prescribedDrugFile: [null],
      diet: [''],
      travelHistory: [''],
      maternal: [''],
      paternal: [''],
      sibling: [''],
      allergies: [''],
      allergyDocFile: [null],
    });

    /**
     * Questionair form: step3
     */
    this.step3Form = this.formBuilder.group({
      pastMajorIllness: [''],
      pastMajorIllnessFile: [null],
      surgicalHistory: [''],
      surgicalHistoryFile: [null],
      presentHealthComplaints: ['',[Validators.required]],
      presentHealthComplaintsFile: [null],
      questionsArray: this.formBuilder.array([])
    });

    /**
     * Panel Selection form: step4
     */
    this.step4Form = this.formBuilder.group({
      typeOfConsultation: ['Without Tele-conferncing', Validators.required],
      doctorsPanel: ['India', Validators.required]
    });
  }

  patientUserId:string;
  ngOnInit() {
    this.patientUserId = this.sessionService.getProfileId();
    this.getFamilyMembersList();    // Get Family member list including user itself
    this.getServiceCategories();    // Get Service Category and Sub Category list
  }

  /**
   * Get Service Category and Sub Category list
   */
  public categories:any;
  getServiceCategories(){
    this.SharedApiService.getServiceCategory().subscribe(
      (data: any) => {
        this.categories = data.body.content; 
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }

  /**
   * Filter and get Sub Category list by Service Category
   * @param Service Category id
   */
  public subCategories:any;
  getSubCategory(id){
    let temp = this.categories.find(
      (category) => (category.id == id.value)
    );
    this.subCategories = temp.subcategory;  
    
    this.getQuestionair(id.value);
  }

  /**
   * Get Questionair data by Service Category and set Form Elements
   * @param Service Category id
   */
  public questionair:any;

  resetQuestionairArray(){
    this.questionsArray.value.forEach((item,index)=>{
      this.questionsArray.removeAt(index);
    });
  }
  
  getQuestionair(id){
    this.resetQuestionairArray();
    this.questionsArray.controls = [];
    this.questionair = []; 

    this.QuestionairService.getQuestionair(id).subscribe(
      
      (data: any) => {
        if(data.body.errorCodes){
          return;
        }
        this.questionair = data.body.questions; 

        this.questionair.forEach(input_template=>{
          let validations = [];
          if(input_template.mandatory) {validations.push(Validators.required);}

          if(input_template.controlType == "checkbox"){
            
            let group={}    
            input_template.options.forEach((opt,j)=>{
              group[j] = new FormControl(false);  
            })
            this.questionsArray.push(this.formBuilder.group(group));
            // this.myFormGroup = new FromGroup(group);
          }
          else if(input_template.controlType != null) {
            this.questionsArray.push(this.formBuilder.control("", validations));
          }
        });
      },
      (error: any) => {
        // console.log("error", error);
      }
    );

  }
  
  /**
   * Set AnswersGiven Array for final questionaair api
   */
  public answersGiven=[];
  setAnswers(controlType, event, queId, answerChoosed=""){
    let givenAns:string;
    if(controlType == "radio"){ givenAns = answerChoosed; }
    else { givenAns = event.target.value; }

    let index = this.answersGiven.findIndex(que => que.questionId === queId)
    
    if(index === -1){
      this.answersGiven.push({ "questionId": queId, "answer":[givenAns] }) ; 
    } else {
      if(controlType == "checkbox"){
        if(event.target.checked){ this.answersGiven[index].answer.push(givenAns); }
        else { 
          var ansindex = this.answersGiven[index].answer.indexOf(givenAns);
          this.answersGiven[index].answer.splice(ansindex, 1);
        }
      } else{
        
        this.answersGiven[index] = { "questionId": queId, "answer":[givenAns] };
      }
    }
    // console.log(this.answersGiven);
    
  }
  /**
   * Get Family members list from database
   */
  getFamilyMembersList(){
      this.PatientService.getFamilyMembersList(this.patientUserId).subscribe(
        (data: any) => {
          data = data.body;
          // Iterate the response data and set dropdown options for family members
          this.familyMembers.push(data.patientEntity)
          if(data.familyMembers.length > 0){
            data.familyMembers.forEach((item,index) => {
              this.familyMembers.push(item)
            });
          }
          // console.log(this.familyMembers);
        },
        (error: any) => {
          // console.log("error", error);
        }
      );
  }

  /**
   * Set Family member details to formControls
   */
  getPatientDetails(patient){
    if(!this.step1FormData.patient.value){ return; }

    let member = this.familyMembers.find(member => member.id === this.step1FormData.patient.value)
    
    this.step1Form.patchValue({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      contactNumber: member.contactNumber,
      address: (!!member.address)? member.address : "",
      // { 
      //   street1: (!!member.address.street1)? member.address.street1 : '',
      //   street2: (!!member.address.street2)? member.address.street2 : '',
      //   city: (!!member.address.city)? member.address.city : '',
      //   state: (!!member.address.state)? member.address.state : '',
      //   postalCode: (!!member.address.postalCode)? member.address.postalCode : '',
      //   country: (!!member.address.country)? member.address.country : '', 
      // },
      age: member.age,
      gender: member.gender,
      weight: member.weight,
      height: member.height,
      nationality: member.nationality,
      occupation: member.occupation
    });    
  }

  /**
  * getter methods for Steps
  */
  get step1FormData() {
    return this.step1Form.controls;
  }
  get step2FormData() {
    return this.step2Form.controls;
  }
  get step3FormData() {
    return this.step3Form.controls;
  }
  get step4FormData() {
    return this.step4Form.controls;
  }
  get questionsArray() {
    return this.step3Form.get('questionsArray') as FormArray;
  }

  /**
  * Return Validation Error Message
  */
  getErrorMessage(fieldName) {
    switch (fieldName) {
      // Form 1 Validation messages
      case 'case-type':
        if (this.step1FormData.caseType.errors && this.step1FormData.caseType.errors.required) { return "Please Select Case Type" }
      break;
      case 'service-category':
        if (this.step1FormData.serviceCategory.errors && this.step1FormData.serviceCategory.errors.required) { return "Service Category is required" }
      break;
      case 'service-sub-category':
        if (this.step1FormData.serviceSubCategory.errors && this.step1FormData.serviceSubCategory.errors.required) { return "Sub Category is required" }
      break;
      case 'patient':
        if (this.step1FormData.patient.errors && this.step1FormData.patient.errors.required) { return "Please Select Patient" }
      break;
      case 'weight':
        if (this.step1FormData.weight.errors && this.step1FormData.weight.errors.required) { return "Weight is required" }
      break;
      case 'height':
        if (this.step1FormData.height.errors && this.step1FormData.height.errors.required) { return "Height is required" }
      break;

      // Form 2 Validation messages
      case 'maritalStatus':
        if (this.step2FormData.maritalStatus.errors && this.step2FormData.maritalStatus.errors.required) { return "Please select Marital Status." }
      break;
      case 'requiredRadio':
        if (this.step2FormData.smoking.errors && this.step2FormData.smoking.errors.required) { return "Please choose a option." }
        if (this.step2FormData.drinking.errors && this.step2FormData.drinking.errors.required) { return "Please choose a option." }
        if (this.step2FormData.diet.errors && this.step2FormData.diet.errors.required) { return "Please choose a option." }
      break;
      case 'maternal':
        if (this.step2FormData.maternal.errors && this.step2FormData.maternal.errors.required) { return "Maternal history is required" }
      break;
      case 'paternal':
        if (this.step2FormData.paternal.errors && this.step2FormData.paternal.errors.required) { return "Paternal history is required." }
      break;
 
      // Form 3 Validation messages
      case 'presentHealthComplaints':
        if (this.step3FormData.presentHealthComplaints.errors && this.step3FormData.presentHealthComplaints.errors.required) { return "Please enter present health complaints" }
      break;

      default:
        return 'Something went wrong!';
    }
  }
  
  /**
  * Step change action
  */
  changeStep(step){
    if(step > this.step){
      this.onSubmit();
    } else {
      this.step = step;
    }
  }
  prevStep(){
    this.step = this.step-1;
  }
 
  /**
  * Form Submission
  */
  onSubmit() {
    switch (this.step) {
      case 1:
        this.isSubmittedStep1 = true;
        if(this.step1Form.valid && this.caseId == ""){
          this.createNewCase();
        } else if(this.step1Form.valid){
          this.updateCase();
        }
      break;
      case 2:
        this.isSubmittedStep2 = true;
        if(this.step2Form.valid){
          this.updateCase();
        }
      break;
      case 3:
        this.isSubmittedStep3 = true;
        if(this.step3Form.valid){
          this.updateCase();
        }
      break;
      case 4:
        this.isSubmittedStep4 = true;
        if(this.step4Form.valid){
          this.updateCase();
          this.router.navigate(["/patient/cases"]);
        }
      break;

      default:
        return 'Something went wrong!';
    }
  }

  /**
  * New Case Creation
  */  
  createNewCase(){
    // alert("newCase");
    this.CaseService.createCase(this.step1Form.value).subscribe(
      (data: any) => {
        if(data.body.id){
          this.caseId = data.body.id;
          this.step = this.step + 1;
        }
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        // console.log("error", error);
      }
    );
  }


  /**
  * New Case Creation
  */  
  updateCase(){
    let formData = this.getFinalCaseRequest();
    this.CaseService.updateCase(this.caseId, formData).subscribe(
      (data: any) => {
        if(this.step>3){
          this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.CASE_CREATED_SUCCESS});
        } else {
          // this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
        }
        this.step = this.step + 1;
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        // console.log("error", error);
      }
    );
  }


  getFinalCaseRequest(){
    let formData = {
      "caseType": this.step1FormData.caseType.value,
      "categoryId": this.step1FormData.serviceCategory.value,
      "subCategoryId": this.step1FormData.serviceSubCategory.value,
      "height": this.step1FormData.height.value,
      "weight": this.step1FormData.weight.value,
      "age": this.step1FormData.age.value,
      "patientId": this.step1FormData.patient.value,
     
      "doctorsPanel" : this.step4FormData.doctorsPanel.value,
      "typeOfConsultation": this.step4FormData.typeOfConsultation.value,
  
      "pastHistoryOfMajorillness": {
          "answer": this.step3FormData.pastMajorIllness.value
          
      },
      "anySurgicalHistory": {
          "answer": this.step3FormData.surgicalHistory.value
      },
      "presentHealthComplaints": {
          "answer": this.step3FormData.presentHealthComplaints.value
      },
      "questionnaire": this.answersGiven,
      "socialHistory": {
          "maritalStatus": this.step2FormData.maritalStatus.value,
          "children": this.step2FormData.childrens.value,
          "smokingHabit": (this.step2FormData.smoking.value == "Yes")? true : false,
          "smokingType": this.step2FormData.smokingType.value,
          "smokingFrequency": this.step2FormData.smokingFrequency.value,
          "smokingPeriod": this.step2FormData.smokingTimePeriod.value,
          "alcoholConsumption": (this.step2FormData.drinking.value == "Yes")? true : false,
          "alcoholType": this.step2FormData.drinkingType.value,
          "alcoholFrequency": this.step2FormData.drinkingFrequency.value,
          "alcoholPeriod": this.step2FormData.drinkingTimePeriod.value,
          "drugs": "",
          "diet": this.step2FormData.diet.value,
          "travelHistory": this.step2FormData.travelHistory.value
      },
      "familyHistory": {
          "maternal": this.step2FormData.maternal.value,
          "paternal": this.step2FormData.paternal.value,
          "sibling": this.step2FormData.sibling.value,
          "allergies": this.step2FormData.allergies.value
      }
  }
    return formData;
    
  }
  /**
   * Bind filename to Lables of input type file 
   */
  // drugFileModel:any;
  // get drugFileLabel(): string {
  //   return this.drugFileModel ? this.drugFileModel.split("\\").pop() : "Choose file";
  // }
  // allergyFileModel:any;
  // get allergyFileLabel():string {
  //   return this.allergyFileModel ? this.allergyFileModel.split("\\").pop() : "Choose file";
  // }
  

  /**
   * Upload file
   * @param uploadType 
   */
  public file_allergyDocFile: File;
  public uploadedFiles_allergyDocFile = new Array();
  public file_presentHealthComplaints: File;
  public uploadedFiles_presentHealthComplaints= new Array();
  public file_anySurgicalHistory: File;
  public uploadedFiles_anySurgicalHistory= new Array();
  public file_pastHistoryofMajorillness: File;
  public uploadedFiles_pastHistoryofMajorillness= new Array();
  public file_prescribedDrugFile: File;
  public uploadedFiles_prescribedDrugFile= new Array();
  
  onFileChange(event, uploadType) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      switch(uploadType){
        case "prescribedDrugFile" :
          this.file_prescribedDrugFile = file;
        break;
        case "presentHealthComplaints" :
          this.file_presentHealthComplaints = file;
        break;
        case "anySurgicalHistory" :
          this.file_anySurgicalHistory = file;
        break;
        case "pastHistoryofMajorillness" :
          this.file_pastHistoryofMajorillness = file;
        break;
        case "allergyDocFile" :
          this.file_allergyDocFile = file;
        break;
      }
    }
    
  }
  uploadFile(uploadType){
    let formData = new FormData();
    formData.append('caseid', this.caseId);
    switch(uploadType){
      case 'prescribedDrugFile' : {
        formData.append('type', "prescribedDrugFile");
        formData.append('file', this.file_prescribedDrugFile);
      }
      break;
      case 'presentHealthComplaints' : {
        formData.append('type', "presentHealthComplaints");
        formData.append('file', this.file_presentHealthComplaints);
      }
      break;
      case 'anySurgicalHistory' : {
        formData.append('type', "anySurgicalHistory");
        formData.append('file', this.file_anySurgicalHistory);
      }
      break;
      case 'pastHistoryofMajorillness' : {
        formData.append('type', "pastHistoryofMajorillness");
        formData.append('file', this.file_pastHistoryofMajorillness);
      }
      break;
      case 'allergyDocFile' : {
        formData.append('type', "allergyDocFile");
        formData.append('file', this.file_allergyDocFile);
      }
      break;
    }

    this.CaseService.uploadFile(formData).subscribe(
      (data: any) => {        
        if(data.body.message == "File Upload Successfully"){
          this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: data.body.message});
          switch(uploadType) {
            case "prescribedDrugFile":
              this.uploadedFiles_prescribedDrugFile.push(this.file_prescribedDrugFile.name);
              this.file_prescribedDrugFile = null;
            break;
            case "presentHealthComplaints":
              this.uploadedFiles_presentHealthComplaints.push(this.file_presentHealthComplaints.name);
              this.file_presentHealthComplaints = null;
            break;
            case "anySurgicalHistory":
              this.uploadedFiles_anySurgicalHistory.push(this.file_anySurgicalHistory.name);
              this.file_anySurgicalHistory = null;
            break;
            case "pastHistoryofMajorillness":
              this.uploadedFiles_pastHistoryofMajorillness.push(this.file_pastHistoryofMajorillness.name);
              this.file_pastHistoryofMajorillness = null;
            break;
            case "allergyDocFile":
              this.uploadedFiles_allergyDocFile.push(this.file_allergyDocFile.name);
              this.file_allergyDocFile = null;
            break;
          } 
        } else {
          this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        }
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
        // console.log("error", error);
      }
    );
  }


  getSignedUrl(type, filename){
    let formData = new FormData();
    formData.append('type', type);
    formData.append('file', filename);
    formData.append('caseid', this.caseId);
    
    
    this.CaseService.getSignedUrl(formData).subscribe(
      (data: any) => {
        console.log(data.body.file);
        var FileSaver = require('file-saver');
        FileSaver.saveAs(data.body.file, filename);
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }
  

  confirmDeleteFile(type, filename){
    // show confirmation message
    this.modalRef = this.modalService.show(ConfirmModalComponent, {
      initialState: { 
        prompt: {
          title: 'Confirm Delete !', 
          message: "Do you really want to delete this file?",
          buttons: [{action: 'Yes', class: 'btn btn-primary'},{action: 'No', class: 'btn'} ],
        },
        callback: (result) => { 
          if(result == 'Yes'){
            // Delete Api call
            this.removeFile(type, filename);
          } 
        }
      }
    });
  }

  removeFile(type, filename){
    let param = "?type="+type+"&file="+filename+"&caseId="+this.caseId;
    
    this.CaseService.deleteFile(param).subscribe(
      (data: any) => {
        this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.DELETE_SUCCESS});

        switch(type){
          case "prescribedDrugFile" : {
            this.uploadedFiles_prescribedDrugFile = this.uploadedFiles_prescribedDrugFile.filter(item => item !== filename);
            break;
          } 
          case "allergyDocFile" : {
            this.uploadedFiles_allergyDocFile = this.uploadedFiles_allergyDocFile.filter(item => item !== filename);
            break;
          } 
          case "pastHistoryofMajorillness" : {
            this.uploadedFiles_pastHistoryofMajorillness = this.uploadedFiles_pastHistoryofMajorillness.filter(item => item !== filename);
            break;
          } 
          case "anySurgicalHistory" : {
            this.uploadedFiles_anySurgicalHistory = this.uploadedFiles_anySurgicalHistory.filter(item => item !== filename);
            break;
          } 
          case "presentHealthComplaints" : {
            this.uploadedFiles_presentHealthComplaints = this.uploadedFiles_presentHealthComplaints.filter(item => item !== filename);
            break;
          } 
           
        }
          
      },
      (error: any) => {
        this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
      }
    );
  }
}
