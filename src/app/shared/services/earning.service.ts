import { Injectable } from '@angular/core';
import { ApiEndPoint } from '../config/api-endpoint.config';
import { AppApiUrls } from '../enums/app-api-urls.enum';
import { ApiRequestWrapperService } from './common-services/api-request-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class EarningService {
  private apiEndPointConfig: ApiEndPoint;
  private apiEndPoint: string;
  
  constructor(private apiHandlerService: ApiRequestWrapperService) {
    this.apiEndPointConfig = new ApiEndPoint();
    this.apiEndPoint = this.apiEndPointConfig.getGeneratedApiEndpoint('earning');
  }

  /**
   * Get list of Payments
   */
  getPaymentList() {
    const url = this.apiEndPoint + AppApiUrls.EARNING_SERVICE_URL + "/all";
    return this.apiHandlerService.get(url);
  }

  /**
   * Function to add new earning
   * @param formData - earnings form data
   */
  addEarning(formData) {
    const url = this.apiEndPoint + AppApiUrls.EARNING_SERVICE_URL + "/add";
    return this.apiHandlerService.save(url, formData);
  }

  /**
   * Function to update earning
   * @param formData - earnings form data
   */
  updateEarning(id, formData) {
    const url = this.apiEndPoint + AppApiUrls.EARNING_SERVICE_URL + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.update(url, formData);
  }

  /**
   * Delete record
   * @param id user unique id
   */
  deleteRecord(id) {
    const url = this.apiEndPoint 
                + AppApiUrls.EARNING_SERVICE_URL + AppApiUrls.URL_SEPARATER + id;
    return this.apiHandlerService.delete(url);
  }

}
