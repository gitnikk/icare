import { Injectable } from "@angular/core";
import { ApiRequestWrapperService } from "./common-services/api-request-wrapper.service";
import { AppApiUrls } from "../enums/app-api-urls.enum";
import { ApiEndPoint } from "../config/api-endpoint.config";

@Injectable({
  providedIn: "root",
})
export class CareManagerService {
  private apiEndPointConfig: ApiEndPoint;
  private apiEndPoint: string;

  constructor(private apiHandlerService: ApiRequestWrapperService) {
    this.apiEndPointConfig = new ApiEndPoint();
    this.apiEndPoint = this.apiEndPointConfig.getGeneratedApiEndpoint('caremanager');
  }

  /**
   * Get list of care managers
   */
  getCMList() {
    const url = this.apiEndPoint + AppApiUrls.CM_URL + "?active=ACTIVE";
    return this.apiHandlerService.get(url);
  } 

  /**
  * Get list of all care managers including active or deactive
  */
  getListAllCM() {
    const url = this.apiEndPoint + AppApiUrls.CM_URL + "/all";
    return this.apiHandlerService.get(url);
  }

  /**
   * Get care manager details by id
   * @param id care manager unique id
   */
  getCMById(id) {
    const url = this.apiEndPoint + AppApiUrls.CM_URL + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.get(url);
  }

  /**
   * Get care manager profile details by id
   * @param id care manager unique id
   */
  getCMProfile(id) {
    const url = this.apiEndPoint + AppApiUrls.CM_URL + AppApiUrls.URL_SEPARATER + "profile/" + id;
    return this.apiHandlerService.get(url);
  }

  /**
   * Function to onboard care manager
   */
  onboardCM(formData) {
    const url = this.apiEndPoint + AppApiUrls.CM_URL;
    return this.apiHandlerService.save(url, formData);
  }


  /**
   * File Upload
   * @param data 
   */
  uploadFile(data){
    const url = this.apiEndPoint 
                + AppApiUrls.CM_URL
                + AppApiUrls.URL_SEPARATER + "upload";
    return this.apiHandlerService.save(url, data);  

  }

  /**
   * To get profile image url
   **/
  getSignedUrl(data){
    const url = this.apiEndPoint 
              + AppApiUrls.CM_URL
                + AppApiUrls.URL_SEPARATER + "download";
    return this.apiHandlerService.save(url, data);
  }


  /**
   * Update profile  
   * @param id, formData
   */
  updateMyProfile(id, formData) {
    const url = this.apiEndPoint 
                + AppApiUrls.CM_URL
                + AppApiUrls.URL_SEPARATER + "updateProfile/"+id;
    return this.apiHandlerService.update(url, formData);
  
  }

  /**
   * Update cm details (Admin portal)  
   * @param id, formData
   */
  updateCM(id, formData) {
    const url = this.apiEndPoint 
                + AppApiUrls.CM_URL
                + AppApiUrls.URL_SEPARATER + "admin/updateProfile/"+id;
    return this.apiHandlerService.update(url, formData);
  
  }



  /**
   * Delete cm
   * @param id user unique id
   */
  deleteRecord(id) {
    const url = this.apiEndPoint 
                + AppApiUrls.CM_URL
                + AppApiUrls.URL_SEPARATER + "status/"+ id + "?active=DELETE";
    return this.apiHandlerService.update(url, "");
  }
}
