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
  var latlist = {};
  var lonlist = {};

  // Loop over all nodes and create a property dictionary to count the occurence of each property
  for (var i = json_data.length - 1; i >= 0; i--) {
    var timestamp = json_data[i].properties.timestamp;
    var lat = json_data[i].properties.lat;
    var lon = json_data[i].properties.lon;
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
      latlist[key] += lat;
      lonlist[key] += lon;
    }
    else
    {
      console.log(timestamp);
      prop_list[key] = 1;
      latlist[key] = lat;
      lonlist[key] = lon;
    }
  };

  chartData = [];

  // Add the field_name counts to the chart data list
  for(var item in prop_list) 
  { 
    chartData.push({value: [prop_list[item], [latlist[item]/prop_list[item],lonlist[item]/prop_list[item]] ], key: item}); 
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
	var height = 400,
      bottomPad = 100;
      topPad = 50;
      maxWidth = 1000;

  var barWidth = maxWidth/key_value_list.length;
  if (barWidth < 15)
  {
    barWidth = 15;
  }

  var y = d3.scale.linear()
      .domain([0, d3.max(key_value_list, function(d) { return +d.value[0]; })])
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
      .attr("y", function(d) { return height-bottomPad - (y(+d.value[0])/2); })
      .attr("height", function(d) { return y(+d.value[0])/2; })
      .attr("width", barWidth - 1);

  bar.append("text")
      .attr("y", function(d) { return height-bottomPad - (y(+d.value[0])/2) - 20; })
      .attr("x", barWidth / 2 + 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.value[0]; });

  bar.append("text")
      .attr("class", "label")
      .attr("y", height-70)
      .attr("x", barWidth/2)
      .text(function(d) { return d.key; });

  bar.on("click", function(d){
      var timestamp = moment(d.key).valueOf();
      var lat = d.value[1][0];
      var lon = d.value[1][1];
      window.location.href = "/map?lat="+lat+"&lon="+lon+"&date="+timestamp;
      // loop through the key
  });
}

function chart(id, sort_by_key_or_value, field)
{
  $(id).empty();
  // the countField function counts the frequency of each value present in the desired field
  if (localData.length > 30)
  {
    chartData = bucketByTime('day', localData);
  }
  else
  {
    chartData = countField('date', localData);
  }
  // sort the timestamps to appear in chronological order
  sort(chartData,sort_by_key_or_value); 
  drawBarGraph(chartData, id);
}

function clickBar(timestamp)
{
  console.log("clicked bar with timestamp " + timestamp);
}
