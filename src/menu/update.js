const { remote, app } = require('electron');
const {BrowserWindow} = require("electron").remote
const fs = require('fs');
let ver = "" 
let notes = ""
let downloaded = false;
const updateurl = 'https://polkabeine.de/spielwiese/emil/iserv-client/' 
let icon = __dirname + "/updater_logo.png" 


var contin = document.getElementById('cont');
var change = document.getElementById('chan');
var header = document.getElementById('header')
var des = document.getElementById('des')
var status = document.getElementById('status')


var win = remote.getCurrentWindow()
var application = remote.app


try 
{
    ver = fs.readFileSync(remote.app.getPath('userData') + '\\updateVersion.txt', 'utf8')
    notes = fs.readFileSync(remote.app.getPath('userData') + '\\updateDescription.txt', 'utf8')

    header.innerHTML = "<b>iServ-Client v" + ver + "</b>";
    des.innerHTML = notes

} catch (err) {console.log(err)}




contin.addEventListener('click', () => { 

    startDownload()

});

change.addEventListener('click', () => { 

    fs.writeFile(remote.app.getPath('userData') + '\\update.later', "update later", function (err) {
        if (err) return console.log(err);
        remote.app.relaunch()
        remote.app.exit()
    });

});

function startDownload()
{

    win.hide()
    const loadingWin = new BrowserWindow({
        width: 520,
        height: 400,
        autoHideMenuBar: true,
        webPreferences: { 
            enableRemoteModule: true,
            nodeIntegration: true
        
        },
        frame: false,
        icon: icon
    });


    loadingWin.loadFile(__dirname + '/loading.html');

}
