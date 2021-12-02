function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObject =>
      sampleObject.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var id = result.otu_ids;
    var labels = result.otu_labels;
    var sv = result.sample_values;


    // 3. Create a variable that holds the washing frequency.
    var metadata = result.metadata;
    var wash = result.wfreq;
    
    console.log(wash)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = id.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();


    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sv.slice(0, 10).reverse(),
        text: labels.reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: id,
      y: sv,
      text: labels,
      mode: 'markers',
      marker: {
        color: id,
        size: sv,
        colorscale: "sunsetdark"
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: 'closest',
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {

        title: { text: "Hand Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        value: wash,

        gauge: {
          axis: { range: [0, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "black" },
          borderwidth: 1,
          bordercolor: "black",

          steps: [
            { range: [0, 2], color: "#009ee3" },
            { range: [2, 4], color: "00a3c9" },
            { range: [4, 6], color: "00a6aa" },
            { range: [6, 8], color: "00a989" },
            { range: [8, 10], color: "2eac66" }],

        }
      }

    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {

      margin: { t: 25, r: 25, l: 25, b: 25 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}