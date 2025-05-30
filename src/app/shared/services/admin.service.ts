import { Injectable } from "@angular/core";
import { ApiRequestWrapperService } from "./common-services/api-request-wrapper.service";
import { AppApiUrls } from "../enums/app-api-urls.enum";
import { ApiEndPoint } from "../config/api-endpoint.config";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private apiEndPointConfig: ApiEndPoint;
  private apiEndPoint: string;

  constructor(private apiHandlerService: ApiRequestWrapperService) {
    this.apiEndPointConfig = new ApiEndPoint();
    this.apiEndPoint = this.apiEndPointConfig.getGeneratedApiEndpoint('admin');
  }

  /**
   * Get admin profile details by id
   * @param id doctor unique id
   */
  getAdminProfile(id) {
    const url = this.apiEndPoint + AppApiUrls.ADMIN_URL + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.get(url);
  }



  /**
   * File Upload
   * @param data 
   */
  uploadFile(data){
    const url = this.apiEndPoint 
                + AppApiUrls.ADMIN_URL
                + AppApiUrls.URL_SEPARATER + "upload";
    return this.apiHandlerService.save(url, data);  

  }

  /**
   * To get profile image url
   **/
  getSignedUrl(data){
    const url = this.apiEndPoint 
              + AppApiUrls.ADMIN_URL
                + AppApiUrls.URL_SEPARATER + "download";
    return this.apiHandlerService.save(url, data);
  }


  /**
   * Update profile  
   * @param id, formData
   */
  updateMyProfile(id, formData) {
    const url = this.apiEndPoint 
                + AppApiUrls.ADMIN_URL
                + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.update(url, formData);
  
  }
}
