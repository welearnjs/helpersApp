/*
although ammap has methos like getAreaCenterLatitude and getAreaCenterLongitude,
they are not suitable in quite a lot of cases as the center of some countries
is even outside the country itself (like US, because of Alaska and Hawaii)
That's why wehave the coordinates stored here
*/

var latlong = {};
latlong["AE"] = {
"latitude": 24,
"longitude": 54
};
latlong["GB"] = {
"latitude": 54,
"longitude": -2
};
latlong["RU"] = {
"latitude": 60,
"longitude": 100
};
latlong["ZW"] = {
"latitude": -20,
"longitude": 30
};


var map;
var minBulletSize = 3;
var maxBulletSize = 70;
var min = Infinity;
var max = -Infinity;

AmCharts.theme = AmCharts.themes.black;


// build map
//
var chartData;

function buildChart(){
    map = new AmCharts.AmMap();

    map.addTitle("Help Count", 14);
    map.addTitle("#welearnjs", 11);

    map.areasSettings = {
      unlistedAreasColor: "#FFFFFF",
      unlistedAreasAlpha: 0.1
    };
    map.imagesSettings = {
      balloonText: "<span style='font-size:14px;'><b>[[title]]</b>: [[value]]</span>",
      alpha: 0.6
    }

    var dataProvider = {
      mapVar: AmCharts.maps.worldLow,
      images: [],
      lines: []
    }

    // create circle for each country

    // it's better to use circle square to show difference between values, not a radius
    var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
    var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

    // create circle for each country
    //for (var i = 0; i < mapData.length; i++) {
    for (var i = 0; i < chartData.length; i++) {
      var dataItem = chartData[i];
      var value = dataItem.help_count;

      // calculate size of a bubble
      var square = (value - min) / (max - min) * (maxSquare - minSquare) + minSquare;

      if (square < minSquare) {
        square = minSquare;
      }
      var size = Math.sqrt(square / (Math.PI * 2));
      var id = dataItem.country_code;

     // dataProvider.lines.push({
     //   latitudes: [latlong[id].latitude, 50.4422],
     //   longitudes: [latlong[id].longitude, 30.5367]
     // });

      dataProvider.images.push({
        type: "circle",
        width: size,
        height: size,
        color: '#d8854f',
        longitude: latlong[id].longitude,
        latitude: latlong[id].latitude,
        title: dataItem.username,
        value: value
      });
    }

    map.dataProvider = dataProvider;
    map.write("mapdiv");
}

//function to query chart_data end point and return data
function getChartData( callback ){
  $.getJSON( 'chart_data', function( data ){
    callback( data );
  })
  .fail( function( err ){
    console.log( err );
  });
}

function gotChartData( chart_data ){

  // set the variable declared outside of this scope, so it's available to the
  // build chart function
  chartData = chart_data;

  // get min and max values. These are use to calulate the radii of the points
  // on the chart
  for (var i = 0; i < chartData.length; i++) {
    var value = chartData[i].help_count;
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  }

  // if am charts is already ready, build the chart, otherwise, wait for it to
  // be ready
  if( AmCharts.isReady ){
    buildChart()
  }
  else{
    AmCharts.ready(function() {
      buildChart();
    });
  }
}

getChartData( gotChartData );
