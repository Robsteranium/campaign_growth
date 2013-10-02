function draw_simple_row(data, time_scale, title, parent_element, dimensions) {
  // Prepare Drawing Space
  var simple_row = parent_element.append("div")
    .attr("class", "simple row");
  var width  = dimensions.outer.width - dimensions.margin.left - dimensions.margin.right;
  var height = dimensions.outer.height - dimensions.margin.top - dimensions.margin.bottom;

  var peak_rate          = parseInt(d3.max(data.histogram, function(d){ return d.y }));
  var mean_rate          = parseInt(d3.mean(data.histogram, function(d){ return d.y }));
  var time_bin_count     = data.sparkline.length;
  var count              = data.sparkline.slice(-1)[0].y;
  var cumu_count_axis    = d3.scale.linear().domain(d3.extent(data.sparkline, function(d){return d.y;})).range([height,0]);
  var rate_axis          = d3.scale.linear().domain(d3.extent(data.histogram.map(function(d) { return d.y}))).range([height, 0]);
  var time_bin_duration  = d3.time.format("%-Hh%Mm")(new Date(data.histogram[0].dx)) // ok to use 0th while evenly sized bins

  // Title
  simple_row.append("div")
    .attr("class", "col-md-1 title")
    .append("h4")
      .text(title);

  // Sparkline
  function draw_spark_line(data, parent_g) {
    var line = d3.svg.line()
      .x(function(d,i) { return time_scale(d.x); })
      .y(function(d,i) { return cumu_count_axis(d.y); });

    parent_g.append("path")
      .attr("d", line(data));

    parent_g.append("text")
      .attr("x", dimensions.outer.width - dimensions.margin.right)
      .attr("y", dimensions.text.height - dimensions.margin.top)
      .text(count);
  }
  var spark_line_g = simple_row.append("div")
    .attr("class", "col-md-5 sparkline")
    .append("svg")
      .attr("height", height + dimensions.margin.top + dimensions.margin.bottom)
      .attr("width", width + dimensions.margin.left + dimensions.margin.right)
    .append("g")
      .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");
  draw_spark_line(data.sparkline, spark_line_g);

  // Histogram
  function draw_histogram(data, parent_g) {
    var bars = parent_g.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + time_scale(d.x) + "," + rate_axis(d.y) + ")"; });

    bars.append("rect")
      .attr("x", 1)
      .attr("width", width/time_bin_count-2)  // Must be a better way to do this with data[0].dx
      .attr("height", function(d) { return height - rate_axis(d.y); });

    parent_g.append("text")
      .attr("x", dimensions.outer.width - dimensions.margin.right)
      .attr("y", rate_axis(peak_rate) + 0.5*dimensions.text.height)
      .text("Peak "+peak_rate+" / "+time_bin_duration);

    parent_g.append("text")
      .attr("x", dimensions.outer.width - dimensions.margin.right)
      .attr("y", rate_axis(mean_rate) + 0.5*dimensions.text.height)
      .text("Mean "+mean_rate+" / "+time_bin_duration);
  }
  var histogram_g = simple_row.append("div")
    .attr("class", "col-md-5 col-offset-1 histogram")
    .append("svg")
      .attr("height", height + dimensions.margin.top + dimensions.margin.bottom)
      .attr("width", width + dimensions.margin.left + dimensions.margin.right)
    .append("g")
      .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");
  draw_histogram(data.histogram, histogram_g);
}


function draw_detail_chart(data, time_scale, title, parent_element) {



}
