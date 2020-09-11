import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {MatDialog} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MailDialogComponent} from './contents/mail-dialog/mail-dialog.component';
import questionsJSON from '../assets/configs.json';
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
  questions:any = [];
  questionsTitle = '';
  questionsHelper = '';
  steps: any = [];
  step2 = 0;
  amount = 0;
  price: any = 0;

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
    this.changeResult(0, 0, step);
    stepper.previous();
  }

// VAI PARA PRÓXIMA PERGUNTA
  goForward(stepper: MatStepper, resp:any, work:any, step:any){
    this.changeResult(resp, work, step)
    stepper.next();
  }

// TRANSFORMA OS VALORES
  changeResult(resp, work, step){

    const calc = this.price * work;
    let varQuestionTitle;
    let varQuestionHelper;

    if (step === 0) { this.steps = []; }

    if (work === 0) {
      this.steps.splice(step, 1);
    } else {
      this.steps.push({resp: resp, work: work, price: calc});
    }

    if (this.totalSteps === step){
      varQuestionTitle  = 'Final';
      varQuestionHelper = '';
      this.final = true;
    } else {
      varQuestionTitle  = this.questions.quiz[step].title;
      varQuestionHelper = this.questions.quiz[step].helper;
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
      console.log(`Dialog result: ${result}`);
    });
  }

}
