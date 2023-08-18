import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; 
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.css']
})
export class StartpageComponent implements OnInit {
  username:string = "";
  password:string = "";

  setValue(username:string, password:string){
    const user = {
      username : username,
      password : password
    }

    this.authService.authenticateUser(user).subscribe((data : string) =>{
      var obj = JSON.parse(data);
      if(obj.success){
        this.authService.storeUserData(obj.token, obj.user);
        this.flashMessage.show('You are logged in', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['map'])
      } else{
          this.flashMessage.show(obj.msg, {cssClass: 'alert-danger', timeout: 5000});
          this.router.navigate([''])
      }
    })
    
  }
  
  userForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
    
    ) { 

    this.userForm = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  get f(){
    return this.userForm.controls;
  }

  ngOnInit(): void {
  } 

  onGuestClick(){
    localStorage.clear()
  }
}