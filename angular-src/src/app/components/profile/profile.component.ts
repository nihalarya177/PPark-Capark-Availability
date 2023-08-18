import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import {PetrolService} from '../../services/petrol.service'
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router:Router, public PetrolService: PetrolService) { }
  values = JSON.parse(localStorage.getItem('user'));
  
  onSubmit(){
    this.router.navigate(['map'])
  }

  ngOnInit(): void {
  console.log(this.values);
  }

}
