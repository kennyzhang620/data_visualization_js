// JavaScript source code

// Initialize the map.

var map = L.map('map').setView([49.27767013573553, -122.91268085603525], 13);

	var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

var allText = [];

var txtFile = new XMLHttpRequest();
txtFile.open("GET", "vis_data.csv", false);
txtFile.send();
txtFile.onreadystatechange = function () {
	allText = txtFile.responseText;
	console.log("ret");
};

console.log("sync text");
console.log(allText);

