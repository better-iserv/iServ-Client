const { remote } = require('electron');
const fs = require('fs');
request = require('request');

console.log("Started Configuration Window") //CONSOLE LOG
console.log("Current active path: " + remote.app.getPath("appData")) //CONSOLE LOG

var button = document.getElementById('button');
var input = document.getElementById('input');
var error = document.getElementById('err');
var header = document.getElementById('header');


var win = remote.getCurrentWindow()
var application = remote.app

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    
    });
};

button.addEventListener('click', () => { 

    enter()
    
});

function configFinished()
{
    application.relaunch()
    application.exit()
}

function enter()
{
    console.log("Button was clicked") //CONSOLE LOG
    if(!input.value)
    {
        error.innerHTML = "Keine Angabe"
        return;
    }
    if (input.value === "#")
    {
        input.value = "@josephinum.net"
    }
    domain_file = input.value.split("@");
    if(domain_file[1] === undefined)
    {
        error.innerHTML = "Keine E-Mailadresse"
        return;
    }

    fs.writeFile(remote.app.getPath('userData') + '\\iserv.domain', domain_file[1], function (err) {
        if (err) return console.log(err);
        error.innerHTML = ""
        header.innerHTML = "Verbinden mit " + domain_file[1] + "..."
        button.style.display = "none"
        input.style.display = "none"
    });

    fs.writeFile(remote.app.getPath('userData') + '\\menu.showed', "menu showed => first use", function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile(remote.app.getPath('userData') + '\\update.later', "update later", function (err) {
        if (err) return console.log(err);
    });
    
    request('http://' + domain_file[1], function (error, response, body) {
        
        if (!error && response.statusCode == 200) 
        {
            download('http://' + domain_file[1] + '/iserv/logo/logo.png', remote.app.getPath('userData') + '\\schul_logo.png', function(){

                console.log('Downloaded Logo from http://' + domain_file[1] + '/iserv/logo/logo.png'); //CONSOLE LOG
                configFinished();
            }); 
        }
        else
        {
            request('http://' + domain_file[1], function (error, response, body) {
        
                if (!error && response.statusCode == 200) 
                {
                    download('https://' + domain_file[1] + '/iserv/logo/logo.png', remote.app.getPath('userData') + '\\schul_logo.png', function(){
        
                        console.log('Downloaded Logo from https://' + domain_file[1] + '/iserv/logo/logo.png'); //CONSOLE LOG
                        configFinished();
                    }); 
                }
                else
                {
                    win.loadFile(__dirname + '/error.html');
                    console.error("Failed to connect to: " + domain_file[1]) //CONSOLE LOG
                    
                }
        
            });
        }

    });
}