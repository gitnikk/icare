import { Injectable } from '@angular/core';
import { ApiEndPoint } from '../../config/api-endpoint.config';
import { AppApiUrls } from '../../enums/app-api-urls.enum';
import { ApiRequestWrapperService } from './api-request-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class SharedApiService {

  private apiEndPointConfig: ApiEndPoint;
  private apiEndPoint: string;

  constructor(private apiHandlerService: ApiRequestWrapperService) {
    this.apiEndPointConfig = new ApiEndPoint();
    this.apiEndPoint = this.apiEndPointConfig.getGeneratedApiEndpoint('shared');
  }

  /**
   * Get Category & subcategory nested list
   * /api/category
   */
  getServiceCategory(){
    const url = this.apiEndPoint + AppApiUrls.SERVICE_CATEGORY_URL
    return this.apiHandlerService.get(url);
  }

  /**
   * Get Single category details including subcategory list
   * /api/category/id/<id>
   */
  getServiceCategoryDetails(id){
    const url = this.apiEndPoint + AppApiUrls.SERVICE_CATEGORY_URL + AppApiUrls.URL_SEPARATER + "id/" + id;
    return this.apiHandlerService.get(url);
  }
}
