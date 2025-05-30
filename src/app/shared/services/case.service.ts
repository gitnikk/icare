import { Injectable } from '@angular/core';
import { AppApiUrls } from "../enums/app-api-urls.enum";
import { ApiEndPoint } from 'src/app/shared/config/api-endpoint.config';
import { ApiRequestWrapperService } from './common-services/api-request-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  private apiEndPointConfig: ApiEndPoint;
  private apiEndPoint: string;

  constructor(private apiHandlerService: ApiRequestWrapperService) {
    this.apiEndPointConfig = new ApiEndPoint();
    this.apiEndPoint = this.apiEndPointConfig.getGeneratedApiEndpoint('case');
  }

  /**
   * Create Case  
   * @param caseForm
   */
  createCase(formData) {
    let data = 
    {
      "caseType": formData.caseType,
      "categoryId": formData.serviceCategory,
      "subCategoryId": formData.serviceSubCategory,
      "height": formData.height,
      "weight": formData.weight,
      "age": formData.age,
      "patientId": formData.patient
  }
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER + "create";
    return this.apiHandlerService.save(url, data);            
  }



  /**
   * Update Case  
   * @param caseForm
   */
  updateCase(id, formData) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.update(url, formData);            
  }

  /**
   * Get all Case List  
   */
  getAllCases(request) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + request
    return this.apiHandlerService.get(url);            
  }

  /**
   * Get all Case List  
   */
  getCaseHistoryByCaseId(id) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + "/caseId/patient/" + id
    return this.apiHandlerService.get(url);            
  }

  /**
   * Get list of Cases assigned to care manager  
   */
  getCareManagerCases(id, request) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL 
                + AppApiUrls.URL_SEPARATER
                + "caremanager/" + id + request;
    return this.apiHandlerService.get(url);            
  }

  /**
   * Get list of Cases assigned to Doctor  
   */
  getDoctorCases(id, request) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL 
                + AppApiUrls.URL_SEPARATER
                + "doctor/" + id + request;
    return this.apiHandlerService.get(url);            
  }

  /**
   * Get list of Cases created by a patient  
   */
  getPatientCases(id, request) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL 
                + AppApiUrls.URL_SEPARATER
                + "patient/" + id + request;
    return this.apiHandlerService.get(url);            
  }

  /**
   * Get Case Details for patient case creation process
   * @param caseId
   */
  getCaseDetails(id) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.get(url);            
  }

  /**
   * Assign Doctor to Case  
   * @param caseId, formData
   */
  assignDoctor(id, formData) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER 
                + "assignCaseToDoctor/" + id;
    return this.apiHandlerService.update(url, formData);            
  }

  /**
   * Assign CM to Case  
   * @param caseId, formData
   */
  assignCM(id, formData) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER 
                + "assignToCaremanager/" + id;
    return this.apiHandlerService.update(url, formData);            
  }

  /**
   * Reset CM  
   * @param caseId
   */
  resetCm(id){
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER 
                + "reset/caremanager/" + id;
    return this.apiHandlerService.update(url, {});
  }  

  /**
   * Reset Doctor  
   * @param caseId
   */
  resetDoctor(id){
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER 
                + "reset/doctor/" + id;
    return this.apiHandlerService.update(url, {});
  }  


  uploadFile(data){
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER + "upload";
    return this.apiHandlerService.save(url, data);  

  }

  deleteFile(data){
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER + "file/delete" + data;
    return this.apiHandlerService.save(url, {});
  }


  getSignedUrl(data){
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER + "download";
    return this.apiHandlerService.save(url, data);
  }


  /**
   * Get Case Details for CM/Doctor case view 
   * @param caseId
   */
  getCaseAllDetails(id) {
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER + "details/" + id;
    return this.apiHandlerService.get(url);            
  }

  /**
   * Add CM/Doctor's Observation to a case
   * @param id 
   * @param formData 
   */
  addObservationToCase(id, formData){
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER 
                + "updateObservation/" + id;
    return this.apiHandlerService.update(url, formData);
  }

  /**
   * Add Conclusion to a case
   * @param id 
   * @param formData 
   */
  addConclusionToCase(id, formData){
    const url = this.apiEndPoint 
                + AppApiUrls.CASE_URL
                + AppApiUrls.URL_SEPARATER 
                + "updateConclusion/" + id;
    return this.apiHandlerService.update(url, formData);
  }



  /**
  * Add Medical Advice Service Case  
  */
  addMedicalAdvice(data) {
    const url = this.apiEndPoint + "/api/inHouseService/medicalAdvice/create";
    return this.apiHandlerService.save(url, data);            
  }
 
  /**
  * Add Second Opinion Service Case  
  */
  addSecondOpinion(data) {
    const url = this.apiEndPoint + "/api/inHouseService/secondOpinion/create";
    return this.apiHandlerService.save(url, data);            
  }
}
