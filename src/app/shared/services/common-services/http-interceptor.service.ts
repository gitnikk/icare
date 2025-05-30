import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHeaders,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { NgxSpinnerService } from 'ngx-spinner';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class HttpInterceptorService implements HttpInterceptor {
  public headers: HttpHeaders;

  count = 0;
  constructor(private spinner: NgxSpinnerService) { 
    this.headers = new HttpHeaders();
  }

  /**
   * This function sets headers to each api request
   */
  setRequestHeaders(): void {
    this.headers = this.headers.append("Access-Control-Allow-Origin", "*");
    // this.headers = this.headers.set('Content-Type', 'application/json');
    // this.headers = this.headers.set('Accept', 'q=0.8;application/json;q=0.9');
    // this.headers = this.headers.set('Accept', 'application/json, */*');
    var authToken="";
    if(!!localStorage.getItem('token')){
      authToken = localStorage.getItem('token')
    }
    this.headers = this.headers.set("Authorization", authToken);
  }

  /**
   * Intercepts the each API request
   * @param request api request to clones
   * @param next handling request
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show()
    this.count++;

    this.setRequestHeaders();
    const apiRequest = request.clone({ headers: this.headers });
    // return next.handle(apiRequest);
    return next.handle(apiRequest)
        .pipe ( tap (
                // event => console.log(event),
                // error => console.log( error )
            ), finalize(() => {
                this.count--;
                if ( this.count == 0 ) this.spinner.hide ()
            })
        );
  }
}
