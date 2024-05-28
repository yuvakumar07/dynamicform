import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormConfigService } from '../form-config.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  formConfig: any;
  formValue: any;
  
  constructor(private fb: FormBuilder, private formConfigService: FormConfigService) {}

  ngOnInit(): void {

    this.formConfigService.getFormConfig().subscribe(config => {

      this.formConfig = config;

      this.createForm(config.pages[0].sections[0].subsections[0].questions);

      this.form.valueChanges.subscribe(value => {
        this.formValue = value;
      });

    });

  }

  createForm(questions: any[]): void {

    questions.forEach(question => {

      const validators = [];

      if (question.validationRules?.required) {
        validators.push(Validators.required);
      }
      if (question.validationRules?.maxLength) {
        validators.push(Validators.maxLength(question.validationRules.maxLength));
      }

      this.form.addControl(
        question.id,
        new FormControl({ value: '', disabled: !question.enabled }, validators)
      );

    });

  }

  onSubmit(): void {
    console.log(this.form.value);
  }

}
