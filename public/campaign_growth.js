function draw_simple_row(data, title, parent_element) {
  var simple_row = parent_element.append("div")
    .attr("class", "simple_row");

  var height = 100;
  var widths = { label: 100, sparkline: 300, count: 100, histogram: 300, stats: 200 };

  // Title
  simple_row.append("div")
    .attr("class", "label")
    .append("h1")
      .text(title);

  // Sparkline

  function draw_spark_line(data, parent_svg) {
		var x = d3.scale.linear().domain([0,data.length]).range([0, widths.sparkline]);
		var y = d3.scale.linear().domain(d3.extent(data)).range([height, 0]);  

    var line = d3.svg.line()
      .x(function(d,i) { return x(i); })
      .y(function(d,i) { return y(d); });

    parent_svg.append("svg:g").append("svg:path").attr("d", line(data));
  }

  var cumulative_count_by_period = [1,2,2,3,3,4,5,5,6,6,6,6,7,8,8,9,9,9,10,11];
  var spark_line_svg = simple_row.append("div")
    .attr("class", "sparkline")
    .append("svg")
      .attr("height", height)
      .attr("width", widths.sparkline);
  draw_spark_line(cumulative_count_by_period, spark_line_svg);
  console.log(d3.extent(cumulative_count_by_period));

  // Count
  var count = data.length;
  simple_row.append("div")
    .attr("class", "label")
    .append("h1")
      .text(count);
}
