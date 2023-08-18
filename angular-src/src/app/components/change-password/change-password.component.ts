import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/services/validate.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  password:string = "";
  confirm_password:string = "";
  userForm: FormGroup = new FormGroup({})
  resetToken: string;
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
    }),
    this.userForm.patchValue({resetToken: this.values  });
    
  }

  values = JSON.parse(localStorage.getItem('user'));
  
  get f(){
    return this.userForm.controls;
  }

  ngOnInit(): void {
    
  }

  

  OnSubmitPassword(form){
    console.log("v: ", this.userForm.value);
    this.userForm.patchValue({resetToken: this.values });
    console.log("vr: ", this.userForm.value.resetToken);
    this.authService.changePassword(this.userForm.value).subscribe((data : string) =>{
      var obj = JSON.parse(data);
      if(obj.success){
        this.flashMessage.show('Password reset Successfully', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['/prof'])
      } else{
          this.flashMessage.show(obj.msg, {cssClass: 'alert-danger', timeout: 5000});
          
      }
    }) 
  }

}