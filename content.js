function insertError(){
	var sidebar = document.getElementById("home-value-wrapper")
    var tacoDiv = document.createElement("div")
    tacoDiv.innerHTML = "<span>Error searching for nearby Taco Bell</span>"
    sidebar.appendChild(tacoDiv)
    tacoDiv.style.marginTop = "10px"
}

function insertInfo(distance, duration)
{
    console.debug("Inserting Info")
    var sidebar = document.getElementById("home-value-wrapper")
    var tacoDiv = document.createElement("div")
    tacoDiv.innerHTML = "<span><strong>Bell Finder</strong></br>This house is " + distance + " (" + duration + ") " + "from the nearest Taco Bell</span>"
    sidebar.appendChild(tacoDiv)
    tacoDiv.style.marginTop = "10px"
}

function fetch(addr){
	var address = getAddress(addr)
	var latlon = getLatLon(address)
}

function getAddress(addressElement){
	address = addressElement[0].getElementsByTagName('h1')[0].textContent.concat(document.getElementsByClassName("addr_city")[0].textContent)
	return address
}

function getLatLon(address){
	address.split(' ').join('+')
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyAn4kHcCvbQ3IUDQpo7JiGF3SzCdkojuAI'
	
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var response = xhttp.responseText
      var obj = JSON.parse(response)
      if (obj.results[0] != null){
      	var location = obj.results[0].geometry.location
      	findTacos(location.lat, location.lng)
      }else{
      	insertError()
      }
    	}
  	};
  	xhttp.open("GET", url, true);
  	xhttp.send();
}

function findTacos(lat, lon) {
	var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lon + '&type=restaurant&name=taco%20bell&rankby=distance&key=AIzaSyAn4kHcCvbQ3IUDQpo7JiGF3SzCdkojuAI'
	
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var response = xhttp.responseText
      var obj = JSON.parse(response)
      if (obj.results[0] != null){
      	var location = obj.results[0].geometry.location
      	timeDistance(lat, lon, location.lat, location.lng)
      }else{
      	insertError()
      }
    	}
  	};
  	xhttp.open("GET", url, true);
  	xhttp.send();
}

function timeDistance(lat1, lon1, lat2, lon2){
	url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + lat1 + ',' + lon1 + '&destinations=' + lat2 + ',' + lon2 + '&key=AIzaSyAn4kHcCvbQ3IUDQpo7JiGF3SzCdkojuAI'
	
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var response = xhttp.responseText
      var obj = JSON.parse(response)
      if (obj.rows[0] != null){
      	var message = obj.rows[0].elements[0]
      	insertInfo(message.distance.text,message.duration.text)
      }else{
      	insertError()
      }
    	}
  	};
  	xhttp.open("GET", url, true);
  	xhttp.send();
}

var isHome = false
setInterval(function() {
    var address = document.getElementsByClassName("addr")
    if (address.length != 0){
		console.debug("Address found")
		if (!isHome){
			isHome = true
			console.debug("--fetch bell")
			fetch(address)
		}else{
			console.debug("--unchanged")
		}
	}else{
		console.debug("Address not found")
		if (isHome){
			isHome = false
			console.debug("--left home")
		}
	}
}, 1000);