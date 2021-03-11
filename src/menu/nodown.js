const { remote } = require('electron');
const {app} = require("electron").remote
const fs = require('fs');
const request = require('request');
const progress = require('request-progress'); 
const { exec } = require('child_process');
const extract = require('extract-zip');
let ver = ""
const updateurl = 'https://github.com/better-iServ/iServ-Client/blob/main/ext/' 


var obj = document.getElementById('status');
var per = document.getElementById('percent');
let remaining = ""
let speed = ""

document.getElementById("header").innerHTML = "<b>Download wird gestartet...</b>"
per.innerHTML = ""
obj.innerHTML = ""

var window = remote.getCurrentWindow()

var download = function(uri, filename){
  progress(request(uri), {
    // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
    // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
    // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
  })
  .on('progress', function (state) {
    document.getElementById("header").innerHTML = "<b>Pakete werden heruntergeladen...</b>"
    if (Math.round(state.time.remaining) > 60)
    {
      remaining =  "Verbleibend: ca. " + Math.round(state.time.remaining / 60) + "  Minuten"
    }
    else
    {
      remaining =  "Verbleibend: ca. " + Math.round(state.time.remaining) + "  Sekunden"
    }

    if (Math.round(state.speed / 1000) > 2000)
    {
      speed =  Math.round(state.speed / 1000 / 1000) + " MB/s"
    }
    else
    {
      speed =  Math.round(state.speed / 1000) + " KB/s"
    }

    if (Math.round(state.speed / 1000) < 50)
    {
      obj.innerHTML = "Langsame Internetverbindung! (" + speed + ")"
      per.innerHTML = Math.floor(state.percent * 100) + "%"
    }
    else
    {
      obj.innerHTML = speed + " | " + remaining
      per.innerHTML = Math.floor(state.percent * 100) + "%"
    }

    

    obj.innerHTML = speed + " | " + remaining
    per.innerHTML = Math.floor(state.percent * 100) + "%"

  })
  .on('error', function (err) {
    obj.innerHTML = "Es ist ein Fehler aufgetreten!"
    console.log(err)
  })
  .on('end', function (err) {
    console.log("!!!!!")
    afterDwnld();
  })
  
  .pipe(fs.createWriteStream(filename))

};


download(updateurl + "package.zip?raw=true", remote.app.getPath("userData") + '\\package.zip')

async function afterDwnld()
{
  document.getElementById("header").innerHTML = "<b>Wird entpackt...</b>"
  console.log("downloaded new version")
  per.innerHTML = ""
  obj.innerHTML = ""

  const unpack = await extract(remote.app.getPath("userData") + '\\package.zip', {dir: app.getPath('userData')})
  remote.app.relaunch()
  remote.app.exit()
}
