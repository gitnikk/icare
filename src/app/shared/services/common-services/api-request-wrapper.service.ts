import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApiRequestWrapperService {
  constructor(private httpClient: HttpClient) {}

  /**
   *
   * @param url Executes GET api
   */
  get(url: string): Observable<any> {
    return this.httpClient.get(url, { observe: "response" }).pipe(
      tap(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      )
    );
  }

  /**
   *
   * @param url Execites POST api
   * @param data
   */
  save(url: string, data: any): Observable<any> {
    return this.httpClient.post(url, data, { observe: "response" }).pipe(
      tap(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      )
    );
  }

  /**
   *
   * @param url Executes PUT api
   * @param data
   */
  update(url: string, data: any): Observable<any> {
    return this.httpClient.put(url, data, { observe: "response" }).pipe(
      tap(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      )
    );
  }

  /**
   *
   * @param url Executes DELETE api
   */
  delete(url: string): Observable<any> {
    return this.httpClient.delete(url, { observe: "response" }).pipe(
      tap(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      )
    );
  }

  /**
   * Handles api response
   * @param response
   */
  handleResponse(response) {
    if (response.status === 204) {
      return {};
    } else {
      return response.body;
    }
  }

  /**
   * Handles api error
   * @param error
   */
  handleError(error: HttpErrorResponse) {
    if (error.status == 401) {
      return Observable.throw(error.error);
    } else if (error.status == 500) {
      return Observable.throw(error.error);
    } else if (error.status === 403) {
      return Observable.throw(error);
    } else {
      return Observable.throw(
        error.error || "Something has gone wrong. Please contact support."
      );
    }
  }
}
