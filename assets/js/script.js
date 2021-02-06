$(document).ready(function(){
    var weatherAPI = "424b27cb93fafd7914e312602e3d2a39";
    $("#weather").empty();
  
    $("#search-btn").on('click', function(){
        var searchCity = $("#search-places").val();
        $("#weather").empty();
        $("#sites").empty();
        $("#map").empty();

        //clears the users window afterwards
         if($("#search-places").val()) {
            $("#search-places").val("");
        }
        

        addInfo()
        
        function addInfo(){
            getWeather(searchCity);
            getForecast(searchCity);
        }

         
        
    })

    //function for get weather
    function getWeather(searchCity) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=" + weatherAPI + "&units=imperial",
            dataType: "json",
            success: function(data) {
                //empties weather area
              
                $("#weather").empty();

                var mapLocation = $("#maps")
                var maps = $("<div id='map' class='column'>");
                mapLocation.append(maps);

                var locationInfo = $("#locationInfo")
                var topSites = $("<div id='sites' class='column is-7'>");
                var weatherDashboard = $("<div id='weather' class='column is-4'>");

                locationInfo.append(topSites);
                locationInfo.append(weatherDashboard);

                var title = data.name;
             
                //creates the card, adds the info from the data from the api to the card
                var weatherTitle = $('<h3 class="card-title" id="city">').text(title);
                var weatherCard = $('<article class="card weatherToday">');
                var temperature= $('<p class="card-text">').text(data.main.temp.toFixed() +  " °F");
                var card = $('<div class="card-body">');
                var image = $("<img class='img-weather'>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

                //appends it all together to add it to the html
                weatherTitle.append(image);
                card.append(weatherTitle, temperature);
                weatherCard.append(card);
                weatherDashboard.append(weatherCard);

            },

            error: function(textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
                var popUpOL = $('<div class="popup-overlay">');
                var popup = $('<div class="popup-content">');
                var popUInfo = $('<h2 class="errtxt">').text("Error");
                var popP = $('<p class="errp">').text("The City searched was not found, Try Again.");
                var closepbtn = $('<button class="close">').text("close");

        
                $(".error").append(popUpOL.append(popup.append(popUInfo, popP, closepbtn)));

                $(".popup-overlay, .popup-content").addClass("active");
                
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
                console.log(data);
                var longitude = data.city.coord.lon;
                var latitude = data.city.coord.lat;
                console.log(longitude);
                console.log(latitude);


                //loops through the data list and creates only 5 days
                for(var i = 0; i < data.list.length; i++) {

                    //grabs the info from 3pm and creates the data 
                    if(data.list[i].dt_txt.indexOf("15:00:00") != -1) {

                        console.log(data.list[i].dt);

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

                initMap(latitude, longitude);    
            }  

        }
    )};
    let map;
    function initMap(latitude, longitude) {
        const myLatLng = { lat: latitude, lng: longitude };
        const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: myLatLng,
        });
    }  
});