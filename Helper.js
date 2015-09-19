function Helper( ){
  this.userName  = ''
  this.helpCount = 0,
  this.helped    = [],
  this.detail    = []
  this.location  = {
    lat: 0,
    long: 0
  }
};

// add a method to add a new helper to the prototype
Helper.prototype.add = function(){
  console.log( 'Made it to add' );
  Helper.tempList.push( this );
  console.log( Helper.tempList );

}

Helper.prototype.iterate = function( tweetData ){
  console.log( 'Made it to iterate' );
  this.helpCount++;
  var detail = {
    helper:    this.userName,
    helped:    tweetData.userName,
    timestamp: tweetData.timestamp,
    text:      tweetData.text
  };
  this.detail.push( detail );
  console.log( Helper.tempList );
}

// Place to temporarily store the list of helpers until we have a database
// connection
Helper.tempList = [];

// export the helper prototype
module.exports = Helper;
