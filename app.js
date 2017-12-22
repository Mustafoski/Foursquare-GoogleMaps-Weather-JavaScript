// //https://api.foursquare.com/v2/venues/search?v=20161016&near=Struga&intent=checkin
// &client_id=KTKZSZO410ZEIBDVBGNZLX2VSTMAXLVA4NINTZ1SNUBFWIJ4
// &client_secret=0AZBQ5OAAC14H1100WJWUFPIJIYJQ1DUG1CNBXLICV5W4VZ1
// near=Struga
const SEARCH_VIEW  = document.getElementById('search_view');
const RESULTS_VIEW = document.getElementById('results_view');

const TEMP_VIEW = document.getElementById("temp");
const HUMIDITY_VIEW = document.getElementById("humidity");

const userSearchedWord = document.getElementById('search_input');

const API_BASE = 'https://api.foursquare.com/v2/venues/search?v=20161016&intent=checkin&limit=50';
const CLIENT_ID ='&client_id=KTKZSZO410ZEIBDVBGNZLX2VSTMAXLVA4NINTZ1SNUBFWIJ4';
const CLIENT_SECRET = '&client_secret=0AZBQ5OAAC14H1100WJWUFPIJIYJQ1DUG1CNBXLICV5W4VZ1';

//Google Maps

function initializeMap(options, markers = []) {
    
    // New Map
    var map = new google.maps.Map(document.getElementById('map'),options);
    
    if (markers.length > 0) {
        for(var i = 0; i<markers.length;i++){
            addMarker(markers[i]);
        }
    }
		
		// add marker function
	function addMarker(props){
		var marker = new google.maps.Marker({
			position:props.coords,
			map:map
		});
		
		if(props.content){
			var infoWindow = new google.maps.InfoWindow({
				content:props.content
			});
		
			marker.addListener('click', function() {
				infoWindow.open(map,marker);
			}); 
		}
		
	}
}

window.initMap = function() {}


function pageLoaded(){
      // page started hide results_view and gallery_view
    RESULTS_VIEW.style.visibility = 'hidden';
   
}

function buildApi() {
    return 'http://api.openweathermap.org/data/2.5/weather?q='+ userSearchedWord.value + '&appid=6c345b20d0c8fac21a36761eb7d6cd38';
}

function weatherAPI(){
    var weatherUrl = buildApi();
                console.log(weatherUrl);
                
                fetch(weatherUrl).then(rsp => {
                    console.log(rsp);
                    if (rsp.status !== 200) {
                        console.error("Invalid API");
                    }
                    
                    rsp.json().then(result => {
                        console.log(result);
                        TEMP_VIEW.innerHTML = 'Temp: ' + result.main.temp;
                        HUMIDITY_VIEW.innerHTML = 'Humidity:' + result.main.humidity;
                    });
                });
}

function foursquareAPI() {

	var url = API_BASE + CLIENT_ID + CLIENT_SECRET + '&near=' + userSearchedWord.value;

	fetch(url)
		.then((response) => {
			console.log(response);
			if(response.status !== 200){
				console.error("Invalid API");
			}

			response.json().then((data) => {
				console.log(data);
                
                

				var name = '';
				var venues = data.response.venues;
                
                var markers = [];
                
                var center = {
                    lat: 0.0,
                    lng: 0.0
                }

				venues.forEach((venue) => {
					//console.log(venue.name);

					name += "<div class='card'> "
                   	+ "<br />"
                   	+ "<p>" + venue.name + ' : '+ '<span>' + venue.stats.checkinsCount  + " Checkins"+ '</span>' + "</p>"
                   	+ '</div>';
                    
                    center.lat += venue.location.lat;
                    center.lng += venue.location.lng;
                    
                    var marker = {
                        coords:{
                            lat:venue.location.lat,
                            lng:venue.location.lng
                        },
                        content:
                        '<h2>' + venue.name + '</h2>'
                    }
                    
                    markers.push(marker);
                    
                   	
				});
                console.log(markers);
                
                center.lat /= venues.length;
                center.lng /= venues.length;
                
                const options = {
                    zoom: 15,
                    center,
                }

				RESULTS_VIEW.style.visibility = 'visible';

				if (name !== '') {
					RESULTS_VIEW.innerHTML = name;
                    window.initMap = initializeMap(options, markers);
				} else {
					RESULTS_VIEW.innerHTML = '<p>There was an error in response!</p>';
				}
			});

		}).catch((err) =>  {
			console.error('Invalid data', err);
			
		});
}

function callAPIs() {
    weatherAPI();
    foursquareAPI();
}