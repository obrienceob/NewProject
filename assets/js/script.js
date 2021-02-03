$(document).ready(function(){
    $("#search-btn").on('click', function(){
        addMaps()
        addInfo()
        function addMaps(){
            var mapLocation = $("#maps")
            var maps = $("<div id='map' class='column'>")
                .css({
                    "height":"500px",
                    "margin":"30px",
                    "margin-bottom":"0px",
                    "padding":"10px",
                    "border":"5px solid blue"
                    })
            mapLocation.append(maps)
        }
        function addInfo(){
            var locationInfo = $("#locationInfo")
            var topSites = $("<div id='sites' class='column is-7'>")
                .css({
                    "height":"500px",
                    "margin":"30px",
                    "margin-right":"0px",
                    "padding":"5px",
                    "border":"5px solid red"
                    })
            var weatherDashboard = $("<div id='weather' class='column is-4'>")
                .css({
                    "height":"500px",
                    "margin":"30px",
                    "margin-left":"10px",
                    "padding":"5px",
                    "border":"5px solid green"
                    })
            locationInfo.append(topSites)
            locationInfo.append(weatherDashboard)
        }

        
    })
});
