d3.json("tweets.json", function(error, tweets) {
  var pane_simple = d3.select("#pane_simple");
  draw_simple_row(tweets, "Tweets", pane_simple);
});
