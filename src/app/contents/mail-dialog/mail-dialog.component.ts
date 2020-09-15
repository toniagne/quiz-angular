import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppComponent} from '../../app.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Contact} from '../mail-alert/contact.model';


@Component({
  selector: 'app-mail-dialog',
  templateUrl: './mail-dialog.component.html',
  styleUrls: ['./mail-dialog.component.css']
})
export class MailDialogComponent implements OnInit {
  formGroup: FormGroup;
  hasFormErrors = false;
  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    private userFB: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Contact) {}

  ngOnInit(): void {
    this.formGroup = this.userFB.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.hasFormErrors = false;
    const controls = this.formGroup.controls;

    if (this.formGroup.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;
      return;
    }
    this.dialogRef.close(this.prepareUser());
  }

  prepareUser(): any {
    const controls = this.formGroup.controls;
    // tslint:disable-next-line:variable-name
    const _services: any = [];
    _services.name = controls.name.value;
    _services.email = controls.email.value;
    _services.phone = controls.phone.value;
    _services.subject = controls.subject.value;
    _services.message = controls.message.value;
    return _services;
  }

}
