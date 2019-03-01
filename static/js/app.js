function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  //console.log("sample:",sample);
  // Use `d3.json` to fetch the metadata for a sample
  var url="/metadata/".concat(sample);
  //console.log("url:",url);

  // Use d3 to select the panel with id of `#sample-metadata`

  d3.json(url).then(function(data){
    var panel=d3.select("#sample-metadata");
    panel.html("");
    Object.entries(data).forEach(([key,value]) =>{
          // console.log(key,value);
           panel.append('h6').text(`${key} : ${value}`)});
  });



    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {
  var url="/samples/".concat(sample);
  //console.log("url:",url);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(data){
    // @TODO: Build a Pie Chart
    console.log(data.otu_ids.slice(0,10));
    var pie_data_arr=[{"values" : data.sample_values.slice(0,10),
                  "labels" : data.otu_ids.slice(0,10),
                  "type"   : "pie",
                  text : data.otu_labels.slice(0,10), 
                  hoverinfo : 'text+value+percent',
                  textinfo: 'percent'
                }];
    var layout = {title: 'Sample :'.concat(sample)};            
    Plotly.plot("pie",pie_data_arr,layout);            

  
    // @TODO: Build a Bubble Chart using the sample data
    var bubble_data_arr=[{x : data.otu_ids,
                          y : data.sample_values,
                        text: data.otu_labels,
                        mode : "markers",
                      marker : {size : data.sample_values,
                       color : data.otu_ids,
                      colorsacle: "Earth"}
                                        
                           }];
    var bubbleLayout = {
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };
   
    Plotly.plot("bubble",bubble_data_arr,bubbleLayout);

  });
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();




