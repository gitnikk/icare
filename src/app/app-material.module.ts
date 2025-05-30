import { NgModule } from "@angular/core";
import { 
  MatTableModule,
  MatFormFieldModule,
  MatSortModule,
  MatPaginatorModule } from '@angular/material';

const MaterialComponents = [
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule
];

@NgModule({
  imports: [ MaterialComponents ],
  exports: [ MaterialComponents ],
  
})
export class AppMaterialModule {}
