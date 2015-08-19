var Twitter = require('twitter');
var es = require('event-stream');
var express = require('express');
var credentials = require('./credentials.js');
var port = process.env.PORT || 3000;

var app = express();
var tweetArr = [];

// Routing
app.get('/tweets', function( req, res ){
  if( tweetArr.length > 0 ){
    res.json( { tweets: tweetArr } );
  }
  else{
    res.json( { tweets: null } );
  }
});


app.get('/chart_data', function( req, res ){
  var helpData = [{
    username: 'abc',
    country_code: 'RU',
    help_count: 10
  },{
    username: 'def',
    country_code: 'ZW',
    help_count: 4
  },{
    username: 'ghi',
    country_code: 'GB',
    help_count: 15
  },{
    username: 'jkl',
    country_code: 'AE',
    help_count: 3
  }];

  res.json( helpData );
});

app.use('/', express.static(__dirname + '/public'));

// Config oAuth
var twitterCreds = credentials.twitter;
var client = new Twitter( twitterCreds );

// Server
var server = require('http').createServer(app);

// Listen
server.listen(port, function() {
  console.log('Server listening at port %d', port);
});

// Socket.io
var io = require('socket.io')(server);

// Any time you need to send data between client and server (or vice versa), encode before sending,and decode upon receiving. Explanation -> https://gist.github.com/dougalcampbell/2024272
function strencode( data ) {
  return unescape( encodeURIComponent( JSON.stringify( data ) ) );
}

//var trackQuery = '#welearnjs';
var trackQuery = '#love';

client.stream('statuses/filter', { track: trackQuery }, function(stream){

  stream.on('data', function( tweet ) {

    // create a new data object with just the data we need
    var abridgedTweetData = {
      username: tweet.user.screen_name,
      text: tweet.text,
      mentions: tweet.entities.user_mentions
    }

    // if coordinates are present, add them to the new data object
    if ( tweet.coordinates !== null ) {
      abridgedTweetData.lat = tweet.coordinates.coordinates[1];
      abridgedTweetData.lon = tweet.coordinates.coordinates[0];

      // for the moment, I only want tweets with location data
      tweetArr.push( abridgedTweetData );

      var decoded = strencode( abridgedTweetData );
      io.sockets.emit( 'tweet', decoded );
    }

  });
});


// 1. Create web server 
// V

// 2. Stream Begin
// V

// 3. Stream end


// 4. Stream interval


// 5. Update counter for tweet_creator + helper_suggested, if tweet have hashtag #welearnjs && location

// 6. If tweet doesn't have a location provided, but have a #hashtag, add to a separate array (and also update counter for tweet_creator + helper_suggested)

