const { remote } = require('electron');
const {app} = require("electron").remote
const fs = require('fs');
const request = require('request');
const progress = require('request-progress'); 
var exec = require('child_process').execFile;
const _7z = require('7zip-min');
let ver = ""
const updateurl = 'https://polkabeine.de/spielwiese/emil/iserv-client/' 

try 
{
    ver = fs.readFileSync(remote.app.getPath('userData') + '\\updateVersion.txt', 'utf8')


} catch (err) {console.log(err)}

var obj = document.getElementById('status');
var per = document.getElementById('percent');
let remaining = ""
let speed = ""

document.getElementById("header").innerHTML = "<b>Download wird gestartet...</b>"
per.innerHTML = ""
obj.innerHTML = ""

var download = function(uri, filename){
  progress(request(uri), {
    // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
    // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
    // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
  })
  .on('progress', function (state) {
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


download(updateurl + "iServ-Client-Setup-"+ ver + ".7z", remote.app.getPath("downloads") + '\\iServ-Client-Setup-' + ver + ".iserv-client-update")


function afterDwnld()
{
  console.log("downloaded new version")
  per.innerHTML = ""
  obj.innerHTML = ""
  document.getElementById("header").innerHTML = "<b>Download abgeschlossen!</b>"
  const finishDownload = new Notification('Download abgeschlossen!', {
    body: 'Das iServ-Client Update v' + ver + " wurde erfolgreich heruntergeladen!",
    icon: process.cwd() + "\\src\\iserv_logo.png"
  })
  fs.renameSync(remote.app.getPath("downloads") + '\\iServ-Client-Setup-' + ver + ".iserv-client-update", remote.app.getPath("downloads") + '\\iServ-Client-Setup-' + ver + ".7z", function(err){
    console.log(err)
    document.getElementById("header").innerHTML = "<b>Es ist ein Fehler aufgetreten!</b>"
    alert("Es ist ein Fehler aufgetreten!")
  })
 
  _7z.unpack(remote.app.getPath("downloads") + '\\iServ-Client-Setup-' + ver + ".7z", remote.app.getPath("downloads"), function(err){
    console.log(err)
    exec(remote.app.getPath("downloads") + '\\iServ-Client Setup 1.2.0.exe', function(err, data) {  
      console.log(err)
      console.log(data.toString()); 
      fs.unlinkSync(remote.app.getPath("downloads") + '\\iServ-Client-Setup-' + ver + ".7z", function(err){
        console.log(err)
      })
      
                              
    });
    app.exit() 

  });
}

