import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  yearList = [];
  sectorList = [];
  ownershipList = [];
  jobTitleList = [];
  jobSeniorityList = []
  predictFlag = false;
  predictMessege: string;

  predictErrFlag = false;
  predictErrMessege: string;

  constructor(private fb: FormBuilder, private appService: AppService) {
    for (let i = (new Date()).getFullYear(); i > ((new Date()).getFullYear() - 80); i--) {
      this.yearList.push(i)
    }
    this.sectorList = ['Business Services', 'Information Technology', 'Biotech & Pharmaceuticals', 'Others'];
    this.ownershipList = ['Public', 'Private', 'Others'];
    this.jobTitleList = ['data scientist', 'software engineer', 'Others'];
    this.jobSeniorityList = ['jr', 'sr', 'other']
    this.predictMessege = '';
  }

  ngOnInit() {
    this.form = this.fb.group({
      rating: ["", Validators.required],
      founded: ["", Validators.required],
      competitors: ["", Validators.required],
      sector: ["", Validators.required],
      ownership: ["", Validators.required],
      job_title: ["", Validators.required],
      job_seniority: ["", Validators.required],
      job_in_headquarters: [false],
      job_skills_sql: [false],
      job_skills_tableau: [false],
      job_skills_python: [false],
      job_skills_excel: [false]
    });
  }
  save() {
    if (this.form.valid) {
      var obj = {
        rating: this.validateNumber(this.form.get('rating').value),
        founded: this.form.get('founded').value,
        competitors: this.validateNumber(this.form.get('competitors').value),
        sector: this.form.get('sector').value,
        ownership: this.form.get('ownership').value,
        job_title: this.form.get('job_title').value,
        job_seniority: this.form.get('job_seniority').value,
        job_in_headquarters: (this.form.get('job_in_headquarters').value ? 1 : 0),
        job_skills: this.jobSkillList(this.form.get('job_skills_sql').value, this.form.get('job_skills_tableau').value, this.form.get('job_skills_python').value, this.form.get('job_skills_excel').value)
      }
      console.log(obj)
      this.appService.getPrediction(obj).subscribe(x => {
        this.predictMessege = 'predicted salary - ' + x['min_salary'] + ' to ' + x['max_salary']
        this.predictFlag = true;
      })
    } else {
      this.predictErrMessege = 'Provide all the data';
      this.predictErrFlag = true;
    }
  }

  jobSkillList(job_skills_sql, job_skills_tableau, job_skills_python, job_skills_excel) {
    var skillList = [];
    if (job_skills_sql) {
      skillList.push('sql')
    }
    if (job_skills_tableau) {
      skillList.push('tableau')
    }
    if (job_skills_python) {
      skillList.push('python')
    }
    if (job_skills_excel) {
      skillList.push('excel')
    }
    return skillList;
  }

  validateNumber(text) {
    var num = Number(text);

    return num;
  }

  close() {
    this.predictFlag = false;
    this.form.reset();
    this.predictMessege = '';
  }

  closeErr() {
    this.predictErrFlag = false;
    this.predictErrMessege = '';
  }
}
