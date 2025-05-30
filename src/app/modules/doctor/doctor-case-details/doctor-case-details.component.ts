import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PatientService } from 'src/app/shared/services/patient.service';
import { SharedApiService } from 'src/app/shared/services/common-services/shared-api.service';
import { QuestionairService } from 'src/app/shared/services/questionair.service';
import { CaseService } from 'src/app/shared/services/case.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/shared/services/common-services/session.service';
import { AppAlertMessages } from 'src/app/shared/enums/app-alert-messages.enum';
import { AlertService } from 'src/app/shared/services/common-services/alert.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { saveAs } from 'file-saver';
import { ConfirmModalComponent } from 'src/app/shared/common-components/confirm-modal/confirm-modal.component';
declare var require: any

@Component({
  selector: 'app-doctor-case-details',
  templateUrl: './doctor-case-details.component.html',
  styleUrls: ['./doctor-case-details.component.css']
})
export class DoctorCaseDetailsComponent implements OnInit {
  modalRef: BsModalRef;
  step1Form: FormGroup;
  step2Form: FormGroup;
  observationForm: FormGroup;
  conclusionForm: FormGroup;
  isSubmittedStep1:boolean = false;
  isSubmittedStep2:boolean = false;
  isSubmittedObservation:boolean = false;
  isSubmittedConclusion:boolean = false;
  public answersGiven=[];

  public step:number = 1;     // Set selected step number
  public familyMembers = [];  // Options for dropdown list of family members
  private caseId:string = "";         // Set After case id created
  public disableForm = true;
  public observationList:any;
  constructor(
      private route: ActivatedRoute,
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
      caseType: [{value:'', disabled:this.disableForm},[Validators.required]],
      serviceCategory: [{value:'', disabled:this.disableForm},[Validators.required]], 
      serviceSubCategory: [{value:'', disabled:this.disableForm},[Validators.required]],
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
      gender: [{value:'', disabled:this.disableForm}],
      weight: [{value:'', disabled:this.disableForm},[Validators.required]],
      height: [{value:'', disabled:this.disableForm},[Validators.required]],
      nationality: [{value:'', disabled:this.disableForm}],
      occupation: [{value:'', disabled:this.disableForm}],

      maritalStatus: [{value:'', disabled:this.disableForm}, Validators.required],
      childrens: [{value:'', disabled:this.disableForm}],
      smoking: [{value:'No', disabled:this.disableForm}],
      smokingType: [{value:'', disabled:this.disableForm}],
      smokingFrequency: [{value:'', disabled:this.disableForm}],
      smokingTimePeriod: [{value:'', disabled:this.disableForm}],
      drinking: [{value:'No', disabled:this.disableForm}],
      drinkingType: [{value:'', disabled:this.disableForm}],
      drinkingFrequency: [{value:'', disabled:this.disableForm}],
      drinkingTimePeriod: [{value:'', disabled:this.disableForm}],
      prescribedDrugFile: [null],
      diet: [{value:'', disabled:this.disableForm}],
      travelHistory: [{value:'', disabled:this.disableForm}],
      maternal: [{value:'', disabled:this.disableForm}],
      paternal: [{value:'', disabled:this.disableForm}],
      sibling: [{value:''}],
      allergies: [{value:''}],
      allergyDocFile: [null],
    });
    
    
    /**
     * Questionair form: step2
     */
    this.step2Form = this.formBuilder.group({
      pastMajorIllness: [''],
      pastMajorIllnessFile: [null],
      anySurgicalHistory: [''],
      surgicalHistoryFile: [null],
      presentHealthComplaints: ['',[Validators.required]],
      presentHealthComplaintsFile: [null],
      questionsArray: this.formBuilder.array([])
    });
   
    this.observationForm = this.formBuilder.group({
      observation: ['',Validators.required]
    });

    this.conclusionForm = this.formBuilder.group({
      conclusion: ['',Validators.required]
    });

  }

  public patientUserId:string;
  public caseDetails:any;
  public subCategories:any;
  public categories:any;

  ngOnInit() {
    this.step1Form.disable();
    this.step2Form.disable();
    this.route.params.subscribe(params => {
      this.caseId = params['id'];
    });
    this.getServiceCategories();    // Get Service Category and Sub Category list
    this.getCaseHistoryByCaseId();
  }


  /**
   * Get Case Details
   */
  public myDate:any;
  getCaseAllDetails(){
    this.CaseService.getCaseAllDetails(this.caseId).subscribe(
      (data: any) => {

        this.caseDetails = data.body; 
        // set given anserwer array to bind with html
        this.answersGiven = this.caseDetails.questionnaire;
      
        // get subcategory list
        this.getSubCategory(this.caseDetails.categoryId);

        this.step1Form.setValue({
          caseType: this.caseDetails.caseType,
          serviceCategory: this.caseDetails.categoryId, 
          serviceSubCategory: this.caseDetails.subCatgoryId,
          firstName: this.caseDetails.firstName,
          lastName: this.caseDetails.lastName,
          email: this.caseDetails.email,
          contactNumber: this.caseDetails.contactNumber,
          address: {
            street1:this.caseDetails.address.street1,   
            street2:this.caseDetails.address.street2,   
            city:this.caseDetails.address.city,   
            state:this.caseDetails.address.state,   
            postalCode:this.caseDetails.address.postalCode,   
            country:this.caseDetails.address.country
          }, 
          age: this.caseDetails.age,
          gender: this.caseDetails.gender,
          weight: this.caseDetails.weight,
          height: this.caseDetails.height,
          nationality: this.caseDetails.nationality,
          occupation: this.caseDetails.occupation,

          maritalStatus: this.caseDetails.socialHistory.maritalStatus,
          childrens: this.caseDetails.socialHistory.children,
          smoking: this.caseDetails.socialHistory.smokingHabit == true ? "Yes" : "No",
          smokingType: this.caseDetails.socialHistory.smokingType,
          smokingFrequency: this.caseDetails.socialHistory.smokingFrequency,
          smokingTimePeriod: this.caseDetails.socialHistory.smokingPeriod,
          drinking: this.caseDetails.socialHistory.alcoholConsumption == true ? "Yes" : "No",
          drinkingType: this.caseDetails.socialHistory.alcoholType,
          drinkingFrequency: this.caseDetails.socialHistory.alcoholFrequency,
          drinkingTimePeriod: this.caseDetails.socialHistory.alcoholPeriod,
          prescribedDrugFile: [null],
          diet: this.caseDetails.socialHistory.diet,
          travelHistory: this.caseDetails.socialHistory.travelHistory,
          maternal: this.caseDetails.familyHistory.maternal,
          paternal: this.caseDetails.familyHistory.paternal,
          sibling: this.caseDetails.familyHistory.sibling,
          allergies: this.caseDetails.familyHistory.allergies,
          allergyDocFile: [null],
        });

        this.step2Form.patchValue({pastMajorIllness:this.caseDetails.pastHistoryOfMajorillness.answer});
        this.step2Form.patchValue({anySurgicalHistory:this.caseDetails.anySurgicalHistory.answer});
        this.step2Form.patchValue({presentHealthComplaints:this.caseDetails.presentHealthComplaints.answer});
       
        this.uploadedFiles_allergyDocFile = this.caseDetails.familyHistory.allergyDocFile;
        this.uploadedFiles_presentHealthComplaints = this.caseDetails.presentHealthComplaints.uploadReports;
        this.uploadedFiles_anySurgicalHistory = this.caseDetails.anySurgicalHistory.uploadReports;
        this.uploadedFiles_pastHistoryofMajorillness = this.caseDetails.pastHistoryOfMajorillness.uploadReports;
        this.uploadedFiles_prescribedDrugFile = this.caseDetails.socialHistory.prescribedDrugFile;
        
        this.uploadedFiles_prescriptionFile = this.caseDetails.prescription;
      
        // set observations array
        this.observationList = this.caseDetails.consultations;
        
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
  }

  
  /**
   * Get Service Category and Sub Category list
   */
  getServiceCategories(){
    this.SharedApiService.getServiceCategory().subscribe(
      (data: any) => {
        this.categories = data.body.content; 
        this.getCaseAllDetails();
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
  getSubCategory(id){
    let temp = this.categories.find(
      (category) => (category.id == id)
    );

    this.subCategories = temp.subcategory;  
    this.getQuestionair(id);
  }


  /**
   * Get case history list
   */
  public caseHistoryList:any;
  getCaseHistoryByCaseId(){
    this.CaseService.getCaseHistoryByCaseId(this.caseId).subscribe(
      (data: any) => {
        // console.log(data);
        this.caseHistoryList = data.body.content; 
      },
      (error: any) => {
        // console.log("error", error);
      }
    );
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

        this.questionair.forEach((input_template,index)=>{
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
            // Bind question's ansers to the questionnair
            let assignmentVar = "";
            (this.caseDetails.categoryId == id) ? assignmentVar = this.caseDetails.questionnaire[index].answer[0] : ""; 
            this.questionsArray.push(this.formBuilder.control(assignmentVar, validations));
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
 
  setAnswers(controlType, ans, queId, answerChoosed=""){
    let givenAns:string;
    if(controlType == "radio"){ givenAns = answerChoosed; }
    else { givenAns = ans; }

    let index = this.answersGiven.findIndex(que => que.questionId === queId)
    
    if(index === -1){
      this.answersGiven.push({ "questionId": queId, "answer":[givenAns] }) ; 
    } else {
      if(controlType == "checkbox"){
        if(ans){ this.answersGiven[index].answer.push(givenAns); }
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
  * getter methods for Steps
  */
  get step1FormData() {
    return this.step1Form.controls;
  }
  get step2FormData() {
    return this.step2Form.controls;
  }
  get observationFormData() {
    return this.observationForm.controls;
  }
  get conclusionFormData() {
    return this.conclusionForm.controls;
  }
  // get step4FormData() {
  //   return this.step4Form.controls;
  // }
  get questionsArray() {
    return this.step2Form.get('questionsArray') as FormArray;
  }

  /**
   * Submit observation form
   */
  addObservation(){
    this.isSubmittedObservation = true;
    if(this.observationForm.valid){
      let formData = {
        "observation": this.observationForm.get('observation').value,
      }
      this.CaseService.addObservationToCase(this.caseId, formData).subscribe(
        (data: any) => {
          this.getCaseAllDetails();
          this.isSubmittedObservation = false;
          this.observationForm.patchValue({"observation": ""}); 
          this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
        },
        (error: any) => {
          this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
          // console.log("error", error);
        }
      );
    }
  }
  /**
   * Submit Conclusion form
   */
  addConclusion(){
    this.isSubmittedConclusion = true;
    if(this.conclusionForm.valid){
      let formData = {
        "conclusion": this.conclusionForm.get('conclusion').value,
      }
      this.CaseService.addConclusionToCase(this.caseId, formData).subscribe(
        (data: any) => {
          this.getCaseAllDetails();
          this.isSubmittedConclusion = false;
          this.conclusionForm.patchValue({"conclusion": ""}); 
          this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
        },
        (error: any) => {
          this.AlertService.showAlert({type:'danger', title: AppAlertMessages.TITLE_ERROR, message: AppAlertMessages.ACTION_FAILED});
          // console.log("error", error);
        }
      );
    }
  }
  
  
  /**
  * Step change action
  */
  changeStep(step){
    this.editForm(false);
    this.step = step;
  }
  prevStep(){
    this.step = this.step-1;
  }
 
  editForm(val){
    if(val){
      this.disableForm = false;
      this.step1Form.enable();
      this.step2Form.enable();
    } else{
      this.disableForm = true;
      this.step1Form.disable();
      this.step2Form.disable();
    }
    
  }

  saveForm(){
    this.onSubmit();
    // disable the form
    
  }


/**
* Form Submission
*/
onSubmit() {
  switch (this.step) {
    case 1:
      this.isSubmittedStep1 = true;
      if(this.step1Form.valid){
        this.updateCase();
      }
    break;
    case 2:
      this.isSubmittedStep2 = true;
      if(this.step2Form.valid){
        this.updateCase();
      }
    break;

    default:
      return 'Something went wrong!';
  }
}


/**
* save case details
*/  
 updateCase(){
  let formData = this.getFinalCaseRequest();
  this.CaseService.updateCase(this.caseId, formData).subscribe(
    (data: any) => {
      this.editForm(false);
      this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.SAVE_SUCCESS});
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
    // "patientId": this.step1FormData.patient.value,
   
    // "doctorsPanel" : this.step4FormData.doctorsPanel.value,
    // "typeOfConsultation": this.step4FormData.typeOfConsultation.value,

    "pastHistoryOfMajorillness": {
        "answer": this.step2FormData.pastMajorIllness.value
        
    },
    "anySurgicalHistory": {
        "answer": this.step2FormData.anySurgicalHistory.value
    },
    "presentHealthComplaints": {
        "answer": this.step2FormData.presentHealthComplaints.value
    },
    "questionnaire": this.answersGiven,
    "socialHistory": {
        "maritalStatus": this.step1FormData.maritalStatus.value,
        "children": this.step1FormData.childrens.value,
        "smokingHabit": (this.step1FormData.smoking.value == "Yes")? true : false,
        "smokingType": this.step1FormData.smokingType.value,
        "smokingFrequency": this.step1FormData.smokingFrequency.value,
        "smokingPeriod": this.step1FormData.smokingTimePeriod.value,
        "alcoholConsumption": (this.step1FormData.drinking.value == "Yes")? true : false,
        "alcoholType": this.step1FormData.drinkingType.value,
        "alcoholFrequency": this.step1FormData.drinkingFrequency.value,
        "alcoholPeriod": this.step1FormData.drinkingTimePeriod.value,
        "drugs": "",
        "diet": this.step1FormData.diet.value,
        "travelHistory": this.step1FormData.travelHistory.value
    },
    "familyHistory": {
        "maternal": this.step1FormData.maternal.value,
        "paternal": this.step1FormData.paternal.value,
        "sibling": this.step1FormData.sibling.value,
        "allergies": this.step1FormData.allergies.value
    }
}
  return formData;
  
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
    case 'weight':
      if (this.step1FormData.weight.errors && this.step1FormData.weight.errors.required) { return "Weight is required" }
    break;
    case 'height':
      if (this.step1FormData.height.errors && this.step1FormData.height.errors.required) { return "Height is required" }
    break;
    case 'maritalStatus':
      if (this.step1FormData.maritalStatus.errors && this.step1FormData.maritalStatus.errors.required) { return "Please select Marital Status." }
    break;
    case 'requiredRadio':
      if (this.step1FormData.smoking.errors && this.step1FormData.smoking.errors.required) { return "Please choose a option." }
      if (this.step1FormData.drinking.errors && this.step1FormData.drinking.errors.required) { return "Please choose a option." }
      if (this.step1FormData.diet.errors && this.step1FormData.diet.errors.required) { return "Please choose a option." }
    break;
    case 'maternal':
      if (this.step1FormData.maternal.errors && this.step1FormData.maternal.errors.required) { return "Maternal history is required" }
    break;
    case 'paternal':
      if (this.step1FormData.paternal.errors && this.step1FormData.paternal.errors.required) { return "Paternal history is required." }
    break;

    case 'observation':
      if (this.observationFormData.observation.errors && this.observationFormData.observation.errors.required) { return "Enter observation." }
    break;
   
    case 'conclusion':
      if (this.conclusionFormData.conclusion.errors && this.conclusionFormData.conclusion.errors.required) { return "Enter case conclusion." }
    break;
   

    default:
      return 'Something went wrong!';
  }
}
  

  
  
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
  public file_prescriptionFile: File;
  public uploadedFiles_prescriptionFile= new Array();
  
  getOnlyFileName(filePath){
    return filePath.substring((filePath.lastIndexOf("/")+1));
  }
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
        case "prescriptionFile" :
          this.file_prescriptionFile = file;
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
      case 'prescriptionFile' : {
        formData.append('type', "prescription");
        formData.append('file', this.file_prescriptionFile);
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
            case "prescriptionFile":
              this.uploadedFiles_prescriptionFile.push(this.file_prescriptionFile.name);
              this.file_prescriptionFile = null;
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

  removeFile(type, filepath){
    let filename = this.getOnlyFileName(filepath); 
    let param = "?type="+type+"&file="+filename+"&caseId="+this.caseId;
    this.CaseService.deleteFile(param).subscribe(
      (data: any) => {
        this.AlertService.showAlert({type:'success', title: AppAlertMessages.TITLE_SUCCESS, message: AppAlertMessages.DELETE_SUCCESS});

        switch(type){
          case "prescribedDrugFile" : {
            this.uploadedFiles_prescribedDrugFile = this.uploadedFiles_prescribedDrugFile.filter(item => item !== filepath);
            break;
          } 
          case "allergyDocFile" : {
            this.uploadedFiles_allergyDocFile = this.uploadedFiles_allergyDocFile.filter(item => item !== filepath);
            break;
          } 
          case "pastHistoryofMajorillness" : {
            this.uploadedFiles_pastHistoryofMajorillness = this.uploadedFiles_pastHistoryofMajorillness.filter(item => item !== filepath);
            break;
          } 
          case "anySurgicalHistory" : {
            this.uploadedFiles_anySurgicalHistory = this.uploadedFiles_anySurgicalHistory.filter(item => item !== filepath);
            break;
          } 
          case "presentHealthComplaints" : {
            this.uploadedFiles_presentHealthComplaints = this.uploadedFiles_presentHealthComplaints.filter(item => item !== filepath);
            break;
          } 
          case "prescription" : {
            this.uploadedFiles_prescriptionFile = this.uploadedFiles_prescriptionFile.filter(item => item !== filepath);
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

