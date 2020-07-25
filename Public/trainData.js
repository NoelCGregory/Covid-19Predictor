let json;
let topicMenu;
let iterMenu;
let fileTxt;
let respTxt;
let countryMenu;
let dropZone;
let obj = null;
let trainBtn;
let data;

function preload(){
    data = loadJSON('main.json'); //Preloading all countries and topic names 
}
function setup(){
   initPage(); //calling initPage function
}

function initPage(){
   //Setting up Dom Elements
   topicTxt = select('#topicTxt');
   let tempArray = data.topic;

   //Setting up drop menus
   topicMenu = select('#topicMenu');
   for(let i = 0;i<tempArray.length;i++){
       topicMenu.option(tempArray[i]);

   }
   countryMenu = select('#countryMenu');
   tempArray = data.country; 
   for(let i = 0;i<tempArray.length;i++){
       countryMenu.option(tempArray[i]);
   }

   iterMenu = select('#iterMenu');
   iterMenu.option('5');
   iterMenu.option('10');
   for(let i= 1; i<= 40; i++){
    iterMenu.option(25 * i);
   }
   //setting up text elements  and drop zone
   fileTxt = select('#fileTxt');
   respTxt = select('#respTxt');
   dropZone = select('#drop-zone');
   trainBtn = select('#trainBtn');

   //mousePressed and drop function set
   trainBtn.mousePressed(sendData);
   dropZone.drop(gotFile);//sending json file to gotFile function

}

function formateFile(file){
    // Split file.data and get the base64 string
    let base32Str = file.data.split(",")[1];
    // Parse the base64 string into a JSON string
    let jsonStr = atob(base32Str);
    //parsing to json obj
    obj = JSON.parse(jsonStr);
    //setting file name
    fileTxt.html(file.name);
}

function gotFile(file){
    //Formate json
    formateFile(file)
}

function sendData(){
    //retreving all data from dom elements
    let topic = topicMenu.value();
    let country = countryMenu.value();
    let iter = Number(iterMenu.value());

    //checking if elements ar not blank
    if(topic != '' && country != '' && isFinite(iter) == true && obj != null){
        //data to send to server
        json = {
            topic: topic,
            country: country,
            iterations:iter,
            data:obj
        };
        let dataJson;
        //sending data in post request  to server
        (async () => {
            const rawResponse = await fetch('/addReg', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body:  JSON.stringify(json)
            });
            dataJson = await rawResponse.json();
            respTxt.html(dataJson.status + ' Overall Error:' + dataJson.Overallloss); //changing response text
          })();
        
    }else{
        alert('Please Enter All Inputs');
    }
}
