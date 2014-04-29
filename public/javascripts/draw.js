function drawLineGraph(key_value_list, svg_id)
{
	var width = 420+200,
        barHeight = 25;

    var x = d3.scale.linear()
        .domain([0, d3.max(key_value_list, function(d) { return +d.value; })])
        .range([0, width-200]);

	var y = d3.scale.linear()
	    .range([barHeight * key_value_list.length, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

    var chart = d3.select(svg_id)
        .attr("width", width)
        .attr("height", barHeight * key_value_list.length);

    var bar = chart.selectAll("g")
        .data(key_value_list)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(200," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("width", function(d) { return x(+d.value); })
        .attr("height", barHeight - 1);

    bar.append("text")
        .attr("x", function(d) { return x(d.value) - 3; })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.value; });

    bar.append("text")
        .attr("class", "label")
        .attr("x", -100)
        .attr("y", barHeight/2+4)
        .text(function(d) { return d.key; });
}
