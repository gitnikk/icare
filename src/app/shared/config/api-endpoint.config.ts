import { environment } from 'src/environments/environment';

export class ApiEndPoint {
  constructor() {}

  private apiEndpoint:string = environment.apiEndpoint;

  private servicePort = 
  {
    "signin": environment.signinService,
    "admin" : environment.adminService,
    "patient" : environment.patientService,
    "doctor" : environment.doctorService,
    "caremanager" : environment.caremanagerService,
    "questionair" : environment.questionairService,
    "shared" : environment.sharedService,
    "case" : environment.caseService,
    "earning" : environment.earningService
  }
    

  getGeneratedApiEndpoint(service) {
    switch(service){
      case 'signin':
        return this.apiEndpoint + this.servicePort.signin;
      break;
      case 'admin':
        return this.apiEndpoint + this.servicePort.admin;
      break;
      case 'patient':
        return this.apiEndpoint + this.servicePort.patient;
      break;
      case 'doctor':
        return this.apiEndpoint + this.servicePort.doctor;
      break;
      case 'caremanager':
        return this.apiEndpoint + this.servicePort.caremanager;
      break;
      case 'questionair':
        return this.apiEndpoint + this.servicePort.questionair;
      break;        
      case 'shared':
        return this.apiEndpoint + this.servicePort.shared;
      break;        
      case 'case':
        return this.apiEndpoint + this.servicePort.case;
      break;        
      case 'earning':
        return this.apiEndpoint + this.servicePort.earning;
      break;        
    }
  }

}
