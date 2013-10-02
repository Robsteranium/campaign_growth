function draw_simple_row(data, time_scale, title, parent_element, widths) {
  // Prepare Drawing Space
  var simple_row = parent_element.append("div")
    .attr("class", "simple row");
  var height = 80;

  var peak_rate          = parseInt(d3.max(data.histogram, function(d){ return d.y }));
  var mean_rate          = parseInt(d3.mean(data.histogram, function(d){ return d.y }));
  var time_bin_count     = data.sparkline.length;
  var count              = data.sparkline.slice(-1)[0].y;
  var cumu_count_axis    = d3.scale.linear().domain(d3.extent(data.sparkline, function(d){return d.y;})).range([height,0]);
  var rate_axis          = d3.scale.linear().domain(d3.extent(data.histogram.map(function(d) { return d.length}))).range([height, 0]);
  var time_bin_duration  = d3.time.format("%-Hh %Mm")(new Date(data.histogram[0].dx)) // ok to use 0th while evenly sized bins

  // Title
  simple_row.append("div")
    .attr("class", "col-md-1 title")
    .append("h2")
      .text(title);

  // Sparkline
  function draw_spark_line(data, parent_svg) {
    var line = d3.svg.line()
      .x(function(d,i) { return time_scale(d.x); })
      .y(function(d,i) { return cumu_count_axis(d.y); });

    parent_svg.append("g").append("path").attr("d", line(data));
  }
  var spark_line_svg = simple_row.append("div")
    .attr("class", "col-md-4 sparkline")
    .append("svg")
      .attr("height", height)
      .attr("width", widths.chart);
  draw_spark_line(data.sparkline, spark_line_svg);

  // Count
  simple_row.append("div")
    .attr("class", "col-md-1 count")
    .append("h2")
      .text(count);

  // Histogram
  function draw_histogram(data, parent_svg) {
    var g = parent_svg.append("g")
    var bars = g.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + time_scale(d.x) + "," + rate_axis(d.y) + ")"; });

    bars.append("rect")
      .attr("x", function(d) { return time_scale(d.x); })
      .attr("width", widths.chart/time_bin_count)  // Must be a better way to do this with data[0].dx
      .attr("height", function(d) { return height - rate_axis(d.y); });
  }
  var histogram_svg = simple_row.append("div")
    .attr("class", "col-md-4 histogram")
    .append("svg")
      .attr("height", height)
      .attr("width", widths.chart);
  draw_histogram(data.histogram, histogram_svg);

  // Stats
  var stats_div = simple_row.append("div")
    .attr("class", "col-md-2 stats");
  stats_div.append("p")
    .text("Peak "+peak_rate+" / "+time_bin_duration);
  stats_div.append("p")
    .text("Mean "+mean_rate+" / "+time_bin_duration);

}
