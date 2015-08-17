$(function(){
    var arr = [];
    var socket = io( 'localhost:3000' );
    
    // on connection
    socket.on( 'connect', function() { 
        console.log( 'connected' );
    });
    tweets = document.getElementById('tweets');
    socket.on('tweet', function(tweet){
        console.log(tweet);
//        tweets.innerHTML = tweets.innerHTML + '<br>' + tweet;
        
    });

});






















