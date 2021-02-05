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

    function getWeather(searchCity) {

        var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchCity +'&appid=' + weatherAPI;

        fetch(weatherUrl)
            .then(function (response) {
                if(response.ok) {
                    response.json().then(function (data) {
                        //console.log(data);
                        //calls for the data to show make content, get forecast for five day, and UV index
                        makeContentForecast(data);
                        
                    })
                } else {
                    alert("City Not Found, Try Again.");
                }
            })
            .catch(function(error) {
                console.log("not able to connect")
            })
    }

    function makeContentForecast(data) {

        
        //creates the city title and adds date to it
        var info = (data.name + " (" + new Date().toLocaleDateString() + ")");
        var title = data.name;
        //math for converting kelvin to farenheit
        var kelvinFarenheit = Math.floor((data.main.temp -  273.15) *1.8 +32);

        //creates the card, adds the info from the data from the api to the card
        var weatherTitle = $('<h3 class="card-title" id="city">').text(title);
        var weatherCard = $('<article class="card weatherToday">');
        //var wind = $('<p class="card-text">').text("Wind Speed: " + data.wind.speed + "MPH");
       // var humidity = $('<p class="card-text">').text("Humidity: " + data.main.humidity + "%");
        var temperature= $('<p class="card-text">').text(kelvinFarenheit.toFixed() +  " °F");
        var card = $('<div class="card-body">');
        var image = $("<img class='img-weather'>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


        //appends it all together to add it to the html
        weatherTitle.append(image);
        card.append(weatherTitle, temperature);
        weatherCard.append(card);
        $("#weather").append(weatherCard);
    }

    function getForecast(searchCity) {
       //forecast url
       var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=" + weatherAPI + "&units=imperial"; 

       fetch(forecastUrl)
       .then(function (response) {
           if(response.ok) {
               
               //console.log(response);
               response.json().then(function (data) {
                    //length of the forecast
                var forecastLength = 5;
                //loops and creates only 5 days
                for(var i = 0; i < forecastLength; i++) {
            
                //create the dates title
                var forIn = i * 8 + 4;
                var forDate = new Date(data.list[forIn].dt * 1000);
                var forDay = forDate.getDate();
                var forMonth = forDate.getMonth() + 1;
                var forYear = forDate.getFullYear();
                var dateTxt = forMonth + "/" + forDay + "/" + forYear;
            
            
                //column with title, img, temp, humidity
                var column = $('<article class="forecast">');
            
                var cardT = $('<h5 class="forecast-date col">').text(dateTxt);

                var newImg = $('<img>').attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"); 
                var tempRound = data.list[i].main.temp_max
                var pt = $('<p class="txt col">').text(tempRound.toFixed() + "°F");
                //var pH = $('<p class="txt">').text("Humidity: " + data.list[i].main.humidity + "%");

                //appends info together
                cardT.append(newImg);
                column.append(cardT, pt);

            //appends to html row
            $("#weather").append(column);
            
        }
                   
                   
               }) 
           } 
       })
       .catch(function(error) {
           console.log("not able to connect")
       })

    }
        

});
