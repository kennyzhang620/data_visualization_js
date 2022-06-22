// JavaScript source code

// Initialize the map.
var homeCoords = [49.27767013573553, -122.91268085603525];

var bingKey = "AvEQ1m7_88IHqh6gFAaKUTUuuqbz_zrvMU7HEEu_vX6qXguJOWIQk4WqS-01xSAq";
var txtFile = new XMLHttpRequest();
var parsedD = {};
var markers = [];
var searchbar = document.getElementById("search");
var homebutton = document.getElementById("homebtn");
var settingsBtn = document.getElementById("settingsbtn")
var settingsPne = document.getElementById("settingspane");
var filtersBtn = document.getElementById("options");
var filtersPne = document.getElementById("filters_norm");
var filtersPC = document.getElementById("filters_pc");
var infoPanel = document.getElementById("items_main");

var defStyleBtn = document.getElementById('style1');
var lightStyleBtn = document.getElementById('style2');
var darkStyleBtn = document.getElementById('style3');
var sw_Location = document.getElementById('sw_location');
var metadataWin = document.getElementsByClassName('data_header')

var FiltersActive = false;

var defaultStyle = 'https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=qYOU04zmJXYprHE89esvVcT3qGW68VsSgDdYXjXUUmZgDRBajbH3e58EHY5bONXU';
var lightStyle = 'https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=qYOU04zmJXYprHE89esvVcT3qGW68VsSgDdYXjXUUmZgDRBajbH3e58EHY5bONXU';
var darkStyle = 'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=qYOU04zmJXYprHE89esvVcT3qGW68VsSgDdYXjXUUmZgDRBajbH3e58EHY5bONXU';

var redirectGMapNav = 'https://www.google.com/maps/dir/';

var map = L.map('map').setView(homeCoords, 3);
var mapSize = document.getElementById("map");

mapSize.style.height = 960;

/*
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
*/

var tiles = L.tileLayer(darkStyle, {}).addTo(map);
map.attributionControl.addAttribution("<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors")

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

function GeoCode(query) {
	var geocoderURL = "https://dev.virtualearth.net/REST/v1/Locations/" + query + "?" + "o=json&key=" + bingKey;

	var getLatLong = new XMLHttpRequest();
	var coords = [];

	console.log(geocoderURL);
	getLatLong.open("GET", geocoderURL, false);

	getLatLong.onload = function (e) {
		if (getLatLong.readyState == 4) {
			if (getLatLong.status == 200) {
				var data = JSON.parse(getLatLong.responseText);

				if (data.authenticationResultCode == "ValidCredentials") {
					var points = data.resourceSets;

					if (points.length > 0) {
						if (points[0].resources.length > 0) {
							if (points[0].resources[0].geocodePoints.length > 0) {
								if (points[0].resources[0].geocodePoints.length > 0)
								coords = points[0].resources[0].geocodePoints[0].coordinates;
                            }
                        }
                    }
				}
				
			}
			else {
				console.error(getLatLong.statusText);
            }
        }
	}

	getLatLong.onerror = function (e) {
		console.error(getLatLong.statusText);
	};

	getLatLong.send();

	return coords;
}

function loadLeftPanel(Project, PIs, CoPIs, Collabs) {
	console.log("Data->", Project, PIs, CoPIs, Collabs);


	var htmlValues = `<header id="rname" style="font-size:large; text-align:center;">${Project}</header>
		<div id = "pi_section" style = "text-align:center;">
                                                <div id="PI_field" style="padding:3px;">
                                                    <div class="research_details">${PIs}</div>
                                                </div>
                                                <div id="Co_PI_field" style="padding:3px;">
                                                    <div class="research_details">${CoPIs}</div>
                                                </div>
                                            </div>
                                            
                                            <div id="collab_field" style="padding:3px;">
                                                <div class="research_details">${Collabs}</div>
                                            </div>
                                            
                                            <div id="fund_section" style="text-align:center;">
                                                <div id="funder_main" style="padding:2px; display:inline-block; width:43%;">
                                                    <div class="research_details">Funder</div>
                                                </div>
                                                <div id="funder_period" style="padding: 2px;display:inline-block; width: 43%;">
                                                    <div class="research_details">Period</div>
                                                </div>
                                            </div>
                                            
                                            <div id="poi_keywords" style="padding: 3px; display: block;">
                                                <div class="research_details">Keywords</div>
                                            </div>
                                            
                                            <div id="coordinates" style="text-align:center;">
                                                <div id="funder_main" style="padding:2px; width:27%; display:inline-block;">
                                                    <div class="research_details">Latitude</div>
                                                </div>
                                                <div id="funder_period" style="padding: 2px; width: 27%; display: inline-block;">
                                                    <div class="research_details">Longitude</div>
                                                </div>
                                            </div>`

	var inner = metadataWin;

	if (inner != null) {
		var container = inner[0];

		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}

		var newNode = document.createRange().createContextualFragment(htmlValues);
		container.appendChild(newNode);

		//infoPanel.style.display = "block";

	}
}

function filter() {
	for (var i = 0; i < parsedD.length; i++) {
		markers.push(L.circle([parsedD[i].latitude, parsedD[i].longitude], {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.25,
			radius: 50
		}).addTo(map));

		var metadata = `<header id="rname" style="font-size:large; text-align:center;">${Project}</header>
		<div id = "pi_section" style = "text-align:center;">
                                                <div id="PI_field" style="padding:3px;">
                                                    <div class="research_details">${PIs}</div>
                                                </div>
                                                <div id="Co_PI_field" style="padding:3px;">
                                                    <div class="research_details">${CoPIs}</div>
                                                </div>
                                            </div>
                                            
                                            <div id="collab_field" style="padding:3px;">
                                                <div class="research_details">${Collabs}</div>
                                            </div>
                                            
                                            <div id="fund_section" style="text-align:center;">
                                                <div id="funder_main" style="padding:2px; display:inline-block; width:43%;">
                                                    <div class="research_details">Funder</div>
                                                </div>
                                                <div id="funder_period" style="padding: 2px;display:inline-block; width: 43%;">
                                                    <div class="research_details">Period</div>
                                                </div>
                                            </div>
                                            
                                            <div id="poi_keywords" style="padding: 3px; display: block;">
                                                <div class="research_details">Keywords</div>
                                            </div>
                                            
                                            <div id="coordinates" style="text-align:center;">
                                                <div id="funder_main" style="padding:2px; width:27%; display:inline-block;">
                                                    <div class="research_details">Latitude</div>
                                                </div>
                                                <div id="funder_period" style="padding: 2px; width: 27%; display: inline-block;">
                                                    <div class="research_details">Longitude</div>
                                                </div>
                                            </div>`;

		var Project = parsedD[i].Project;
		var PIs = parsedD[i]["PI "];
		var CoPIs = parsedD[i]["Co-PI(s)"];
		var Collabs = parsedD[i]["Collaborators↵(not funders)"];

		console.log("===>", Project, PIs, CoPIs, Collabs);
		markers[i].bindPopup(metadata);
		markers[i].on('click', function (inp) {
			loadLeftPanel(Project, PIs, CoPIs, Collabs);

		});
    }
}

filter();
console.log(GeoCode("SFU"));

function changeTileType(tileURL) {
	tiles = L.tileLayer(tileURL, {}).addTo(map);
}

function closeRightPane() {
	settingsPne.style.display = "none";
	settingsBtn.style.display = "block";
	infoPanel.style.display = "none";
}

//console.log(parsedD[0].latitude, parsedD[1].longitude);
search.addEventListener('keypress', function (keyin) {
	if (keyin.key === 'Enter') {
		var coords = GeoCode(search.value);

		if (coords != null && coords.length > 0)
			map.setView(coords, 15);
	}
});

homebutton.addEventListener('mousedown', function (clicked) {
	homebutton.style.transform = "scale(0.75,0.75)";
});

homebutton.addEventListener('click', function (clicked) {
	map.setView(homeCoords, 15);
});

homebutton.addEventListener('mouseup', function (clicked) {
	homebutton.style.transform = "scale(1,1)";
});

settingsBtn.addEventListener('mousedown', function (clicked) {
	settingsBtn.style.transform = "scale(0.75,0.75)";
});

settingsBtn.addEventListener('mouseup', function (clicked) {
	settingsBtn.style.transform = "scale(1,1)";
});

settingsBtn.addEventListener('click', function (clicked) {
	settingsPne.style.display = "block";
	settingsBtn.style.display = "none";
});

map.on('movestart', closeRightPane)

window.addEventListener('resize', function (meta) {
	if (FiltersActive) {
		if (window.innerWidth / window.innerHeight >= (4 / 3)) {
			filtersPC.style.display = "block";
			filtersPne.style.display = "none";
		}
		else {
			filtersPne.style.display = "block";
			filtersPC.style.display = "none";
		}

	}
});

filtersBtn.addEventListener('click', function (clicked) {

	console.log(FiltersActive);
	if (!FiltersActive) {
		if (window.innerWidth / window.innerHeight >= (4 / 3)) {
			filtersPC.style.display = "block";
			filtersPne.style.display = "none";
		}
		else {
			filtersPne.style.display = "block";
			filtersPC.style.display = "none";
		}

		FiltersActive = true;
	}
	else {
		filtersPC.style.display = "none";
		filtersPne.style.display = "none";

		FiltersActive = false;
    }
});

defStyleBtn.addEventListener('click', function (clicked) {
	changeTileType(defaultStyle);

});

lightStyleBtn.addEventListener('click', function (clicked) {
	changeTileType(lightStyle);

});

darkStyleBtn.addEventListener('click', function (clicked) {
	changeTileType(darkStyle);

});

function coordsToStr(coords) {
	return coords[0] + ',' + coords[1];
}

function navigate(webNav, src, dest) {
	window.open(webNav + src + '/' + dest + '/');
}

function failure() {
	alert("Failed to obtain your location. Check your permissions and try again.")
	sw_Location.clicked = false;
}

console.log(window.innerHeight*0.75);
sw_Location.addEventListener('click', function (sw_click) {
	console.log("HW");
	if (sw_Location.checked) {

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (data) {
				homeCoords = [data.coords.latitude, data.coords.longitude];

			}, failure);
		}
		else {
			alert("Failed to obtain your location. Check your permissions and try again.");
			sw_Location.clicked = false;
        }
    }

});

//navigate(redirectGMapNav, coordsToStr(homeCoords), 'Port Coquitlam')




