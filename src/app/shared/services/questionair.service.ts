import { Injectable } from '@angular/core';
import { AppApiUrls } from "../enums/app-api-urls.enum";
import { ApiEndPoint } from 'src/app/shared/config/api-endpoint.config';
import { ApiRequestWrapperService } from './common-services/api-request-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionairService {

  private apiEndPointConfig: ApiEndPoint;
  private apiEndPoint: string;

  constructor(private apiHandlerService: ApiRequestWrapperService) {
    this.apiEndPointConfig = new ApiEndPoint();
    this.apiEndPoint = this.apiEndPointConfig.getGeneratedApiEndpoint('questionair');
  }


  /**
   * Get Questionair by service category id 
   * @param id service_category unique id
   */
  getQuestionair(id) {
    const url = this.apiEndPoint 
                + AppApiUrls.QUESTIONAIR_URL
                + AppApiUrls.URL_SEPARATER + "category" 
                + AppApiUrls.URL_SEPARATER + id;
    // const url = "./assets/data.json";
    return this.apiHandlerService.get(url);
  }
}
