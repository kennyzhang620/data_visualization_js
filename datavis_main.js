// JavaScript source code

// Initialize the map.

var map = L.map('map').setView([49.27767013573553, -122.91268085603525], 13);

	var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

var txtFile = new XMLHttpRequest();
var parsedD = {};
var markers = []

txtFile.open("GET", "https://kennyzhang620.github.io/vis_data.csv", false);
txtFile.onload = function (e) {
	if (txtFile.readyState === 4) {
		if (txtFile.status === 200) {
			var csvData = txtFile.responseText;

			parsedD = $.csv.toObjects(csvData);
		} else {
			console.error(txtFile.statusText);
		}
	}
};
txtFile.onerror = function (e) {
	console.error(txtFile.statusText);
};

txtFile.send();

console.log(parsedD);

function filter() {
	for (var i = 0; i < parsedD.length; i++) {
		markers.push(L.circle([parsedD[i].latitude, parsedD[i].longitude], {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.25,
			radius: 50
		}).addTo(map));

		var metadata = "Project: " + parsedD[i].Project + "\nPI: " + parsedD[i]["PI "];
		markers[i].bindPopup(metadata);
    }
}

filter();
//console.log(parsedD[0].latitude, parsedD[1].longitude);



