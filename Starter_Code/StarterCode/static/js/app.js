// The url with data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Function to build charts
function chart(sample) {
    d3.json(url).then((data)=> {
        let samples = data.samples;
        let array = samples.filter(sampleObj => sampleObj.id == sample);
        let results = array[0];

        let otu_ids = results.otu_ids;
        let otu_labels = results.otu_labels;
        let sample_values = results.sample_values;

        // Create a Bubble Chart
        let bubble_layer = {
            title:"Bacteria Cultures Per Sample",
            margin:{
                t:30
            },
            hovermode: 'closest',
            xaxis:{title:"OTU_ID"},
            yaxis:{title:"Number of Bacteria"}    
            
        };
    
        let bubble_data = [{
            x: otu_ids,
            y:sample_values,
            text:otu_labels,
            mode:"markers",
            marker:{
                size:sample_values,
                color:otu_ids,
            }
        }
        ];
        Plotly.newPlot("bubble",bubble_data,bubble_layer)

        // Create a Bar Chart
        let horizontal_data = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type : 'bar',
            orientation: 'h'
        }];
        
        let layoutBar = {
            title: "Top 10 Bacteria Cultures Found",
            xaxis: { title: "Number of Bacteria"},
        
        };
        Plotly.newPlot("bar",horizontal_data,layoutBar)

    });
}

// Function to create the metadata panel
function Metadata(sample){
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let array = metadata.filter(sampleOBJ => sampleOBJ.id == sample);
        let results = array[0];

        let panel = d3.select('#sample-metadata').html('');

        for (key in results){
            panel.append("h6").text(`${key.toUpperCase()}: ${results[key]}`);
        };

    });
}

// Initialize with the first sample
function init(){
    let selData = d3.select("#selDataset");

    d3.json(url).then((data) => {
        let SampleNames = data.names;
    
        for (let i = 0; i < SampleNames.length; i++){
        selData.append("option").text(SampleNames[i]).property("value",SampleNames[i]);
    
    };
    let FirstName = SampleNames[0];
    Metadata(FirstName);
    chart(FirstName);
        });
    }

// Function to apply changes in the dropdown menu
function optionChanged(NewSample) {
    Metadata (NewSample);
    chart (NewSample); 
}
init(); 