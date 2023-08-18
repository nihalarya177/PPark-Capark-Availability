import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {ReactiveFormsModule, FormsModule} from '@angular/forms'
import { RegisterComponent } from './register.component';
import { registerLocaleData } from '@angular/common';
import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http';
import { FlashMessagesService } from 'angular2-flash-messages';
import { isExpressionFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';
const routerSpy = {navigate: jasmine.createSpy('navigate')};
const heroServiceSpy = jasmine.createSpyObj('RegisterComponent', ['setValue']);



describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    TestBed
    .configureTestingModule({
      imports:[ReactiveFormsModule, FormsModule],
      declarations: [RegisterComponent],
      providers: [
        {provide: FormBuilder},
        {provide: HttpClient},
        {provide: HttpHandler},
        {provide: FlashMessagesService},
        {provide: RegisterComponent, useValue: heroServiceSpy},
        {provide: ComponentFixtureAutoDetect, useValue: true}, {provide: Router, useValue: routerSpy}
      ]
    })
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should tell ROUTER to navigate when hero clicked', () => {
    component.setValue('as', 'shakybanjoe@yahoo.com', 'Ds123123123', 'Ds123123123');  // trigger click on first inner <div class="hero">
    expect(component.username).toBe('as');
    let routerSpy = {navigate: jasmine.createSpy('navigate')};
    component.username ='as'
    component.email = 'shakybanjoe@yahoo.com'
    component.password = 'Ds123123123'
    component.confirm_password = 'Ds123123123'
    // args passed to router.navigateByUrl() spy
    fixture.detectChanges();
    expect(component.works).toBe('doesn');
    expect(component.works).toBe('works');

    expect (routerSpy.navigate).toHaveBeenCalledWith('/');
    expect (routerSpy.navigate).toHaveBeenCalledWith(['/register']);

    //change
    // expecting to navigate to id of the component's first hero
  });
});
