import { Component, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-catergory-field',
  templateUrl: './catergory-field.component.html',
  styleUrls: ['./catergory-field.component.css']
})

//This catergory component is used to dynamically create new fields for the faculty to label their project during creation
export class CatergoryFieldComponent {
  value: String = ""; //value of the catergory
  type: String = ""; //Todo in future, add ngIfs to create a searchable dropdown for faculty to select majors from.

  constructor(private host: ElementRef<HTMLElement>) { }

  onClick() {
    // Deletes local element then fires the Observable to tell the parent
    this.host.nativeElement.remove();
    this.deleted.emit(null);
  }

  @Output() deleted = new EventEmitter<any>();
  //simply gets the value of the field
  getValue() {
    return this.value;
  }
}
