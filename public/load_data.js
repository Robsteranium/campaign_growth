d3.json("tweets.json", function(error, tweets) {
  var pane_simple = d3.select("#pane_simple");
  var dimensions = {
    margin: {top: 3, right: 3, bottom: 3, left: 3},
    outer: { width: 300, height: 80 }
  };

  // Prepare data
  var data           = tweets.filter(function(d) { return( d.timestamp > 1379631600 ); });  // Really ought to do this server side
  //var data           = tweets.filter(function(d) { return( d.timestamp > 1379673107 ); });  // TED start
  //var data           = tweets.filter(function(d) { return( d.timestamp > 1378135973 ); });  // Syria start
  //var data = tweets;

  // Tweets
  var tweet_times          = data.map(function(d) { return new Date(d.timestamp*1000); });
  var tweet_times_scale    = d3.time.scale().domain(d3.extent(tweet_times)).range([0, dimensions.outer.width]);
  var tweet_time_bin_count = 50;
  var tweet_rate           = d3.layout.histogram().bins(tweet_times_scale.ticks(tweet_time_bin_count))(tweet_times);
  var tweet_cumulative     = tweet_rate.map( function(d,i) { 
    return {
      x: d.x, 
      y: d3.sum(tweet_rate.slice(0,i),function(tr){return(tr.y);})
    };
  });
  var tweet_data = {
    sparkline: tweet_cumulative,
    histogram: tweet_rate
  }

  // Tweeters
  d3.first_element = function(array, f) {
    return d3.nest().key(f || String).map(array, d3.map).values()[0];// first tweet
  };

  var new_tweeters           = d3.first_element(data, function(d) { return d.user_id;});
  var tweeter_times          = new_tweeters.map(function(d) { return new Date(d.timestamp*1000); });
  var tweeter_rate           = d3.layout.histogram().bins(tweet_times_scale.ticks(tweet_time_bin_count))(tweeter_times);
  var tweeter_cumulative     = tweeter_rate.map( function(d,i) { 
    return {
      x: d.x, 
      y: d3.sum(tweeter_rate.slice(0,i),function(tr){return(tr.y);})
    };
  });
  var tweeter_data = {
    sparkline: tweeter_cumulative,
    histogram: tweeter_rate
  }


  // Reach
  var reach_times          = data.map(function(d) { return {x: new Date(d.timestamp*1000), y: d.reach}; });
  var reach_rate           = d3.layout.histogram().bins(tweet_times_scale.ticks(tweet_time_bin_count)).value(function(d){return d.x;})(reach_times);
  var reach_rate_scaled    = reach_rate.map( function(d) { return{ x: d.x, dx: d.dx, y: d3.sum(d,function(t){return t.y;}) }; });
  var reach_cumulative     = reach_rate_scaled.map( function(d,i) { 
    return {
      x: d.x, 
      y: d3.sum(reach_rate_scaled.slice(0,i),function(tr){return(tr.y);})
    };
  });
  var reach_data = {
    sparkline: reach_cumulative,
    histogram: reach_rate_scaled
  }

  // Draw simple rows
  draw_simple_row(tweet_data,   tweet_times_scale,   "Tweets",   pane_simple, dimensions);
  draw_simple_row(tweeter_data, tweet_times_scale, "Tweeters", pane_simple, dimensions);
  draw_simple_row(reach_data,   tweet_times_scale,   "Reach",    pane_simple, dimensions);
});
