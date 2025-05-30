import { Injectable } from '@angular/core';
import { AppApiUrls } from "../enums/app-api-urls.enum";
import { ApiEndPoint } from 'src/app/shared/config/api-endpoint.config';
import { ApiRequestWrapperService } from './common-services/api-request-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiEndPointConfig: ApiEndPoint;
  private apiEndPoint: string;
  
  constructor(private apiHandlerService: ApiRequestWrapperService) {
    this.apiEndPointConfig = new ApiEndPoint();
    this.apiEndPoint = this.apiEndPointConfig.getGeneratedApiEndpoint('patient');
  }
  
  /**
   * Get Patient Profile details and Family member list by patient user id
   * @param id user unique id
   */
  getFamilyMembersList(id) {
    const url = this.apiEndPoint 
                + AppApiUrls.PATIENT_USER_URL
                + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.get(url);
  }

  /**
   * Delete Patient/Family member by patient id
   * @param id user unique patient id
   */
  deleteFamilyMember(id) {
    const url = this.apiEndPoint 
                + AppApiUrls.PATIENT_URL
                + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.delete(url);
  }

  /**
   * Register new patient
   * @param formData 
   */
  patientSignUp(formData) {
    const url = this.apiEndPoint + AppApiUrls.PATIENT_SIGN_UP_URL;
    return this.apiHandlerService.save(url, formData);
  }

  /**
   * Update patient profile  
   * @param id, formData
   */
  updateMyProfile(id, formData) {
    const url = this.apiEndPoint 
                + AppApiUrls.PATIENT_URL
                + AppApiUrls.URL_SEPARATER + "profile/"+id;
    return this.apiHandlerService.update(url, formData);            
  
  }

  /**
   * Add new family member
   * @param formData, patient user id 
   */
  addFamilyMember(id, formData){
    const url = this.apiEndPoint 
                + AppApiUrls.PATIENT_USER_URL
                + AppApiUrls.URL_SEPARATER + "addMember/"+id;
    return this.apiHandlerService.save(url, formData);  
  }

  /**
   * Update family member
   * @param formData, patient user id 
   */
  updateFamilyMember(id, formData){
    const url = this.apiEndPoint 
                + AppApiUrls.PATIENT_URL
                + AppApiUrls.URL_SEPARATER + "familyMember/profile/" +id;
    return this.apiHandlerService.update(url, formData);  
  }

  /**
   * Get family member details
   * @param formData, patient user id 
   */
  getFamilyMemberDetails(id){
    const url = this.apiEndPoint 
                + AppApiUrls.PATIENT_URL
                + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.get(url);  
  }

  /**
   * Patient profile picture upload
   * @param data 
   */
  uploadFile(data){
    const url = this.apiEndPoint 
                + AppApiUrls.PATIENT_URL
                + AppApiUrls.URL_SEPARATER + "upload";
    return this.apiHandlerService.save(url, data);  

  }

  /**
   * To get profile image url
   **/
  getSignedUrl(data){
    const url = this.apiEndPoint 
              + AppApiUrls.PATIENT_URL
                + AppApiUrls.URL_SEPARATER + "download";
    return this.apiHandlerService.save(url, data);
  }
}
