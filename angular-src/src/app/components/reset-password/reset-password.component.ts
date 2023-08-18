import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/services/validate.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  password:string = "";
  confirm_password:string = "";
  userForm: FormGroup = new FormGroup({})
  resetToken: String;
  CurrentState: any;
  IsResetFormValid = true;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private route: ActivatedRoute
  ) { 
    this.userForm = fb.group({
      resetToken: [this.resetToken],
      password: ['', [Validators.required, Validators.minLength(8)]],
      conf_password: ['', [Validators.required]],
      
    }, {
      validator: ConfirmedValidator('password', 'conf_password')
    })
    this.CurrentState = 'Wait';
    console.log('test: ',this.route.params);
    this.route.paramMap.subscribe(params => {
      //this.resetToken = params.get('token');
      this.userForm.patchValue({resetToken:  params.get('token')});
      console.log('tok: ', this.resetToken);
      this.VerifyToken();
    });
  }

  get f(){
    return this.userForm.controls;
  }

  ngOnInit(): void {
  }

  VerifyToken() {
    this.authService.ValidPasswordToken({ resettoken: this.resetToken })
  }

  OnSubmitPassword(form){
    console.log(this.userForm.value)
    this.authService.newPassword(this.userForm.value).subscribe((data : string) =>{
      var obj = JSON.parse(data);
      if(obj.success){
        this.flashMessage.show('Password reset Successfully', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate([''])
      } else{
          this.flashMessage.show(obj.msg, {cssClass: 'alert-danger', timeout: 5000});
          
      }
    }) 
  }

}