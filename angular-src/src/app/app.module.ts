import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './component/map/map.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { PetrolService } from '../app/services/petrol.service'
import {HttpClientModule} from '@angular/common/http';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StartpageComponent } from './components/startpage/startpage.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';  
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthService } from './services/auth.service'; 
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetEmailComponent } from './components/reset-email/reset-email.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const approutes : Routes =  [
  {path : 'map', component: MapComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavbarComponent,
    RegisterComponent,
    HomepageComponent,
    ProfileComponent,
    DashboardComponent,
    StartpageComponent,
    SidebarComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ResetEmailComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(approutes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDGjj3BV0BV-98KQdVzdHCw7t1wDXQf_9A&libraries=places'
    }),
    AgmDirectionModule,
    HttpClientModule,
    AgmSnazzyInfoWindowModule,
    ReactiveFormsModule,
    FlashMessagesModule,
    HttpClientModule
  ],
  providers: [AuthService, FlashMessagesService, PetrolService],
  bootstrap: [AppComponent]
})
export class AppModule { }
