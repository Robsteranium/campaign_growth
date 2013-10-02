function draw_simple_row(data, title, parent_element) {
  // Prepare Drawing Space
  var simple_row = parent_element.append("div")
    .attr("class", "simple_row");
  var height = 100;
  var widths = { label: 100, chart: 300, stats: 200 };
  var time_bin_count = 50;

  // Prepare date data
  var clean_data         = data.filter(function(d) { return( d.timestamp > 1379631600 ); });  // Really ought to do this server side
  var tweet_dates        = clean_data.map(function(d) { return new Date(d.timestamp*1000); });
  var time_axis          = d3.time.scale().domain(d3.extent(tweet_dates)).range([0, widths.chart]);
  var tweet_rate         = d3.layout.histogram().bins(time_axis.ticks(time_bin_count))(tweet_dates);
  function cumulative_sum(i) {
    return d3.sum(tweet_rate.slice(0,i),function(d){return(d.y);});
  };
  var tweet_cumulative   = tweet_rate.map( function(d,i) { return { x: d.x, y: cumulative_sum(i) }; });
  var cumu_count_axis    = d3.scale.linear().domain(d3.extent(tweet_cumulative, function(d){return d.y;})).range([height,0]);
  var count              = tweet_dates.length;
  var rate_axis          = d3.scale.linear().domain(d3.extent(tweet_rate.map(function(d) { return d.length}))).range([height, 0]);
  var peak_rate          = parseInt(d3.max(tweet_rate, function(d){ return d.y }));
  var mean_rate          = parseInt(d3.mean(tweet_rate, function(d){ return d.y }));
  var time_bin_duration  = d3.time.format("%-Hh %Mm")(new Date(tweet_rate[0].dx)) // ok to use 0th while evenly sized bins

  // Title
  simple_row.append("div")
    .attr("class", "label")
    .append("h1")
      .text(title);

  // Sparkline
  function draw_spark_line(data, parent_svg) {
    var line = d3.svg.line()
      .x(function(d,i) { return time_axis(d.x); })
      .y(function(d,i) { return cumu_count_axis(d.y); });

    parent_svg.append("g").append("path").attr("d", line(data));
  }
  var spark_line_svg = simple_row.append("div")
    .attr("class", "sparkline")
    .append("svg")
      .attr("height", height)
      .attr("width", widths.chart);
  draw_spark_line(tweet_cumulative, spark_line_svg);

  // Count
  simple_row.append("div")
    .attr("class", "label")
    .append("h2")
      .text(count);

  // Histogram
  function draw_histogram(data, parent_svg) {
    var g = parent_svg.append("g")
    var bars = g.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + time_axis(d.x) + "," + rate_axis(d.y) + ")"; });

    bars.append("rect")
      .attr("x", function(d) { return time_axis(d.x); })
      .attr("width", widths.chart/time_bin_count)  // Must be a better way to do this with data[0].dx
      .attr("height", function(d) { return height - rate_axis(d.y); });
  }
  var histogram_svg = simple_row.append("div")
    .attr("class", "histogram")
    .append("svg")
      .attr("height", height)
      .attr("width", widths.chart);
  draw_histogram(tweet_rate, histogram_svg);

  // Stats
  var stats_div = simple_row.append("div")
    .attr("class", "stats");
  stats_div.append("p")
    .text("Peak "+peak_rate+" / "+time_bin_duration);
  stats_div.append("p")
    .text("Mean "+mean_rate+" / "+time_bin_duration);

}
