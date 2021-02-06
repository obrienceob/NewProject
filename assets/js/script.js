$(document).ready(function(){
    var weatherAPI = "424b27cb93fafd7914e312602e3d2a39";
    $("#weather").empty();

    $("#search-btn").on('click', function(){
        var searchCity = $("#search-places").val();
        $("#weather").empty();

        //clears the users window afterwards
         if($("#search-places").val()) {
            $("#search-places").val("");
        }
        
        addMaps()
        addInfo()
        function addMaps(){
            var mapLocation = $("#maps")
            var maps = $("<div id='map' class='column'>");
            mapLocation.append(maps)
        }
        function addInfo(){
            
            var locationInfo = $("#locationInfo")
            var topSites = $("<div id='sites' class='column is-7'>");
            var weatherDashboard = $("<div id='weather' class='column is-4'>");

            getWeather(searchCity);
            getForecast(searchCity);
            

        
            locationInfo.append(topSites)
            locationInfo.append(weatherDashboard)
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
                $("#weather").append(weatherCard);

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

                        //adding in the longitude and latitude variables for the google maps call
                        var longitude = data.city.coord.lon;
                        var latitude = data.city.coord.lat;
                        initMap(latitude, longitude);
                        console.log(longitude);
                        console.log(latitude);

                        //appends to html row
                        $("#weather").append(column);
                    }
                }
            }
        }
    )};
                   
    
    function initMap(latitude, longitude) {
    
        // var latMap = 47.6062;
        // var longMap = -122.3321;
        const myLatLng = { lat: latitude, lng: longitude };
        const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: myLatLng,
        });
    };    

});