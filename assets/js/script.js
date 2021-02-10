$(document).ready(function(){
    //weather API
    var weatherAPI = "424b27cb93fafd7914e312602e3d2a39";
    var googleAPI = "AIzaSyA9KoDHkh0ImS4kCiFNvslAws_sa4MVNXE";

    //city array for local storage
    var cityI = [];

    //gets local storage, saves to array
    if(localStorage.getItem("city") !== null) {
    cityI = JSON.parse(localStorage.getItem("city"));
    }
    

    //click function
    $("#search-btn").on('click', function(){
        
        //var for search value
        var searchCity = $("#search-places").val();


        //removes the prevous info when search again
        $(".weathT").remove();
        $(".maps").remove();
        $("#sites").addClass("is-hidden");
        
        

        //clears the users window afterwards
         if($("#search-places").val()) {
            $("#search-places").val("");
        }
        
        //function call for weather
        getWeather(searchCity);
        getForecast(searchCity);
        
    })

    //function for get weather
    function getWeather(searchCity) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=" + weatherAPI + "&units=imperial",
            dataType: "json",
            success: function(data) {
                //removes attr from site
                $("#sites").removeAttr("class").attr("class", "column")
                
                //creates map area and appends to map
                var mapLocation = $("#maps")
                var maps = $("<div id='map' class='column maps'>");
                mapLocation.append(maps);

                //creates the sites and weather
                var locationInfo = $("#locationInfo")
                var weatherDashboard = $("<div id='weather' class='column is-2 weathT'>");
                //appends to them 
                locationInfo.append(weatherDashboard);

                //weather title, city searched
                var title = data.name;
             
                //creates the card, adds the info from the data from the api to the card
                var weatherTitle = $('<h2 class="card-title" id="city">').text(title);
                var todayDate = $('<h1 class="todayDate">').text(new Date().toLocaleDateString());
                var weatherCard = $('<article class="card weatherToday">');
                var temperature = $('<p class="card-text">').text("Temperature: " + data.main.temp.toFixed() + "°F");
                var humidity = $('<p class="card-text">').text("Humidity: " + data.main.humidity + "%");
                var windSpeed = $('<p class="card-text">').text("Wind Speed: " + data.wind.speed + " mph");
                var card = $('<div class="card-body">');
                var image = $("<img class='img-weather'>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

                //appends it all together to add it to the html
                weatherTitle.append(image);
                card.append(weatherTitle, todayDate, image, temperature, humidity, windSpeed);
                weatherCard.append(card);
                $("#weather").append(weatherCard);
            },

            //catches error and pops up an error window
            error: function(textStatus, errorThrown) {
                //creates the content
                var popUpOL = $('<div class="popup-overlay">');
                var popup = $('<div class="popup-content">');
                var popUInfo = $('<h2 class="errtxt">').text("Error");
                var popP = $('<p class="errp">').text("The City searched was not found, Try Again.");
                var closepbtn = $('<button class="close">').text("close");

    
                //appends it to the html
                $(".error").append(popUpOL.append(popup.append(popUInfo, popP, list, closepbtn)));

                //creates the popup content class for it to be active and popup
                $(".popup-overlay, .popup-content").addClass("active");
                
                //when close is clicked then removes class 
                $(".close, .popup-overlay").on("click", function() {
                    $(".popup-overlay, .popup-content").removeClass("active");
                  });
            }

        }
    )}

    //function for getting the forecast
    function getForecast(searchCity) {
         $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=" + weatherAPI + "&units=imperial",
            dataType: "json",
            success: function(data) {
                //console.log(data);
                var longitude = data.city.coord.lon;
                var latitude = data.city.coord.lat;
                console.log(longitude);
                console.log(latitude);
                //loops through the data list and creates only 5 days
                for(var i = 0; i < data.list.length; i++) {

                    //grabs the info from 3pm and creates the data 
                    if(data.list[i].dt_txt.indexOf("15:00:00") != -1) {

                        //console.log(data.list[i].dt);

                        //creates the dates title
                        var forDate = new Date(data.list[i].dt_txt);
                        var options = { weekday: 'long'};
                        var weekDay = new Intl.DateTimeFormat('en-US', options).format(forDate);
                        var forDay = forDate.getDate();
                        var forMonth = forDate.getMonth() + 1;
                        var dateTxt = weekDay + " " + forMonth + "/" + forDay;

                        //column with title, img, temp, humidity
                        var column = $('<article class="forecast">');
         
                        var cardT = $('<h5 class="forecast-date">').text(dateTxt);

                        var newImg = $('<img class="weatherIcon">').attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"); 
                        var tempRound = data.list[i].main.temp_max;
                        var temp = $('<p class="txt">').text(tempRound.toFixed() + "°F");


                        //appends info together
                        column.append(cardT, newImg, temp);

                        

                        //appends to html row
                        $("#weather").append(column);

                    }
                }
                //function for map call
                
                initMap(latitude, longitude); 
                findPlaces(searchCity)

                
            }  
        }
    )};

        //map function for map uses google map api
      //let map;
      function initMap(latitude,longitude) {
        var myLatlng = new google.maps.LatLng(latitude, longitude);
        var myOptions = {
            zoom: 11,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(document.getElementById("map"), myOptions);
        
    }
    
    // Function for adding a marker to the page.
    function addMarker(location) {
        marker = new google.maps.Marker({
            position: location,
            map: map,

        });
        
    }


    function addInfoWindow(marker, message) {

        var infoWindow = new google.maps.InfoWindow({
            content: message
        });

        
            infoWindow.open(map, marker);
        
    }

    // Testing the addMarker function
    function TestMarker(latVar, longVar) {
           locationVar = new google.maps.LatLng(latVar, longVar);
           addMarker(locationVar);
    }


    function findPlaces(city){
        var categories = $(".categoryImage")
        categories.on("click", function(){
        $("#row-1").removeAttr("class").attr("class", "columns is-1")
        $("#row-2").removeAttr("class").attr("class", "columns is-1")
        var selection = $(this).attr("id")
        var proxyurl = "https://cors-anywhere.herokuapp.com/";
        var url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${selection}+in+${city}&key=${googleAPI}`; // site that doesn’t send Access-Control-*
        fetch(proxyurl + url) 
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            var results = data.results
            console.log(data)
            for( var i = 1; i < 7; i++ ){
               var photoRef = results[i].photos[0].photo_reference
               var picUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${googleAPI}`
               $("#placeImage-"+i).attr("src", picUrl)
               $("#placeImage-"+i).attr("href")
               $("#name-"+i).text(data.results[i].name)
               $("#rating-"+i).text("Rating: " + data.results[i].rating)

               var latVar = data.results[i].geometry.location.lat;
                var longVar = data.results[i].geometry.location.lng;
                var content = data.results[i].name;
               // Adding Markers
               TestMarker(latVar, longVar);
               // Adding info to Markers
               addInfoWindow(marker, content);
            }
        })
        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    })

    //local storage save
    cityI.push(city);
    window.localStorage.setItem("city", JSON.stringify(cityI));
    
    } // End function

    $(".categoryImage").on("mouseenter", function(){
        $(this).animate({"height":"95%","width":"95%","vertical-align":"center","justify-content":"center"},50) 
    })
    $(".categoryImage").on("mouseleave", function(){
        $(this).animate({"height":"100%","width":"100%"},50)
    })
    $(".categoryImage").on("click", function(){
        $(this).animate({"height":"90%","width":"90%"},3).animate({"height":"100%","width":"100%"},3)
        $("#locationInfo").css({"margin-bottom":"70px"})
    })

    $(".placeImage").on("mouseenter", function(){
        $(this).animate({"border":"2px solid red","vertical-align":"center","justify-content":"center"},50) 
    })
    
});