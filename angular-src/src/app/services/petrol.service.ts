import { Injectable } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PetrolService {

  constructor(private http: HttpClient) { }
  
  getPetrolStations(){
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json')
    return this.http.get(("/users/petrol"));
  }
  
  setUsers(id, favoriteLocation, lat, lon){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json')
    return this.http.post("/users/update", [id,favoriteLocation, lat, lon]);
  }
  deleteFavLocations(id, favoriteLocation, lat, lon){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json')
    return this.http.post("/users/updateDelete", [id,favoriteLocation, lat, lon]);
  }
  getUser(id){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json')
    return this.http.post("/users/getUser", [id]);

  }
}
