const { remote } = require('electron');
const {app} = require("electron").remote
const fs = require('fs');
const request = require('request');
const progress = require('request-progress'); 
const { exec } = require('child_process');
const _7z = require('7zip-min');
let ver = ""
const updateurl = 'https://github.com/better-iServ/iServ-Client/blob/main/updates/' 

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

console.log(remote.app.getPath("temp"))

var download = function(uri, filename){
  progress(request(uri), {
    // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
    // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
    // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
  })
  .on('progress', function (state) {
    document.getElementById("header").innerHTML = "<b>Update wird heruntergeladen...</b>"
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


download(updateurl + "iServ-Client-Update-"+ ver + ".exe?raw=true", remote.app.getPath("temp") + '\\iServ-Client-Update-' + ver + ".update")


function afterDwnld()
{
  console.log("downloaded new version")
  per.innerHTML = ""
  obj.innerHTML = ""
  document.getElementById("header").innerHTML = "<b>Download abgeschlossen!</b>"
  const finishDownload = new Notification('Download abgeschlossen!', {
    body: 'Das iServ-Client Update ' + ver + " wurde erfolgreich heruntergeladen! Der Installer wird gestartet..."
    //icon: remote.app.getPath("exe") + "\\resources\\app.asar\\src\\iserv_logo.png"
  })
  fs.writeFileSync(remote.app.getPath('userData') + '\\updated', ver, function (err) {
    if (err) return console.log(err); 
  });
  fs.renameSync(remote.app.getPath("temp") + '\\iServ-Client-Update-' + ver + ".update",remote.app.getPath("temp") + '\\iServ-Client-Update-' + ver + ".exe", function (err) {
    if (err) return console.log(err); 
  });
  exec("START " + remote.app.getPath("temp") + '\\iServ-Client-Update-' + ver + ".exe", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    app.exit()
  });






}

