const { remote, app } = require('electron');
const fs = require('fs');
request = require('request');

console.log("Started Configuration Window") //CONSOLE LOG
console.log("Current active path: " + remote.app.getPath("appData")) //CONSOLE LOG

function log(msg)
{
  var timestamp = Date.now(),
  date = new Date(timestamp)
  fs.appendFileSync(remote.app.getPath("userData") + "\\app.log", `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} | ${msg} \n`, function (err) {
    if (err) throw err;
  });
}

var button = document.getElementById('button');
var input = document.getElementById('input');
var error = document.getElementById('err');
var header = document.getElementById('header');


var win = remote.getCurrentWindow()
var application = remote.app
var password = true;

if (fs.existsSync(application.getPath('userData') + "\\iserv.domain")) {
    configFinished()
}



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
    win.loadFile(__dirname + '/pass.html');
    log("Config: Domain and account saved to files. Launching password page...")
}

function enter()
{
    console.log("Button was clicked") //CONSOLE LOG
    if(!input.value)
    {
        error.innerHTML = "Keine Angabe"
        return;
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
    fs.writeFile(remote.app.getPath('userData') + '\\iserv.acc', domain_file[0], function (err) {
        if (err) return console.log(err);
    });
    
    request('http://' + domain_file[1], function (error, response, body) {
        
        if (!error && response.statusCode == 200) 
        {
            download('http://' + domain_file[1] + '/iserv/logo/logo.png', remote.app.getPath('userData') + '\\schul_logo.png', function(){

                console.log('Downloaded Logo from http://' + domain_file[1] + '/iserv/logo/logo.png'); //CONSOLE LOG
                configFinished();
                log("Config: Connected to " + domain_file[1])
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
                        log("Config: Connected to " + domain_file[1])
                    }); 
                }
                else
                {
                    win.loadFile(__dirname + '/error.html');
                    log("Failed to connect to " + domain_file[1])
                    console.error("Config: Failed to connect to: " + domain_file[1]) //CONSOLE LOG
                    
                }
        
            });
        }

    });
}