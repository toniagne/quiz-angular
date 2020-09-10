import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import questionsJson from '../assets/configs.json';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'inove-quiz';
  isLinear = false;
  progress = 0;
  totalSteps = 15;
  questions:any = [];
  questionsTitle = "";
  steps:any = [];
  step2 = 0;
  amount = 0;
  price:any = 0;

  constructor(private httpClient: HttpClient){

    this.questionsTitle = questionsJson.firstStepQuestion;

  }

  ngOnInit(){
    this.httpClient.get("assets/configs.json").subscribe(data =>{
      this.questions = data;
      this.price = data['price'];
      this.questionsTitle = data['0']['title'];
    })
  }


  goBack(stepper: MatStepper, step){
    this.changeResult(0, 0, step);
    stepper.previous();
  }

  goForward(stepper: MatStepper, resp:any, work:any, step:any){    
    this.changeResult(resp, work, step)
    stepper.next();
  }

  changeResult(resp, work, step){
    let calc;

    if (step === 0) { this.steps = []; }
    if (work === 0) {this.steps.splice(step+1, 1);}

    calc = this.price * work;
    this.questionsTitle = this.questions[step];
    this.steps.push({resp:resp, work:work, price: calc});
    this.progress =step *100 / this.totalSteps;
    this.amount = this.calcTotal();

  }

  calcTotal(){
    let total = 0;
    this.steps.forEach(function(item) {
      total += item.price;
  });
return total;
}

}
