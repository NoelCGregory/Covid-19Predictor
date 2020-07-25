//imports
const express = require('express');
const PolynomialReg = require('./Lib/PN.js'); //calling polynomial regression class
let fs = require('fs');
const { response } = require('express');
//Getting input.json file using fs
let data = JSON.parse(fs.readFileSync('./data/input.json'));
let inputs = data.input;

let app = express();
let port = process.env.PORT || 3000;
let server = app.listen(port,() => console.log('Listening')); //listening in port 3000

app.use(express.static('Public')); //setting webhost files

app.use(express.json({limit:'1mb'})); //limiting json file size

//setting graph route
app.get('/predGraph/:topic/:country',(request,response) =>{
    //setting variables
    let topic = request.params.topic;
    let country = request.params.country;
    let reply;
    let xAr = [];
    let predAr = [];
    let yAr = [];

    //checking if variables are not blank
    if(topic != '' || country != ''){
        for(let i = 0; i< inputs.length;i++){
            if(inputs[i].topic == topic && inputs[i].country == country){
                //getting b,a and c vlaue to predict graph 
                let b = inputs[i].b;
                let a = inputs[i].a
                let tempArray = inputs[i].data;
                let c = inputs[i].c;
                predAr = PolynomialReg.predict(tempArray.length,a,b,c); //prediction
                for(let j = 0; j<tempArray.length;j++){
                    let temp = Object.values(tempArray[j]);
                    let x = temp[0];
                    let y = temp[1];
                    xAr.push(x); //pushing x val
                    yAr.push(y);//pushing y orginal val
                }
            }
        }
        //checking and creating reply object
        if(xAr.length == 0 && yAr.length == 0){
            reply = {
                exist : false,
                status:"does not exist ,If you can upload your own data to train"
            };
        }else{
            reply = {
                exist : true,
                x:xAr,
                y:yAr,
                predAr:predAr
            };
        }
    }
    response.send(reply); //sending response
});
//setting get request to this route
app.get('/predDate/:topic/:country/:date',(request,response) =>{
    //setting variables
    let topic = request.params.topic;
    let country = request.params.country;
    let date = request.params.date;
    let reply;
    let predY;

    if(topic != '' || country != '' || date != ''){
        for(let i = 0; i< inputs.length;i++){
            if(inputs[i].topic == topic && inputs[i].country == country){
                let b = inputs[i].b;
                let a = inputs[i].a
                let lastDate = inputs[i].data[inputs[i].data.length-1].date;
                let tempArray = inputs[i].data;
                let c = inputs[i].c;
                //finding days pasted from last json date to selected date
                let from = new Date(lastDate);
                let to = new Date(date);
                let betweenDays = 0;
                for(let i = 0;i < tempArray.length;i++){
                    betweenDays++;
                }
                // loop for every day
                for (var day = from; day <= to; day.setDate(day.getDate() + 1)) {
                    betweenDays++;
                }
                if(betweenDays > 0){
                    betweenDays--;
                }
                let polyReg = new PolynomialReg(); //creating new instance
                polyReg.addModel(a,b,c); //adding weights
                predY = polyReg.predict(betweenDays); //predicting
            }
        }
        //sending response
        if(predY == 0 ){
            reply = {
                exist : false,
                status:"That date is already Grapghed"
            };
        }else{
            reply = {
                exist : true,
                predY:predY
            };
        }
    }
    response.send(reply); //sending reply object
})

//setting get request to this route
app.get('/getTopicAndCountries',(request,response) =>{
    //setting variables
    let topic = [];
    let reply;
    let countries = [];
    //getting all countries and topic
    for(let i = 0; i<inputs.length; i++){
        topic.push(inputs[i].topic);
        countries.push(inputs[i].country);
    }
    reply = {
        topics:topic,
        countries:countries
    }

    response.send(reply); //sending reply object
});
//setting up post route
app.post('/addReg',(request,response) =>{
    //setting variables 
    let tempData = request.body;
    let reply;
    let topic = tempData.topic;
    let country = tempData.country;
    let iterations =tempData.iterations;
    let polyReg = null; 
    let overalError = null;

    reply ={
        status:"Unsuccesful, please either change iteration or choose another topic and country"
    }

    let dataExist = inputs.some((obj) => obj.topic== topic && obj.country == country);
    if(dataExist == false){
        polyReg = new PolynomialReg();
        polyReg.addInputs(tempData.data[country]); //giving json data
        polyReg.train(iterations); //training
        //polyReg.printLoss(); used to print loss
        overalError = polyReg.lossHistory[polyReg.lossHistory.length-1];

        //creating rply object
        reply = {
            topic:topic,
            country:country,
            a:polyReg.a,
            b:polyReg.b,
            c: polyReg.c,
            totalIterations:iterations,
            Overallloss:overalError,
            data:tempData.data[country],
            status:'Succesfully Trained'
        };

        inputs.push(reply);
        let dataToString = JSON.stringify(data,null,2);
        fs.writeFileSync('./data/input.json',dataToString,(err) => err == null ? console.log('Error') :console.log('Updated Json File'));
    }

    response.send(reply);
});


