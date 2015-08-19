var Twitter = require('twitter');
var es = require('event-stream');
var express = require('express');
var credentials = require('./credentials.js');
var port = process.env.PORT || 3000;

var Helper = require('./helper.js');

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

// Small function to check whether a hashtag is present in a hashtag array. Very
// simple filter
function hashtagPresent( hashtagArr, hashtag){
  var filteredArray = hashtagArr.filter( function( arg ){
    return( arg.text.toLowerCase() === hashtag.toLowerCase() )
  });

  if( filteredArray.length > 0 ){
    return true;
  }
  else{
    return false;
  }
}

// Small function to check whether a helper is present in the te,p user array.
// If present, returns the user, if not, returns false.
// Very simple filter but should be replaced with db query eventually
function helperExists( userName ){
  var helpersFiltered = Helper.tempList.filter( function( arg ){
    return ( arg.userName === userName )
  });
  if( helpersFiltered.length === 0 ){
    return false;
  }
  else{
    return helpersFiltered[ 0 ];
  }
}

function addHelpPoints( tweetData ){
  var mentionsArray = tweetData.mentions;

  mentionsArray.forEach( function( mention ){
    var existingHelper = helperExists( mention.name );

    if( existingHelper ){
      existingHelper.iterate( tweetData );
    }
    else{
      var newUser = registerHelper( mention.name );
      newUser.iterate( tweetData );

    }
  });

}
function registerHelper( userName, location ){

  // check to see whether the helper already exists in the database (or in this
  // case, the temporary array! )
  var existingHelper = helperExists( userName );


  // if the user doesn't exist already, create a new helper record. If the user
  // does exist, check whether new location data has been provided, if it has,
  // add it to the record
  if( !existingHelper ){
    var helper = new Helper();
    helper.userName = userName;

    if( location ){
      helper.location.lat = location.lat;
      helper.location.lon = location.lon;
    }
    helper.add();
    return helper;
  }
  else{
    if( location ){
      if( existingHelper.location.lat !== location.lat ){
        existingHelper.location.lat = location.lat;
      }
      if( existingHelper.location.lon !== location.lon ){
        existingHelper.location.lon = location.lon;
      }
    }
    return existingHelper;
  }
}

// declare the trackQuery object outside of the function call, to simplify the
// process of adding new paramaters (follow etc )
var trackQuery = {
  track: '#welearnjs',
};


client.stream('statuses/filter',  trackQuery, function(stream){

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

