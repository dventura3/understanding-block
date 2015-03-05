var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
//var http = require('http');

var app = express();

/* Express configuration goes here: */
var SERVER_PORT = 3300;
app.use(
    function crossOrigin(req,res,next){
        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers','Content-Type, Authorization, Content-Length, X-Requested-With');

        if('OPTIONS' == req.method){
            res.send(200);
        }
        else
            next();
    }
);
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.listen(SERVER_PORT);
/*---------------end of configuration-------------------*/

var data = require("./data.json");

/*
* Function to save tmp files
*/
var saveFile = function(fileContent){
    fs.writeFile(__dirname + "/tmp/out.txt", fileContent, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file out.txt was saved!");
    }
    });
};


var getData = function(req,res){
    if(data)
        res.send(data);
    else
        res.send({});
}

var setNewGoal = function(req, res){
    if(req){
        //TODO: I should send the goal to the TC

        //currently I save the "curl" string to execute the Semantic Engine
        var tmp_data = {};
        tmp_data.data = req.body.goal;
        tmp_data.type = "action";

        console.log(JSON.stringify(tmp_data));

        var str_curl = "curl -d '";
        str_curl += JSON.stringify(tmp_data);
        str_curl += "' -H 'Content-Type: application/json' http://127.0.0.1:3740/se/discoveryObjs";

        saveFile(str_curl);

        res.send({success:true});
    }
    else
        res.send({success:false});
}

var updateObjectsKnown = function(req, res){
    //TODO
}

app.get("/data", getData);
app.post("/newGoal", setNewGoal);
app.put("/updateObjectsKnown", updateObjectsKnown);
