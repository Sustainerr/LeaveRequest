import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss']
})
export class ModifyComponent implements OnInit {
  leaveForm: FormGroup;
  conge_Id: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.conge_Id = data.conge_Id;  // Store conge_Id for later use
    this.leaveForm = this.fb.group({
      dateDebut: [this.formatDate(data.date_Debut), Validators.required],
      dateFin: [this.formatDate(data.date_Fin), Validators.required],
    });
  }

  ngOnInit(): void {}

  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      this.dialogRef.close({
        conge_Id: this.conge_Id,  // Include conge_Id in the result
        ...this.leaveForm.value
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
