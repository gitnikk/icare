import { Injectable } from "@angular/core";
import { ApiRequestWrapperService } from "./common-services/api-request-wrapper.service";
import { AppApiUrls } from "../enums/app-api-urls.enum";
import { ApiEndPoint } from "../config/api-endpoint.config";

@Injectable({
  providedIn: "root",
})
export class DoctorService {
  private apiEndPointConfig: ApiEndPoint;
  private apiEndPoint: string;

  constructor(private apiHandlerService: ApiRequestWrapperService) {
    this.apiEndPointConfig = new ApiEndPoint();
    this.apiEndPoint = this.apiEndPointConfig.getGeneratedApiEndpoint('doctor');
  }

  /**
   * Get list of doctors
   */
  getDoctorsList() {
    const url = this.apiEndPoint + AppApiUrls.DOCTOR_URL + "?active=ACTIVE"     
    return this.apiHandlerService.get(url);
  }

  /**
  * Get list of all Doctors including active or deactive
  */
  getListAllDoctors() {
    const url = this.apiEndPoint + AppApiUrls.DOCTOR_URL + "/all";
    return this.apiHandlerService.get(url);
  }

  /**
   * Get doctor details by id
   * @param id doctor unique id
   */
  getDoctorById(id) {
    const url = this.apiEndPoint + AppApiUrls.DOCTOR_URL + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.get(url);
  }

  /**
   * Get doctor profile details by id
   * @param id doctor unique id
   */
  getDoctorProfile(id) {
    const url = this.apiEndPoint + AppApiUrls.DOCTOR_URL + AppApiUrls.URL_SEPARATER + "profile/" + id;
    return this.apiHandlerService.get(url);
  }

  /**
   * Function to onboard doctor
   * @param formData - onboard doctor form data
   */
  onboardDoctor(formData) {
    const url = this.apiEndPoint + AppApiUrls.DOCTOR_URL;
    return this.apiHandlerService.save(url, formData);
  }


  /**
   * File Upload
   * @param data 
   */
  uploadFile(data){
    const url = this.apiEndPoint 
                + AppApiUrls.DOCTOR_URL
                + AppApiUrls.URL_SEPARATER + "upload";
    return this.apiHandlerService.save(url, data);  

  }

  /**
   * To get profile image url
   **/
  getSignedUrl(data){
    const url = this.apiEndPoint 
              + AppApiUrls.DOCTOR_URL
                + AppApiUrls.URL_SEPARATER + "download";
    return this.apiHandlerService.save(url, data);
  }


  /**
   * Update profile  
   * @param id, formData
   */
  updateMyProfile(id, formData) {
    const url = this.apiEndPoint 
                + AppApiUrls.DOCTOR_URL
                + AppApiUrls.URL_SEPARATER + "updateProfile/"+id;
    return this.apiHandlerService.update(url, formData);
  
  }

  /**
   * Update doctor details (Admin portal)  
   * @param id, formData
   */
  updateCM(id, formData) {
    const url = this.apiEndPoint 
                + AppApiUrls.DOCTOR_URL
                + AppApiUrls.URL_SEPARATER + "admin/updateProfile/"+id;
    return this.apiHandlerService.update(url, formData);
  
  }

  /**
   * Delete Doctor
   * @param id user unique id
   */
  deleteRecord(id) {
    const url = this.apiEndPoint 
                + AppApiUrls.DOCTOR_URL
                + AppApiUrls.URL_SEPARATER + "status/"+ id + "?active=DELETE";
    return this.apiHandlerService.update(url, "");
  }
}
