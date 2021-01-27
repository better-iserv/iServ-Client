const { remote } = require('electron');
const fs = require('fs');
request = require('request');

var button = document.getElementById('button');
var connectfail = document.getElementById('connectfail');
var domain = ""

var app = remote.app 

function start()
{
    try 
    {
      const data = fs.readFileSync(remote.app.getPath('userData') + '\\iserv.domain', 'utf8')
      domain = data
      connectfail.innerHTML = "Es konnte keine Verbindung aufgebaut zu <b>" + domain + "</b> werden! Entweder sind deine Angaben falsch oder der Server ist offline"
      
    
    } catch (err) {
      
        console.log("")
    }
}




button.addEventListener('click', () => {

    try {
        fs.unlinkSync(remote.app.getPath('userData') + '\\iserv.domain');
        console.log('successfully deleted pref file');
        app.relaunch()
        app.exit()
    } catch (err) {
        console.log(err);
    }

})

start();