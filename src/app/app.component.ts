import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {MatDialog} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MailDialogComponent} from './contents/mail-dialog/mail-dialog.component';
import questionsJSON from '../assets/configs.json';
import { MailAlertComponent } from './contents/mail-alert/mail-alert.component';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'inove-quiz';
  isLinear = false;
  final = false;
  progress = 0;
  totalSteps = 0;
  questions: any = [];
  questionsTitle = '';
  questionsHelper = '';
  steps: any = [];
  step2 = 0;
  amount = 0;
  price: any = 0;
  formGroup: FormGroup;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;

  constructor(
    private httpClient: HttpClient,
    public dialog: MatDialog
  ){}

  ngOnInit(){
    
    this.httpClient.get('../assets/configs.json').subscribe(
      val => {
        this.questions = val;
      },
      response => {
        console.log('PUT call in error', response);
      },
      () => {
        this.totalSteps = this.questions.quiz.length;
        this.price = this.questions.price;
        this.questionsTitle = this.questions.quiz['0'].title;
        this.questionsHelper = this.questions.quiz['0'].helper;
      }
    );
  }

// RETORNA PARA QUESTÃO ANTERIOR
  goBack(stepper: MatStepper, step){
    const currentBack = step <=2 ? 0 : step;
    this.changeResult(0, 0, currentBack);
    stepper.selectedIndex = currentBack;
  }

// VAI PARA PRÓXIMA PERGUNTA
  goForward(stepper: MatStepper, resp: any, question: any, work: any, step: any, target: any){
    const currentStep = target ? target : step;
    this.changeResult(resp, work, currentStep, question);
    stepper.selectedIndex = currentStep;
  }

// TRANSFORMA OS VALORES
  changeResult(resp, work, step, query = null){

    const calc = this.price * work;
    let varQuestionTitle;
    let varQuestionHelper;

    if (step === 0) { this.steps = []; }

    if (this.totalSteps === step){
      varQuestionTitle  = 'Final';
      varQuestionHelper = '';
      this.final = true;
    } else {
      varQuestionTitle  = this.questions.quiz[step].title;
      varQuestionHelper = this.questions.quiz[step].helper;
    }

    if (work === 0) {
      this.steps.splice(step -1, 1);
    } else {
      this.steps.push(
        {
          question: resp, query, work, price: calc
        });
    }
    this.questionsTitle = varQuestionTitle;
    this.questionsHelper = varQuestionHelper;
    this.progress = step * 100 / this.totalSteps;
    this.amount = this.calcTotal();

  }

// CALCULA O VALOR TOTAL
  calcTotal(){
      let total = 0;
      this.steps.forEach(function(item) {
        total += item.price;
    });
      return total;
  }

  openDialog() {
    const dialogRef = this.dialog.open(MailDialogComponent, {
      data: {name: this.name, phone: this.phone, email: this.email, subject: this.subject, message: this.message},
      width: '550px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result){
        this.sendMail({
          itens: this.steps, amount: this.amount,
          formData: {
            name: result.name,
            email: result.email,
            phone: result.phone,
            subject: result.subject,
            message: result.message
          }
        });
      }
    });
  }

  sendMail(formdata: any) {
    console.log(formdata);
    const httpHeaders = new HttpHeaders();
    return this.httpClient.post<any>('api/index.php', formdata, {headers: httpHeaders}).subscribe(
      result => {
        const dialogRef = this.dialog.open(MailAlertComponent, {
          width: '550px'
        });
      }
    );
  }

}
