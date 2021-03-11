const { remote, app } = require('electron');
const fs = require('fs');
const { finished } = require('stream');
const request = require('request');    

let domain_ = ""
let acc_ = ""

var con = document.getElementById('button');
var back = document.getElementById('back');
var image = document.getElementById('image');
var h = document.getElementById('header');
var domaintitle = document.getElementById('domaintitle');
var error = document.getElementById('err');


function log(msg)
{
  var timestamp = Date.now(),
  date = new Date(timestamp)
  fs.appendFileSync(remote.app.getPath("userData") + "\\app.log", `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} | ${msg} \n`, function (err) {
    if (err) throw err;
  });
}


var win = remote.getCurrentWindow()
var application = remote.app
try 
{
    const data = fs.readFileSync(remote.app.getPath('userData') + '\\iserv.domain', 'utf8')
    console.log(data)
    domain_ = data;

} catch (err) {

  
}

try 
{
    const data = fs.readFileSync(remote.app.getPath('userData') + '\\iserv.acc', 'utf8')
    console.log(data)
    acc_ = data;

} catch (err) {

  
}


image.src = "https://" + domain_ + "/iserv/logo/logo.png"
domaintitle.innerHTML = domain_;
h.innerHTML = "Passwort für " + acc_ + ":"

con.addEventListener('click', () => { 

    enter()
    
});

back.addEventListener('click', () => { 

    fs.unlinkSync(remote.app.getPath('userData') + '\\iserv.domain')
    win.loadFile(__dirname + '/index.html')
    
});

function enter()
{
    console.log("Button was clicked") //CONSOLE LOG
    if(!input.value)
    {
        error.innerHTML = "Keine Angabe"
        return;
    }
    fs.writeFile(remote.app.getPath('userData') + '\\menu.showed', "menu showed => first use", function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile(remote.app.getPath('userData') + '\\update.later', "update later", function (err) {
        if (err) return console.log(err);
    });
    const options = {
        url: 'https://' + domain_ + "/iserv/app/login",
        method: 'POST',
        body: "_username="  +  acc_ + "&_password=" + input.value,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    
    //finish()
    log("Config: Password entered. Checking...")
    request(options, function(err, res, body) {;
        console.log(body);
        if(body != "")
        {
            console.log("wrong")
            error.innerHTML = "Name oder Passwort falsch"
            log("Config: wrong password entered")
        }
        else
        {
            fs.writeFileSync(remote.app.getPath('userData') + '\\iserv.pass', input.value, function (err) {
                if (err) return console.log(err);
            });
            finish()
        }
    });
    
}




function finish()
{
    log("#### CONFIG FINISHED => RELAUNCHING APP #####")
    application.relaunch();
    application.exit();
}