var map;

function getCovidsafeScore(place_id) {
    return fetch('https://covidsafebutbetter.trolltown.codes/covidsafeScore?place_id=' + place_id)
    
}

function googleServiceTextSearch(place_name) {
    let request = {
        query: place_name,
        fields: ["formatted_address","business_status","geometry","icon","name","place_id"]
    };
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, (res, status) => {
        console.log(res);
        console.log(status);
    })
}


// function getListOfPlaces(place_name) {
    
    
    

//     // service.textSearch(request, res => {
//     //     if (res.stat)
//     // });

//     // service.textSearch(request, function(results, status) {
//     //     if (status === google.maps.places.PlacesServiceStatus.OK) {
//     //         let place_list = addCovidScore(results);
//     //         console.log(place_list);
//     //         return place_list;
//     //     }

//     // });
    
//     googleServiceTextSearch(place_name).then(res => {
//         console.log("HERE!!!!");
//         console.log(res);
//     });
// }


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -33.828725, lng: 151.092503 },
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    });
}

function openNav() {
    document.getElementById("sidebar").style.right = "0px";
}

function openNav2() {
    document.getElementById("sidebar2").style.right = "0px";
    document.getElementById("sidebar2Close").style.right = "500px";
}

function closeNav2() {
    document.getElementById("sidebar2").style.right = "-550px";
    document.getElementById("sidebar2Close").style.right = "-50px";
}

async function addCovidScore(place_list) {
    let new_list = [];

    for (let i = 0; i < place_list.length; i++) {
        let obj = await getCovidsafeScore(place_list[i].place_id)
        let obj_json = await obj.json();
        new_list.push({place: place_list[i], covid_score: obj_json.score})
    }
    return new_list;
}

$(document).ready(function () {
    console.log('wazzup');
    document.getElementById("sidebar2Close").addEventListener("click", e => {
        console.log("clicked");
        closeNav2();
    });
    button = document.getElementById("searchBtn");
    button.addEventListener("click", e => {
        closeNav2();
        let place_name = document.getElementById("searchTextbox").value
        if (place_name.length == 0){
            return
        }
        let request = {
            query: place_name,
            fields: ["formatted_address","business_status","geometry","icon","name","place_id"]
        };
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, (res, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                addCovidScore(res).then(place_list => {
                    console.log(place_list)
                    populateSidebar(place_list);
                    placeMarkers(place_list);
                    openNav();
                })
            }
        })
    })
});

function populateSidebar(place_list) {
    // console.log("INNER");
    // console.log(place_list);
    // console.log("NEXT");
    let sideBar = document.getElementById("sidebar");
    sideBar.style.height = '500px';
    while (sideBar.firstChild) {
        sideBar.removeChild(sideBar.firstChild);
    }
    for (let i = 0; i < place_list.length; i++) {
        console.log("loop");
        let placeCard = document.createElement("div");
        placeCard.classList.add("card", "bg-light", "mb-3", "place-card");
        if (place_list[i].covid_score < 10) {
            placeCard.classList.add("border-success");
        }
        else if (place_list[i].covid_score < 50) {
            placeCard.classList.add("border-warning");
        }
        else {
            placeCard.classList.add("border-danger");
        }
        let placeCardHeader = document.createElement("div");
        placeCardHeader.classList.add("card-header");
        placeCardHeader.textContent = "Rating: " + place_list[i].covid_score.toString();
        placeCardHeader.style.pointerEvents = "none";
        placeCard.appendChild(placeCardHeader);
        let placeCardBody = document.createElement("div");
        placeCardBody.classList.add("card-body");
        placeCardBody.style.pointerEvents = "none";
        let placeCardBodyTitle = document.createElement("h5");
        placeCardBodyTitle.classList.add("card-title");
        placeCardBodyTitle.textContent = place_list[i].place.name;
        placeCardBodyTitle.style.pointerEvents = "none";
        placeCardBody.appendChild(placeCardBodyTitle);
        let placeCardBodyText = document.createElement("p");
        placeCardBodyText.classList.add("card-text");
        placeCardBodyText.textContent = place_list[i].place.formatted_address;
        placeCardBodyText.style.pointerEvents = "none";
        placeCardBody.appendChild(placeCardBodyText);
        placeCard.appendChild(placeCardBody);
        placeCard.placeProp = place_list[i];
        placeCard.addEventListener("click", e => {
            console.log('element', e.target.placeProp);
            map.setCenter(e.target.placeProp.place.geometry.location);
            map.setZoom(16);
            populateSidebar2(e.target.placeProp);
            sideBar.style.height = 0;
            openNav2();
        });
        sideBar.appendChild(placeCard);
    }
}

function getTime(i) {
    if (i == 0) {
        return "12am";
    } else if (i == 12) {
        return "12pm";
    }
    else if (i < 12) {
        return i.toString() + 'am';
    } else {
        return (i % 12) + 'pm';
    }
}

async function getPopularTimes(element, place_id) {
    console.log('element', element);
    let response = await fetch('https://covidsafebutbetter.trolltown.codes/populartimes?place_id=' + place_id);
    let responseOk = await response.json();
    console.log('responseOk', responseOk);
    if (responseOk.populartimes != null) {
        console.log('adding popular times');
        for (let i = 0; i < responseOk.populartimes[0].data.length; i++) {
            element.innerHTML += '<div class="bar" style="height: ' + responseOk.populartimes[0].data[i] + 'px"></div>';
        }
    }
    return element;
}

async function populateSidebar2(place_obj) {

    let sideBar2 = document.getElementById("sidebar2");
    while (sideBar2.firstChild) {
        sideBar2.removeChild(sideBar2.firstChild);
    }
    let placeCard = document.createElement("div");
    placeCard.classList.add("card");
    let placeCardPic = document.createElement("img");
    if (place_obj.place.photos != null) {
        let picUrl = place_obj.place.photos[0].getUrl({maxWidth: 500, maxHeight: 400});
        placeCardPic.src = picUrl;
    }
    placeCardPic.classList.add("card-img-top");
    placeCard.appendChild(placeCardPic);
    let placeCardBody = document.createElement("div");
    placeCardBody.classList.add("card-body");
    let placeCardBodyLocation = document.createElement("h5");
    placeCardBodyLocation.classList.add("card-title");
    placeCardBodyLocation.textContent = place_obj.place.name;
    placeCardBody.appendChild(placeCardBodyLocation);
    let placeCardBodyAddress = document.createElement("p");
    placeCardBodyAddress.classList.add("card-text");
    placeCardBodyAddress.textContent = place_obj.place.formatted_address;
    placeCardBody.appendChild(placeCardBodyAddress);
    placeCard.appendChild(placeCardBody);
    let placeCardList = document.createElement("ul");
    placeCardList.classList.add("list-group", "list-group-flush");
    let placeCardListGoogRating = document.createElement("li");
    placeCardListGoogRating.classList.add("list-group-item");
    if (place_obj.place.rating == null) {
        placeCardListGoogRating.textContent = "Google Reviews Rating: N/A";
    }
    else {
        placeCardListGoogRating.textContent = "Google Reviews Rating: " + place_obj.place.rating + " (" + place_obj.place.user_ratings_total.toString() + " Reviews)";
    }
    placeCardList.appendChild(placeCardListGoogRating);
    let placeCardListTags = document.createElement("li");
    placeCardListTags.classList.add("list-group-item");
    let tagString = "";
    for (let i = 0; i < place_obj.place.types.length; i++) {
        let tag = place_obj.place.types[i];
        tag.replace(/[^0-9a-z]/gi, '');
        tagString = tagString + tag.charAt(0).toUpperCase() + tag.slice(1)
        if (i != place_obj.place.types.length - 1) {
            tagString = tagString + ", ";
        }
    }
    placeCardListTags.textContent = "Tags: " + tagString;
    placeCardList.appendChild(placeCardListTags);
    let placeCardListCrowd = document.createElement("li");

    let placeCardListCrowdDiv = document.createElement("div");
    placeCardListCrowdDiv.classList.add('popular-times');
    let newResult = await getPopularTimes(placeCardListCrowdDiv, place_obj.place.place_id);
    console.log('new Result', newResult);
    let timesLabel = document.createElement('div');
    for (i = 0; i < 24; i++) {
        if (i % 3 == 0) {
            timesLabel.innerHTML += '<div class="time-label">' + getTime(i) + '</div>';
        } else {
            timesLabel.innerHTML += '<div class="time-label"></div>';
        }
        
    }
    timesLabel.classList.add('time-labels');
    placeCardListCrowd.classList.add("list-group-item");
    placeCardListCrowd.textContent = "Crowd Presence:";
    placeCardList.appendChild(placeCardListCrowd);
    placeCardList.appendChild(timesLabel);

    placeCardListCrowd.appendChild(newResult);
    // let placeCardListCases = document.createElement("li");
    // placeCardListCases.classList.add("list-group-item");
    // placeCardListCases.textContent = "Nearby COVID Cases:";
    // placeCardList.appendChild(placeCardListCases);
    placeCard.appendChild(placeCardList);
    sideBar2.appendChild(placeCard);
    sideBar2.appendChild(document.createElement("br"));
    let placeCardCovText = document.createElement("h1");
    placeCardCovText.textContent = "Our COVID Risk Rating";
    placeCardCovText.style.textAlign = "center";
    sideBar2.appendChild(placeCardCovText);
    let placeCardCovNum = document.createElement("h1");
    placeCardCovNum.textContent = place_obj.covid_score.toString();
    if (place_obj.covid_score < 10) {
        placeCardCovNum.style.color = "green";
    }
    else if (place_obj.covid_score < 50) {
        placeCardCovNum.style.color = "rgb(239, 176, 2)";
    }
    else {
        placeCardCovNum.style.color = "red";
    }
    placeCardCovNum.style.textAlign = "center";
    placeCardCovNum.style.fontWeight = "bolder";
    placeCardCovNum.style.fontSize = "100px";
    sideBar2.appendChild(placeCardCovNum);
}

function placeMarkers(place_list) {
    console.log("markers");
    for (let i = 0; i < place_list.length; i++) {
        let marker = new google.maps.Marker({
            position: place_list[i].place.geometry.location,
            title: place_list[i].name
        });
        marker.setMap(map);
    }
}