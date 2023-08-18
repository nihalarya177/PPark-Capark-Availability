import { createInjectableDefinitionMap } from '@angular/compiler/src/render3/partial/injectable';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild,NgZone, Renderer2 } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import {PetrolService} from '../../services/petrol.service'
import { AuthService } from '../../services/auth.service';
import {AgmDirectionModule} from 'agm-direction';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { InterpolationConfig } from '@angular/compiler/src/ml_parser/interpolation_config';
import { FlashMessagesService } from 'angular2-flash-messages';
declare var SVY21: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  JSON_MAP_STYLES = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#2396c7"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ee9417"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4abf65"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#c2c2c2"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#00b3ff"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ]

  Styles:google.maps.MapTypeStyle[] = [];



  title: string = 'AGM project';
  latitude: number = 1.3521;
  longitude: number = 103.8198;
  public finalCarparkList: any = [];
  public finalCarparkList1: any = [];
  x: number = 0;
  y: number = 0;
  zoom: number = 10;
  address: string = "Loading";
  private geoCoder: any;
  public origin: any;
  public origin5: any;
  saveLocation: any;
  public destination: any;
  arrFavLocations: any = [];
  filter: any = 'all';
  selectedOption : any;
  markerOption: any;
  renderOptions: any;
  showButton: Boolean = false;
  directionVisible: boolean= false;
  starIsBlack: boolean = false;
  favLocationsArray: any = [];
  latArray: any = [];
  lonArray: any = [];  
  values = JSON.parse(localStorage.getItem('user'));
  correctIndex: number;
  //map: any;
  @ViewChild('search', { static: false }) public searchElementRef: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('map', { static: false }) public map: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('main', { static: false }) public main: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('mySidebar', { static: false }) public mySidebar: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('openNav', { static: false }) public openNav: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('changeBackgroundColorOfMainText', { static: false }) public changeBackground: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('changeDirectionToReset', { static: false }) public changeDirection: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('demoAcc', {static: false}) public demoAcc: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('wrapper') public wrapper: ElementRef<HTMLInputElement> = {} as ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private router: Router,
    private ngZone: NgZone, private PetrolService: PetrolService, private authService: AuthService, private flashMessage: FlashMessagesService , private renderer: Renderer2) {  
    
 }

  ngOnInit(): void {
    this.JSON_MAP_STYLES.forEach((style: any) => {
      this.Styles.push(style);
    }
    );
    if(this.values!=null)
    this.PetrolService.getUser(this.values.id).subscribe((userData: any) =>{
      this.favLocationsArray =userData.user.favoriteLocation;
      this.latArray  = userData.user.lat;
      this.lonArray = userData.user.lon;
      console.log(this.favLocationsArray);
      if(this.favLocationsArray.includes(this.address)){
      this.starIsBlack = true;
    }
    else{
      this.starIsBlack = false;
    }
   });
    
    console.log(this.values);
    this.mapsAPILoader.load().then(() => {
      //ADD THIS IN LATER
      this.setCurrentLocation();
  
 
          
          let autocomplete = new window['google']['maps']['places']['Autocomplete'](this.searchElementRef.nativeElement, {
          });
          autocomplete.setComponentRestrictions({
            country: ["sg"],
          });
          autocomplete.addListener("place_changed", () => {
            console.log('Hello in places');
            this.ngZone.run(() => {
              this.finalCarparkList = []
              this.finalCarparkList1 = []
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    
              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
    
              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              
              this.longitude = place.geometry.location.lng();
              this.zoom = 15;
              this.address = autocomplete.getPlace().formatted_address;
              if(this.favLocationsArray.includes(this.address)){
                this.starIsBlack = true;
              }
              else{
                this.starIsBlack = false;
              }
              this.ngAfterViewInit();
            //END OF FETCH OF ALL CARPARKS
     
    
    });
  });
})

      
    
    
  }
  

ngAfterViewInit() : void{

  fetch("https://api.data.gov.sg/v1/transport/carpark-availability", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site"
    },
    "referrer": "http://localhost:3000/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  }).then(response=>{
    response.json().then(data =>{
  fetch(`https://data.gov.sg/api/action/datastore_search?limit=5000&resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c`
  ).then(response=>{
    response.json().then(locdata => {
    this.PetrolService.getPetrolStations().subscribe((data1: any)=>{
        var allData = data1.petrol;
    latitude = this.latitude
    longitude = this.longitude
    console.log(allData);

        var updatedPetrolList: any = [];//Should be petrol lol
        var x = 0;
        for(x; x<allData.length; x+=1){
          //ORIGIN AND DESTINATION
                //CONVERT TO LAT LNG
          var cv = new SVY21();
          var lat = allData[x].latitude;
      var lon = allData[x].longitude;
      // Computing Lat/Lon from SVY21        
        const R = 6371e3; // metres
    const φ1 = lat * Math.PI/180; // φ, λ in radians
    const φ2 = latitude * Math.PI/180;
    const Δφ = (latitude-lat) * Math.PI/180;
    const Δλ = (longitude-lon) * Math.PI/180;
    
            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var updatedParking: any = [];

    const d = (R * c)/1000; // in kmetres
    updatedPetrolList.push([allData[x].address, lat, lon, this.latitude, this.longitude, d, allData[x].petrol_pump]);
      }
      updatedPetrolList.sort(sortFunction);
        var count = 0;
    
    const service = new google.maps.DistanceMatrixService();   
    //Carparks and all the local data
    console.log(data.items);
    var allCarparks = locdata.result.records;
    var updatedCarparkList: any = [];
    var destinationSelected: google.maps.LatLng;
    var addressList: any = [];
    //Go through the loop to calcular distance
    
    var i = 0;
    var dataOfCarparks = data.items[0].carpark_data
    for(var x = 0; x<dataOfCarparks.length; x++){
      for(var a =0; a<allCarparks.length; a++){
        if(dataOfCarparks[x].carpark_number == allCarparks[a].car_park_no){
          allCarparks[a]['lots_available'] = dataOfCarparks[x].carpark_info[0].lots_available

        }
      }
    }
    console.log(allCarparks);
    for(i; i<allCarparks.length; i+=1){
      //ORIGIN AND DESTINATION
            //CONVERT TO LAT LNG
      var cv = new SVY21();
      var lat = allCarparks[i].x_coord;
  var lon = allCarparks[i].y_coord;
  // Computing Lat/Lon from SVY21
  var resultLatLon = cv.computeLatLon(lon, lat);
  	
    const R = 6371e3; // metres
const φ1 = resultLatLon.lat * Math.PI/180; // φ, λ in radians
const φ2 = latitude * Math.PI/180;
const Δφ = (latitude-resultLatLon.lat) * Math.PI/180;
const Δλ = (longitude-resultLatLon.lon) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

const d = (R * c)/1000; // in kmetres
if(updatedCarparkList.length==0 || !addressList.includes(allCarparks[i].address))
  updatedCarparkList.push([allCarparks[i].address, resultLatLon.lat, resultLatLon.lon, this.latitude, this.longitude, d, allCarparks[i].lots_available]);
  addressList.push(allCarparks[i].address);      
  }
  updatedCarparkList.sort(sortFunction);

function sortFunction(updatedCarparkList: any, updatedCarparkList2: any) {
    if (updatedCarparkList[5] === updatedCarparkList2[5]) {
        return 0;
    }
    else {
        return (updatedCarparkList[5] < updatedCarparkList2[5]) ? -1 : 1;
    }
}
  var count = 0;
  var parkingCounter = 0;
  this.finalCarparkList = [];
  this.finalCarparkList1 = [];
    var finalCarparkList = this.finalCarparkList;
    var finalCarparkList1 = this.finalCarparkList1;
  for(var x = 0; x < 10; x++){
    if(updatedPetrolList[x][5]<3 && (this.filter == ('all')|| this.filter == ('petrol'))){
      const origin1= new google.maps.LatLng(updatedPetrolList[x][1], updatedPetrolList[x][2]);
      var destinationA = new google.maps.LatLng(updatedPetrolList[x][3], updatedPetrolList[x][4]);
      destinationSelected = destinationA;
  
        //console.log(destinationA);
        
          //console.log(i);
        service.getDistanceMatrix({
      //const request = {
        origins: [origin1],
        destinations: [destinationA],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }, callback);
      async function callback(response: any, status: any){
        if(status == 'OK'){
        var resp = JSON.stringify(response.rows);
        var latCarpark = updatedPetrolList[parkingCounter][1];
        var lonCaprk = updatedPetrolList[parkingCounter][2];
        var nameOfPetrolStation = updatedPetrolList[parkingCounter][6]
        parkingCounter++;
        var respString = JSON.parse(resp);
        respString = respString[0].elements[0];
        
        finalCarparkList.push([ response.destinationAddresses[0], response.originAddresses[0], latitude, longitude, respString.distance.text, respString.distance.value, respString.duration.text, respString.duration.value, nameOfPetrolStation, latCarpark, lonCaprk, 'Petrol Station', '../../assets/fuel.png'])
        finalCarparkList1.push([ response.destinationAddresses[0], response.originAddresses[0], latitude, longitude, respString.distance.text, respString.distance.value, respString.duration.text, respString.duration.value, nameOfPetrolStation, latCarpark, lonCaprk, 'Petrol Station', '../../assets/fuel.png'])
  
      }
        else{
          console.log(status);
        }
      }

    }
  }
    for(var x = 0; x < 10; x++){
      if((this.filter == ('all') || this.filter == 'carpark')){  
    const origin1= new google.maps.LatLng(updatedCarparkList[x][1], updatedCarparkList[x][2]);
    var destinationA = new google.maps.LatLng(updatedCarparkList[x][3], updatedCarparkList[x][4]);
    destinationSelected = destinationA;

      //console.log(destinationA);
      
        //console.log(i);
      service.getDistanceMatrix({
    //const request = {
      origins: [origin1],
      destinations: [destinationA],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    }, callback);

    
    // Get Distance Matrix Response
    
    latitude = latitude;
    longitude = longitude;
    //console.log(i)
    //setTimeout(getDistance, 2000);
    var filter = this.filter;
    
    async function callback(response: any, status: any){
      if(status == 'OK'){
      var resp = JSON.stringify(response.rows);
      var lots_available = parseInt(updatedCarparkList[count][6]);
      var latCarpark = updatedCarparkList[count][1];
      var lonCaprk = updatedCarparkList[count][2];
      count++;
      var respString = JSON.parse(resp);
      respString = respString[0].elements[0];
      
      finalCarparkList.push([ response.destinationAddresses[0], response.originAddresses[0], latitude, longitude, respString.distance.text, respString.distance.value, respString.duration.text, respString.duration.value, lots_available, latCarpark, lonCaprk, 'Lots Available', '../../assets/parking.png'])
      finalCarparkList1.push([ response.destinationAddresses[0], response.originAddresses[0], latitude, longitude, respString.distance.text, respString.distance.value, respString.duration.text, respString.duration.value, lots_available, latCarpark, lonCaprk, 'Lots Available', '../../assets/parking.png']);
      if(count == 10){
        finalCarparkList.sort(sortFunction);
        function sortFunction(finalCarparkList: any, finalCarparkList2: any) {
            if (finalCarparkList[5] === finalCarparkList2[5]) {
                return 0;
            }
            else {
                return (finalCarparkList[5] < finalCarparkList2[5]) ? -1 : 1;
            }
        }
        
        return finalCarparkList;
      }
    }
      else{
        console.log(status);
      }
    }  
  }
}
    //END OF FOR LOOP 
      //CONVERT ADDRESS TO LAT AND LNG
      var latitude = this.latitude;
      var longitude = this.longitude;   
    });
      });
    });
  });
});
    
}


/*autocompleteFav(textForChanged){
  this.mapsAPILoader.load().then(() => {
    //ADD THIS IN LATER


        
        let autocomplete = new window['google']['maps']['places']['Autocomplete'](this.searchElementRef.nativeElement, {
          types: ["address"]
        });
        var request = {
          query: 'Museum of Contemporary Art Australia',
          fields: ['name', 'geometry'],
        };
      
        var service = new google.maps.places.PlacesService(this.map.nativeElement);
        service.findPlaceFromQuery(request, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
            }
            console.log(results[0])
          }
        });
        this.renderer.setProperty(this.searchElementRef.nativeElement, 'value', textForChanged);
        autocomplete.addListener("value", () => {
          this.renderer.setProperty(this.searchElementRef.nativeElement, 'value', textForChanged);

          this.ngZone.run(() => {
            this.finalCarparkList = []
            this.finalCarparkList1 = []
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
  
            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            
            this.longitude = place.geometry.location.lng();
            this.zoom = 14;
            this.address = autocomplete.getPlace().formatted_address;
            if(this.favLocationsArray.includes(this.address)){
              this.starIsBlack = true;
            }
            else{
              this.starIsBlack = false;
            }
            this.ngAfterViewInit();
          //END OF FETCH OF ALL CARPARKS
          })
        })
      })
}*/


favLocations($event: any){// Set Locations
  this.starIsBlack = !this.starIsBlack;  
  console.log(this.starIsBlack);
  if(this.starIsBlack == true){
  var values = JSON.parse(localStorage.getItem('user'));
  console.log(values);
  console.log(this.address);
  this.PetrolService.setUsers(values.id, this.address, this.latitude, this.longitude).subscribe((data1: any)=>{
  console.log(data1);
  this.PetrolService.getUser(values.id).subscribe((userData: any) =>{
    this.favLocationsArray =userData.user.favoriteLocation;
    this.latArray = userData.user.lat;
    this.lonArray = userData.user.lon;
    console.log(this.favLocationsArray);
    if(this.favLocationsArray.includes(this.address)){
    this.starIsBlack = true;
  }
  else{
    this.starIsBlack = false;
  }
})
  })
}
else{
  this.deleteFavLocations($event);
}
  //var lat = $event.srcElement.value
}

deleteFavLocations($event: any){
  var values = JSON.parse(localStorage.getItem('user'));
  console.log(this.address, this.latitude, "longitude", this.longitude);

  this.PetrolService.deleteFavLocations(values.id, this.address, this.latitude, this.longitude).subscribe((data1: any)=>{
  console.log(data1);
  this.PetrolService.getUser(values.id).subscribe((userData: any) =>{
    this.favLocationsArray =userData.user.favoriteLocation;
    this.latArray = userData.user.lat; 
    this.lonArray = userData.user.lon;
    console.log(this.favLocationsArray);
    if(this.favLocationsArray.includes(this.address)){
    this.starIsBlack = true;
  }
  else{
    this.starIsBlack = false;
  }
})
  })
}
setCurrentLocationFromButton(index: any) {
  console.log(this.latArray);
  console.log(this.lonArray);
  this.latitude = this.latArray[index];
  this.longitude = this.lonArray[index];
  this.address = this.favLocationsArray[index];
  console.log(this.address, this.latitude, this.longitude);
  if(this.favLocationsArray.includes(this.address)){
    console.log("in fav loc");
    this.starIsBlack = true;
  }
  else{
    this.starIsBlack = false;
  }
  this.zoom = 15;
  this.ngAfterViewInit();
}
private setCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.zoom = 15;
      console.log(this.latitude, this.longitude);
      this.getAddress(position.coords.latitude, position.coords.longitude);
      this.ngAfterViewInit();
    });
  }
}

onLogout(){
  this.authService.logout();
  this.flashMessage.show('You have been logged out', { cssClass: 'alert-success', timeout: 3000})
  this.router.navigate(['/'])
  
}

changeDirections(destinationSelected: any, distance: any, additionalText: any, latCarpark: any, lonCaprk: any, destinationLat:any, destinationLon:any, text: any, asset: any){
  console.log(destinationSelected);
  const replaced = asset.replaceAll(`'`, `"`);
  var arrayOfStringLabel = [destinationSelected, 'Distance: ', distance, text, additionalText]
  const textFull = arrayOfStringLabel.join(' ');
  this.origin = { 
        lat: (latCarpark), 
        lng: (lonCaprk)
      };
      this.destination = { 
      lat: (destinationLat), 
      lng: (destinationLon)
      };
      this.renderOptions = {
        suppressMarkers: true,
      }
      this.markerOption = {
        destination: {
        icon: asset,
        }
      }
      this.finalCarparkList1 = [];
      this.directionVisible = true;
      this.showButton = true;
      //this.finalCarparkList1.push([0, destinationSelected, destinationLat, destinationLon, distance, 0, 0, 0, 0, latCarpark, lonCaprk, text, asset]);
}



showAll(){
  this.showButton = false;
  this.finalCarparkList1 = this.finalCarparkList;
  this.directionVisible = false;
}
refresh(): void {
  window.location.reload();
}
markerDragEnd($event: any) {
  console.log($event.coords);
  this.latitude = $event.coords.lat;
  this.longitude = $event.coords.lng;
  this.getAddress(this.latitude, this.longitude);
}

selectChangeHandler($event: any){
  var val = $event.srcElement.value;
  this.filter = val;
  console.log(this.filter );
  this.ngAfterViewInit();


}



getAddress(latitude: any, longitude: any) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
    console.log(results);
    console.log(status);
    if (status === 'OK') {
      if (results[0]) {
        this.zoom = 15;
        this.address = results[0].formatted_address;
        console.log("in get address"+ this.address);
        if(this.favLocationsArray.includes(this.address)){
          console.log("in fav loc");
          this.starIsBlack = true;
        }
        else{
          this.starIsBlack = false;
        }
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }

  });
}
w3_change(i){
  this.correctIndex = i;
}
 w3_open() {
   console.log("HELLO FROM OPEN");
  this.renderer.setStyle(this.main.nativeElement, "marginLeft","25%");
  this.renderer.setStyle(this.mySidebar.nativeElement, "width", "25%");
  this.renderer.setStyle(this.mySidebar.nativeElement,"display", "block");
  this.renderer.setStyle(this.openNav.nativeElement, "display","none");
  this.mySidebar.nativeElement.style.width  = "25%";
  console.log(this.mySidebar.nativeElement.style.display)
  this.mySidebar.nativeElement.style.display = "block";
  this.openNav.nativeElement.style.display = 'none';
}
 w3_close() {
  this.renderer.setStyle(this.main.nativeElement,"marginLeft","0%");
  this.renderer.setStyle(this.mySidebar.nativeElement,"display","none");
  this.renderer.setStyle(this.openNav.nativeElement, "display", "inline-block");
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}

 myAccFunc() {
   this.renderer.setProperty("className", "demoAcc", "w3-bar-block w3-hide w3-white w3-card-4 w3 show");
  var x = document.getElementById("demoAcc");
  if (this.demoAcc.nativeElement.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    x.previousElementSibling.className += " w3-green";
  } else { 
    x.className = x.className.replace(" w3-show", "");
    x.previousElementSibling.className = 
    x.previousElementSibling.className.replace(" w3-green", "");
  }
}
  onSubmit(){
    this.router.navigate(['prof'])
  }
  setNearbyLocationsColor(i){
    return i == this.correctIndex;
  }


 
}



