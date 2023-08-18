import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/services/validate.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; 
import { FlashMessagesService } from 'angular2-flash-messages';
 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username:string = "";
  email:string = "";
  password:string = "";
  confirm_password:string = "";

  setValue(username:string, email:string, password:string, confirm_password:string){
    const user = {
      username : username,
      email : email,
      password : password,
      confirm_password : confirm_password
    }
    
      
         this.authService.registerUser(user).subscribe((data: string) =>{
           var obj = JSON.parse(data);
           if(obj.success){
            this.flashMessage.show('Registration Complete. You will now be redirected to the Login page', {cssClass: 'alert-success', timeout: 3000});
            this.router.navigate(['/']);

           } else{

             this.flashMessage.show(obj.msg, {cssClass: 'alert-danger', timeout: 3000});
             this.router.navigate(['/register']);
           }

         });
  }

  userForm: FormGroup = new FormGroup({})

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
    ) { 

    this.userForm = fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      conf_password: ['', [Validators.required]],
    }, {
      validator: ConfirmedValidator('password', 'conf_password')
    })
  }

  get f(){
    return this.userForm.controls;
  }

  ngOnInit(): void {
  }
  

  
  
}