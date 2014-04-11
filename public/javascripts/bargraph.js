function countProperty(property_name, json_data)
{
	var prop_list = {};
    // Loop over all nodes and create a property dictionary to count the occurence of each property
    for (var i = json_data.length - 1; i >= 0; i--) {
      if (prop_list[json_data[i].properties[property_name]])
      {
        prop_list[json_data[i].properties[property_name]]++;
      }
      else
      {
        prop_list[json_data[i].properties[property_name] ]= 1;
      }
    };

    chartData = [];

    // Add the property_name counts to the chart data list
    for(var item in prop_list) 
    { 
      chartData.push({value: prop_list[item], key: item}); 
    };

    return chartData;
}

function countField(field_name, json_data)
{
	var prop_list = {};
    // Loop over all nodes and create a property dictionary to count the occurence of each property
    for (var i = json_data.length - 1; i >= 0; i--) {
      if (prop_list[json_data[i][field_name]])
      {
        prop_list[json_data[i][field_name]]++;
      }
      else
      {
        prop_list[json_data[i][field_name] ]= 1;
      }
    };

    chartData = [];

    // Add the field_name counts to the chart data list
    for(var item in prop_list) 
    { 
      chartData.push({value: prop_list[item], key: item}); 
    };

    return chartData;
}


function drawBarGraph(key_value_list, svg_id)
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

    /*chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + barHeight * key_value_list.length + ")")
      .call(xAxis);*/

  	/*chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);*/

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

function sort(json_object, key_to_sort_by) {
    function sortByKey(a, b) {
        var x = a[key_to_sort_by];
        var y = b[key_to_sort_by];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }

    json_object.sort(sortByKey);
}