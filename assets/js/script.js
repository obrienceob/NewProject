$(document).ready(function(){
    $("#search-btn").on('click', function(){
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
            
            locationInfo.append(topSites)
            locationInfo.append(weatherDashboard)
        }

        
    })
});