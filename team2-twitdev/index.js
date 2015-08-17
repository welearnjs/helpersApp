var Twitter = require('twitter');
var es = require('event-stream');
var express = require('express');
var port = process.env.PORT || 3000;

var app = express();
var tweetArr = [];

// Routing
app.get('/tweets', function( req, res ){
  if( tweetArr.length > 0 ){
    res.json( { tweets: tweetArr } );
  }
  else{
    res.send( { tweets: null } );
  }
});

app.use('/', express.static(__dirname + '/public'));

// Config oAuth
var client = new Twitter({
    consumer_key: 'x',
    consumer_secret: 'x',
    access_token_key: 'x',
    access_token_secret: 'x',
});

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

// Stream
// sample track:love
client.stream('statuses/filter', {track:'love'}, function(stream){ 
    stream.on('data', function(tweet) { 
        if (tweet.coordinates != null) {
            tweetArr.push({
                lat:tweet.coordinates.coordinates[1],
                lon:tweet.coordinates.coordinates[0],
                username:tweet.user.screen_name
            })
            
        }
        var decoded = strencode(tweetArr);
        io.sockets.emit('tweet', decoded );
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

