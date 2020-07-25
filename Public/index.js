let topicMenu;
let countryMenu;
let json;
let respTxt;
let dataJson;
let data;

function preload(){
    data = loadJSON('main.json'); //Preloading topics 
}

function setup(){
    //Getting all countries from server
    (async () =>{
        const response = await fetch('/getTopicAndCountries');
        json = await response.json();
        initPage();
    })(); 
}
function initPage(){
   //Setting up Dom Elements
   topicTxt = select('#topicTxt');

   //Setting up drop menus
   let tempArray = data.topic;
   respTxt = select('#respTxt');

   //Setting up drop menus
   topicMenu = select('#topicMenu');
   for(let i = 0;i<tempArray.length;i++){
       topicMenu.option(tempArray[i]);

   }
   countryMenu = select('#countryMenu');
   tempArray = json.countries; 
   for(let i = 0;i<tempArray.length;i++){
       countryMenu.option(tempArray[i]);
   }
   
   //setting up buttons
   let predBtn = select('#predBtn');
   let graphBtn = select('#graphBtn');
   //setting mouse pressed event
   graphBtn.mousePressed(grapghData);
   predBtn.mousePressed(getDate);
}

function getDate(){
    //sending selected date
    let date = select('#date');
    let dateVal = date.value();
    let topic = topicMenu.value();
    let country = countryMenu.value();
    //checking if variables are not blank
    if(topic != '' && country != ''){
        let url = '/predDate/'+topic+'/'+country+'/'+dateVal;
        //get request to server
        (async () => {
            const rawResponse = await fetch(url);
            dataJson = await rawResponse.json();
            respTxt.html(' Prediction:' + dataJson.predY.toFixed(2));
        })();
    }else{
        alert('Please Enter All Inputs');
    }
}

function grapghData(){
    let topic = topicMenu.value();
    let country = countryMenu.value();
    //checking if variables are not blank
    if(topic != '' && country != ''){
        let url = '/predGraph/'+topic+'/'+country;
        //get request
        (async () => {
            const rawResponse = await fetch(url);
            dataJson = await rawResponse.json();
            if(dataJson.exist == true){
                createChart(dataJson,topic,country); //creating chart with response data
            }else{
                respTxt.html(dataJson.status);
            }
          })();
        
    }else{
        alert('Please Enter All Inputs');
    }
}

function createChart(data,topic,country){
    //Creating chart with chart.js
    let ctx = document.getElementById('chart').getContext('2d');
    let myChart = new Chart(ctx,{
        type: 'line',
        data: {
            labels: data.x,
            datasets: [{
                label: 'Orginal Data',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
                data: data.y,
            },{
                label: 'Predicted Data',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor:  'rgba(54, 162, 235, 1)',
                fill: false,
                data: data.predAr,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: `${topic} ${country }`
            },
            scales: {
                xAxes: [{
                    display: true,
                }],
                yAxes: [{
                    display: true,
                    type: 'logarithmic',
                }]
            }
        }
    });
}