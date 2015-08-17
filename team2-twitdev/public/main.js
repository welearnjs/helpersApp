$(function(){
    var arr = [];
    var socket = io( 'localhost:3000' );

    var tweetListLocation = document.getElementById('tweet-list-location');
    var tweetListNoLocation = document.getElementById('tweet-list-no-location');

    // request the tweets currently held on the server from the tweets endpoint
    $(document).ready(function() {

      $.getJSON( 'tweets', function( data ){
        var initialTweetsHtml;

        if( data.tweets !== null ){
          initialTweetsHtml= addInitialTweets( data.tweets );
          tweetListLocation.innerHTML = initialTweetsHtml.location;
          tweetListNoLocation.innerHTML = initialTweetsHtml.noLocation;
        }

      });
    });

    // on connection
    socket.on( 'connect', function() {
      console.log( 'connected' );
    });

    // callback to handle arrival of new tweets
    socket.on('tweet', function(tweetString){
      var tweet = JSON.parse( tweetString );
      var tweetData;

      tweetData = addTweet( tweet );

      if( tweetData.locationData ){
        tweetListLocation.innerHTML += tweetData.tableRow
      }
      else{
        tweetListNoLocation.innerHTML += tweetData.tableRow
      }
    });

});

// small method to iterate through an array of tweets and create a table row for
// each one. This is just placeholder functionality to demonstrate data
// definition.
function addInitialTweets( array ){
  var html = {
    location: '',
    noLocation: ''
  };
  var tweet;

  for( var i = 0; i < array.length; i++ ){
    tweet = addTweet( array[ i ] );

    if( tweet.locationData ){
      html.location += tweet.tableRow;
    }
    else{
      html.noLocation += tweet.tableRow;
    }
  }
  return html;
}

// function constructs a data object separating tweets that have data from those
// that haven't. For the moment, by creating separate, marked up strings that
// can easily passed to a table. This is placeholder functionality to
// demonstrate the data definition etc.
function addTweet( tweet ){
  var tweetData = {
    tableRow: '',
    locationData: false
  };

  if( tweet.lat !== undefined && tweet.lon !== undefined ){
    tweetData.tableRow += '<tr>' +
      '<td>' + tweet.username + '</td>' +
      '<td>' + tweet.lat      + '</td>' +
      '<td>' + tweet.lon      + '</td>' +
      '<td>' + tweet.text + '</td>' +
    '</tr>';

    tweetData.locationData = true;
  }
  else{
    tweetData.tableRow += '<tr>' + 
      '<td>' + tweet.username + '</td>' +
      '<td>' + tweet.text + '</td>' +
    '</tr>'
  }
    return tweetData;
}
