console.log("connected");
var map,marker1,circle;
var flag=0;
var input;
var marker_red="marker_red.png";
var marker_black="marker_black.png";
var marker_user="marker_user.png";
var prev_infoWindow=false;
var directionsService;
var directionDisplay;
var arr=[{"lat":17.423799765024,"lng":78.454352221819,"label":"Mukesh medicals Punjagutta, Hyderabad","priority":1,"distance":0},{"lat":17.395375905513,"lng":78.437582134952,"label":"Ayodya Nagar, Mehdipatnam,Hyderabad","priority":1,"distance":0},{"lat":25.599507005244,"lng":85.157630317051,"label":"Kankarbagh\r\n","priority":1,"distance":0},{"lat":25.61691,"lng":85.1106163,"label":"Jawhna Apartment\r\n","priority":1,"distance":0},{"lat":28.595744852393,"lng":77.042018637929,"label":"Dwarka\r\n","priority":1,"distance":0},{"lat":28.643140711227,"lng":77.297184891515,"label":"Preet Vihar","priority":1,"distance":0},{"lat":28.5454365,"lng":77.1468748,"label":"Jasola","priority":1,"distance":0},{"lat":28.630258267433,"lng":77.071540637253,"label":"Peeragarhi\r\n","priority":1,"distance":0},{"lat":28.534766431522,"lng":77.260365486145,"label":"Kalkaji\r\n","priority":1,"distance":0},{"lat":28.53045973339,"lng":77.256574243701,"label":"Pitampura\r\n","priority":1,"distance":0},{"lat":28.669396964808,"lng":77.14617122059,"label":"Punjabi Bagh","priority":1,"distance":0},{"lat":28.43279621787,"lng":77.30102444871,"label":"Sec-17\r\n","priority":1,"distance":0},{"lat":28.43496474246,"lng":77.058687017202,"label":"Sec-46\r\n","priority":1,"distance":0}];
//var arr=JSON.parse($('#arr').val());
google.maps.event.addDomListener(window,'load',initMap);
//Create Map
function initMap(){
	console.log("init map called");
	var loc={lat: 22.51290, lng:82.53566};
	 map=new google.maps.Map(document.getElementById("maps"),{
		zoom:5,
		center: loc,
		scaleControl:true
	});
	 directionsService=new google.maps.DirectionsService();
	 directionDisplay= new google.maps.DirectionsRenderer({map:map, suppressMarkers:true});

	 map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.querySelector("#search_box"));
	 map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.querySelector("#my_location"));
	 //Markers for all labs
	 for(var i=0;i<arr.length;i++){
	 	var la=arr[i].lat;
	 	var ln=arr[i].lng
	 	var loc={lat:la,lng:ln};
	 	addMainMarker(loc,i); 
	 }
	 function addMainMarker(loc,i){
	 	var marker= new google.maps.Marker({
	 		position:loc,
	 		map:map,
	 		title:arr[i].label,
	 		icon:marker_black

	 	});
	 	var infoWindow= new google.maps.InfoWindow({
	 		content: arr[i].label
	 	});
	 	marker.addListener('click', function() {
            if( prev_infoWindow ) {
                prev_infoWindow.close();
            }

            prev_infoWindow = infoWindow;
            infoWindow.open(map, marker);

        });

	 	arr[i].map=marker;	 	  
	 }
	 
	 
// //Geocoding
// var geocoder =new google.maps.Geocoder();
// var address="ATM";
// geocoder.geocode( { 'address': address}, function(results, status) {
// 	console.log(results);
// 	console.log(status);
//   if (status == 'OK') {

//     var latitude = results[0].geometry.location.lat();
//    // latitude=Math.round(latitude *10000000)/10000000;
//     var longitude = results[0].geometry.location.lng();
//     //longitude=Math.round(longitude*10000000)/10000000;
//  	console.log(latitude+" "+longitude);
//  	var loc={lat:latitude,lng:longitude};
//  	addMarker(loc);
//   } 
//   else
//   {
//   	console.log(status);
//   }
// });
// var loc={lat: 28.61290, lng:77.03566};
// addMarker(loc);
// function addMarker(coords)
// {	
// 	var marker=new google.maps.Marker({
// 		position:coords,
// 		map: map
// 	});	
// 	console.log("marker added");
// }
}




//AutoComplete search Box
var defaultBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(8.493053536721622, 68.93992172085473),
  new google.maps.LatLng(36.52644088806312, 96.01023422085473));
var options = {
  bounds: defaultBounds,
  componentRestrictions: {country: 'IN'}
};
 input=document.querySelector("#search_box"); 
var autocomplete = new google.maps.places.Autocomplete(input, options);
autocomplete.addListener('place_changed', searchedAddress);
function searchedAddress(){
	 if( prev_infoWindow ) {
                        prev_infoWindow.close();
                    }
	 var place=autocomplete.getPlace();
	addMarker1(place.geometry.location);
	var org=new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
	console.log(org);
	AllFunctions(org);
}


// Code for centering map to user location
	document.querySelector("#my_location").addEventListener("click",geolocate);
	function geolocate(){
		var geolocation;
		if( prev_infoWindow ) {
                        prev_infoWindow.close();
                    }
			  if (navigator.geolocation) {
				    navigator.geolocation.getCurrentPosition(function(position) {
				       geolocation = {
				        lat: position.coords.latitude,
				        lng: position.coords.longitude
				      };
			      console.log(geolocation);
			      addMarker1(geolocation);

			      var org=new google.maps.LatLng(geolocation.lat,geolocation.lng);
			    // var metres=156543.03392 * Math.cos(org.lat() * Math.PI / 180) / Math.pow(2, 11.78);
			     
			      AllFunctions(org);     
			    });
			  }
		}


// Add Marker for User position
function addMarker1(coords)
{	
	if(flag===1)
		{
			marker1.setMap(null);
			circle.setMap(null);
		}
	 marker1=new google.maps.Marker({
		position:coords,
		map: map,
		icon:marker_user
	});	
	 var infoWindow= new google.maps.InfoWindow({
	 		content: "My Location"
	 	});
	 	marker1.addListener('click', function() {
            if( prev_infoWindow ) {
                prev_infoWindow.close();
            }

            prev_infoWindow = infoWindow;
            infoWindow.open(map, marker1);

        });
      //HighLight 10kms around the user location
       circle = new google.maps.Circle({
      	strokeColor: '#d9534f',
            strokeOpacity: 0.35,
            strokeWeight: 2,
            fillColor: '#d9534f',
            fillOpacity: 0.35,
            map: map,
        center: coords,
        radius: 3000
      });
        flag=1;
	  map.setCenter(coords);
      map.setZoom(11.78);
}

// Distance matrix and calculation
function AllFunctions(origin){
	
	// var dest=[];
	// for(var i=0;i<arr.length;i++){
	// 	dest[i]=new google.maps.LatLng(arr[i].lat,arr[i].lng);
	// }
	// var service = new google.maps.DistanceMatrixService();
	// service.getDistanceMatrix(
	// {
	// 	origins:[origin],
	// 	destinations:dest,
	// 	travelMode:'DRIVING'
	// },callback);
	// function callback(response, status){
	// 		console.log(status);
	// 		if(status=='OK')
	// 		{
	// 			for(var i=0;i<arr.length;i++){
	// 				console.log(response.rows[0].elements[i].distance.value);
	// 			}
	// 		}
	// 		else{
	// 			console.log("couldn't find distance due to status: "+status);
	// 		}
	// }

	for(var i=0;i<arr.length;i++)
	{
		arr[i].distance= getDistance(arr[i].lat,arr[i].lng,origin.lat(),origin.lng());
	}
	
	arr.sort((a,b) => parseFloat(a.distance)-parseFloat(b.distance));
		
		for(var i=0;i<arr.length;i++)
		{
			arr[i].map.setMap(map);
			arr[i].map.setIcon(marker_black);
		}
		if( prev_infoWindow ) {
                prev_infoWindow.close();
            }
		$("#result").remove();
	var l1=0,l2=0;
	for(var i=0;i<arr.length;i++)
	{
		if(arr[i].distance<=3000)
			{l1++;l2++;}
		if(arr[i].distance>3000 && arr[i].distance<=10000)
			{l2++;break;}
	}	
	var pos=0;
	if(l1==0 && l2==0)
	{
		var infoWindow= new google.maps.InfoWindow({
	 		content: "Couldn't find nearby labs due to some technical fault, contact or chat with us to know the nearest lab"
	 	});
	 	if( prev_infoWindow ){
                prev_infoWindow.close();
            

            prev_infoWindow = infoWindow;
            infoWindow.open(map, marker1);
        };
	}
	if(l1>0)
	{
		 pos=0,max=0;
		for(var i=0;i<l1;i++)
		{
			if(arr[i].priority>max)
				pos=i;
		}
		for(var i=0;i<l1;i++)
		{
			if(i!=pos)
			arr[i].map.setMap(null);
		}
		var dest= new google.maps.LatLng(arr[pos].lat,arr[pos].lng);
		arr[pos].map.setMap(map);
		showRoute(origin,dest);
	}
	if(l1==0 && l2>0)
	{
		pos=l2-1;
		var dest= new google.maps.LatLng(arr[pos].lat,arr[pos].lng);
		showRoute(origin,dest);
	}
	arr[pos].map.setIcon(marker_red);
	console.log("nearest location is "+ arr[pos].label);
}

function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371000; 					// Radius of the earth in metres
  var dLat = deg2rad(lat2-lat1);  	// deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 					// Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function showRoute(start,end){
	findRoute(directionsService,directionDisplay,start,end);
}
function findRoute(directionsService,directionDisplay,start,end)
{
	console.log("inside findRoute");
	console.log(start.lat()+" "+start.lng());
	console.log(end.lat()+" "+end.lng());
	directionsService.route({
		origin:start,
		destination:end,
		travelMode:google.maps.TravelMode.DRIVING},
		function(response,status){
			if(status==google.maps.DirectionsStatus.OK){
				directionDisplay.setDirections(response);
			}
			else{
				alert("Directions request failed due to "+status);
			}
	});
}
