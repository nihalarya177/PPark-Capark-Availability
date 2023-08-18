import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email:string = "";


  userForm: FormGroup = new FormGroup({})

  constructor(private fb : FormBuilder, private router : Router, private flashMessage: FlashMessagesService, private authService:AuthService) { 
    this.userForm = fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  get f(){
    return this.userForm.controls;
  }

  ngOnInit(): void {
  }

  OnSubmitEmail(form){
    this.authService.requestReset(this.userForm.value).subscribe((data : string) =>{
      var obj = JSON.parse(data);
      if(obj.success){
        this.flashMessage.show('Reset password link sent to ' + this.userForm.value.email , {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate([''])
      } else{
          this.flashMessage.show(obj.msg, {cssClass: 'alert-danger', timeout: 5000});
          
      }
    }) 
  }

}
