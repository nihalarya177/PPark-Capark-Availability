import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/services/validate.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-reset-email',
  templateUrl: './reset-email.component.html',
  styleUrls: ['./reset-email.component.css']
})
export class ResetEmailComponent implements OnInit {
  email:string = "";
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
      email: ['', [Validators.required, Validators.email]]
      
    }),
    this.userForm.patchValue({resetToken: this.values  });
    
  }

  get f(){
    return this.userForm.controls;
  }

  values = JSON.parse(localStorage.getItem('user'));
  

  ngOnInit(): void {
    console.log("v: ", this.values)
  }

  OnSubmitEmail(form){
    console.log("r: ", this.userForm.value)
    this.authService.changeEmail(this.userForm.value).subscribe((data : string) =>{
      var obj = JSON.parse(data);
      if(obj.success){
        this.authService.updateUserData(obj.userData);
        this.flashMessage.show('Email Reset Successfully ' , {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['/prof'])
      } else{
          this.flashMessage.show(obj.msg, {cssClass: 'alert-danger', timeout: 5000});
          
      }
    }) 
  }

}