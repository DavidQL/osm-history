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

function bucketByTime(day_month_year, json_data)
{
  var prop_list = {};
    // Loop over all nodes and create a property dictionary to count the occurence of each property
    for (var i = json_data.length - 1; i >= 0; i--) {
      var timestamp = json_data[i].properties.timestamp;
      var key;
      var month = parseInt(moment(timestamp).month())+1;
      var date = parseInt(moment(timestamp).date())+1;

      if (month < 10)
      {
        month = "0"+month;
      }
      if (date < 10)
      {
        date = "0"+date;
      }

      if (day_month_year == 'day')
      {
        key = moment(timestamp).year() + '-' + month + '-' + date;
      }
      else if (day_month_year == 'month')
      {
        key = moment(timestamp).year() + '-' + month;
      }
      else
      {
        key = moment(timestamp).year();
      }
      
      if (prop_list[key])
      {
        prop_list[key]++;
      }
      else
      {
        console.log(timestamp);
        prop_list[key] = 1;
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

function sort(json_object, key_to_sort_by) {
    function sortByKey(a, b) {
        var x = a[key_to_sort_by];
        var y = b[key_to_sort_by];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }

    json_object.sort(sortByKey);
}

function drawBarGraph(key_value_list, svg_id)
{
	var height = 500,
      bottomPad = 100;
      topPad = 50;
      maxWidth = 1000;

  var barWidth = maxWidth/key_value_list.length;
  if (barWidth < 15)
  {
    barWidth = 15;
  }

  var y = d3.scale.linear()
      .domain([0, d3.max(key_value_list, function(d) { return +d.value; })])
      .range([0, height-20]);

	var x = d3.scale.linear()
	    .range([barWidth * key_value_list.length, 0]);

  var chart = d3.select(svg_id)
      .attr("height", height)
      .attr("width", barWidth * key_value_list.length);

  var bar = chart.selectAll("g")
      .data(key_value_list)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ","+topPad+")"; });

  bar.append("rect")
      .attr("y", function(d) { return height-bottomPad - (y(+d.value)/2); })
      .attr("height", function(d) { return y(+d.value)/2; })
      .attr("width", barWidth - 1);

  bar.append("text")
      .attr("y", function(d) { return height-bottomPad - (y(+d.value)/2) - 20; })
      .attr("x", barWidth / 2 + 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.value; });

  bar.append("text")
      .attr("class", "label")
      .attr("y", height-70)
      .attr("x", barWidth/2)
      .text(function(d) { return d.key; });
}
