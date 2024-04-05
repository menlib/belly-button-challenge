// The url with data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

function chart(sample) {
    d3.json(url).then((data)=> {
        let samples = data.samples;
        let array = samples.filter(sampleObj => sampleObj.id == sample);
        let results = array[0];

        let otu_ids = results.otu_ids;
        let otu_labels = results.otu_labels;
        let sample_values = results.sample_values;
        // Create the bubble chart
        let bubble_layer = {
            title:"title_name",
            margin:{
                t:30
            },
            hovermode: 'closest',
            xaxis:{
                title:"OTU_ID"
                
            }
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
        plotly.newPlot("bubble",bubble_data,bubble_layer)

        // Create the horizontal chart
        let horizontal_data = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type : 'bar',
            orientation: 'h'
        }];
        
        let layoutBar = {
            title: "OTU Data",
            xaxis: { title: "Sample Values"},
            yaxis: {title: "OTU IDs"}
        };
        plotly.newPlot("bar",horizontal_data,layoutBar)

        //To start the dashboard
        let names = data.names
        let dropdown = d3.select("#selDataSet");
        for (let i = 0, i < names.length; i++) {
            dropdown.appened("variable").text(names[i]).property("value",names[i]);
        
        }
        popPanel(names[0]);
        drawCharts(names[0])

    })
}