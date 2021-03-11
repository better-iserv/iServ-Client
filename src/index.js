const { app, BrowserWindow, Notification, BrowserView, Menu, Tray, session, nativeTheme, net, ClientRequest, chrome} = require('electron')
const fs = require('fs');
//const { chrome } = require('process');
const request = require('request');
const discord = require('discord-rich-presence')('815937133209583616');
const open = require('open');


let domain = ""
let pass = ""
let acc = ""
firstUse = true
menuShowed = false;
let icon = __dirname + "/iserv_logo.png"

let started = Date.now();
let state = ""

let dm = false;

function log(msg)
{
  var timestamp = Date.now(),
  date = new Date(timestamp)
  fs.appendFileSync(app.getPath("userData") + "\\app.log", `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} | ${msg} \n`, function (err) {
    if (err) throw err;
  });
}



const updateurl = 'https://raw.githubusercontent.com/better-iServ/iServ-Client/main/updates/'

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  
  });
};

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

function checkUpdates()
{
  log("Checking for updates...")
  try {
    fs.unlinkSync(app.getPath('userData') + '\\updateDescription.txt');
    fs.unlinkSync(app.getPath('userData') + '\\updateVersion.txt');
    console.log('successfully deleted descrip and version file');
    
  } catch (err) {
    console.log("no des or ver file was found");
  }

  fs.access(app.getPath('userData') + "\\updated", function (err) {
    if (!err) {
      if(!fs.access(app.getPath('userData') + "\\NotificationManager"))
      {
        console.log("package update required but no packages installed")
      }
      else
      {
        console.log("package update required")
        fs.unlinkSync(app.getPath('userData') + "\\package.zip")
        fs.unlinkSync(app.getPath('userData') + "\\updated")
        fs.rmdirSync(app.getPath('userData') + "\\ext", { recursive: true });
        fs.rmdirSync(app.getPath('userData') + "\\NotificationManager", { recursive: true });
      }
    } 
    else {
      console.log("no package update required")
    }
  });

  request(updateurl, function (error, response, body) {
        
    if (!error && response.statusCode == 400) 
    {
        download(updateurl + "updateVersion.txt", app.getPath('userData') + '\\updateVersion.txt', function(){
  
          console.log("Downloaded update-version File")
          try 
          {
            const updateVersion = fs.readFileSync(app.getPath('userData') + '\\updateVersion.txt', 'utf8')
            let updateCompare = updateVersion.split(".")
            let versionCompare = app.getVersion().split(".")
            if (parseInt(updateCompare.join(""), 10) > parseInt(versionCompare.join(""), 10))
            {
              try 
              {
                let updateLater = fs.readFileSync(app.getPath('userData') + '\\update.later', 'utf8')
                let x = updateLater;
                try {
                  fs.unlinkSync(app.getPath('userData') + '\\update.later');
                  console.log('successfully deleted update file');
                  
                } catch (err) {
                  console.log("Update later");
                  log("configured to: Update later")
                }
                log("No Update required")
                start()

              } 
              catch (err)
              {
                log("Update rqeuired: Launching Update Window...")
                update()
              }
              

            }
            else
            {
              start()
            }    
      
          } catch (err) {
     
          }
  
        }); 
    }
    else
    {

      start()

    }
  });



  
}

function splash()
{
  splashWin = new BrowserWindow({
    width: 400,
    height: 250,
    autoHideMenuBar: true,
    webPreferences: { 
      enableRemoteModule: true,
      nodeIntegration: true
    },
    icon: icon,
    frame: false,
    transparent: true,
    alwaysOnTop: true
  });
  if(!dm)
  {
    splashWin.loadFile(__dirname + "/splash.html")  
  }
  else
  {
    splashWin.loadFile(__dirname + "/splashDarkmode.html")    
  }


}

function start()
{
  log("Starting App...")

  if (!fs.existsSync(app.getPath('userData') + "\\current.theme")) {
    fs.writeFile(app.getPath('userData') + '\\current.theme', "0", function (err) {
      if (err) return console.log(err);
    });
  }


 
  try {
    fs.unlinkSync(app.getPath('userData') + '\\updateVersion.txt');
    fs.unlinkSync(app.getPath('userData') + '\\updateDescription.txt');

    
  } catch (err) {

  }

  try 
  {
    const data = fs.readFileSync(app.getPath('userData') + '\\iserv.domain', 'utf8')
    acc = fs.readFileSync(app.getPath('userData') + '\\iserv.acc', 'utf8')
    pass = fs.readFileSync(app.getPath('userData') + '\\iserv.pass', 'utf8')
    domain = data
    firstUse = false
    
    try 
    {
      const menushowed = fs.readFileSync(app.getPath('userData') + '\\menu.showed', 'utf8')
      let x = menushowed;
      menuShowed = true
      try {
        fs.unlinkSync(app.getPath('userData') + '\\menu.showed');
        console.log('successfully deleted menu file');
        
      } catch (err) {

      }
      runApp()


    } catch (err) {
      if(!menuShowed)
      {
        if (!fs.existsSync(app.getPath('userData') + "\\NotificationManager")) {
          package()
        }
        else
        {
          menu() 
        }
      }   
    }

  } catch (err) {
    if(firstUse)
    {
      if (!fs.existsSync(app.getPath('userData') + "\\NotificationManager"))
      {
        package()
      }
      else
      {
        config()
      }
    }    
  }
}

function package()
{

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
  loadingWin.loadFile(__dirname + '/menu/nodown.html');
  splashWin.close()

}

function config()
{
  log("Launching Cofiguration Window...")
  const confWin = new BrowserWindow({
    width: 450,
    height: 700,
    autoHideMenuBar: true,
    webPreferences: { 
      enableRemoteModule: true,
      nodeIntegration: true
    },
    icon: icon
    //icon: __dirname + "/icon.png"
  });

  splashWin.close()

  confWin.loadFile(__dirname + '/config/index.html');



}

function menu()
{
  log("Launching Menu Window...")
  const menWin = new BrowserWindow({
    width: 500,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: { 
      enableRemoteModule: true,
      nodeIntegration: true,
      webSecurity: false
    },
    icon: icon
  });

  splashWin.close()

  menWin.loadFile(__dirname + '/menu/menu.html');
}

function update()
{
  download(updateurl + "updateDescription.txt", app.getPath('userData') + '\\updateDescription.txt', function(){

    const menWin = new BrowserWindow({
      width: 500,
      height: 850,
      autoHideMenuBar: true,
      webPreferences: { 
        enableRemoteModule: true,
        nodeIntegration: true
      },
      icon: icon
    });

    splashWin.close()
  
    menWin.loadFile(__dirname + '/menu/update.html');

  })
  

}

function runApp () { 
  log("Launching Main...")
  const theme = fs.readFileSync(app.getPath('userData') + '\\current.theme', 'utf8')
  if(theme === undefined)
  {
    console.log("default theme activated");
    dm = false;
    
  } 
  else if(theme === "0")
  {
    console.log("default theme activated");
    dm = false;

  } 
  else if(theme === "1")
  {
    session.defaultSession.loadExtension(app.getPath('userData') + "\\ext\\themes\\dark");
    dm = true
  } 
  else if(theme === "2")
  {
    session.defaultSession.loadExtension(app.getPath('userData') + "\\ext\\themes\\sithLord");
    dm = true;

  } 
  else if(theme === "3")
  {
    session.defaultSession.loadExtension(app.getPath('userData') + "\\ext\\themes\\deepOcean");

  } 
  else if(theme === "4")
  {
    session.defaultSession.loadExtension(app.getPath('userData') + "\\ext\\themes\\pinkForest");

  } 


  let win_icon = app.getPath('userData') + "\\schul_logo.png"

  let info = 'https://' + domain + '/iserv/infodisplay/index'
  let mail = 'https://' + domain + '/iserv/mail'
  let exer = 'https://' + domain + '/iserv/exercise'
  let file = 'https://' + domain + '/iserv/file'
  let cal = 'https://' + domain + '/iserv/calendar'
  let address = 'https://' + domain + '/iserv/addressbook/personal'
  let forum = 'https://' + domain + '/iserv/forums'
  let mess = 'https://' + domain + '/iserv/messenger'
  let news = 'https://' + domain + '/iserv/news'


  const win = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: win_icon,
        webPreferences: {
          nodeIntegration: true
        },
        menu: false
  });

  win.setMenu(null)
  win.setTitle(domain + " - iServClient")
  win.setBounds({ x: 0, y: 0, width: 1000, height: 600 })
  win.loadURL('https://' + domain + '/iserv/app/login', {
    postData: [{
      type: 'rawData',
      bytes: Buffer.from('_username=' + acc + '&_password=' + pass)
    }],
    extraHeaders: 'Content-Type: application/x-www-form-urlencoded'
  })
  log("Connecting to " + domain + "...")
  log("Logging in as: " + acc)

  win.on('did-fail-load', function() {});
  win.webContents.on('did-fail-load', () => {log("LOADING PROCESS FAILED")});
  win.webContents.on('did-stop-loading', () => {
    
    win.webContents.executeJavaScript(`function buttonInsert(){var i=document.createElement("button"),n=document.createElement("p"),t=document.querySelector("#iserv_exercise_upload_submit"),d=document.querySelector("#iserv_exercise_upload > div:nth-child(1) > div > div > div > div.btn-toolbar > button"),o=document.querySelector("#iserv_exercise_upload > div:nth-child(1) > div > div > div > div.btn-toolbar > div.file-picker-container > button"),r=document.querySelector("#iserv_exercise_upload > div:nth-child(1) > div > div > div > div.btn-toolbar > div.file-universal-dropzone-hint");t.style.display="none",d.style.display="none",o.style.display="none",r.style.display="none",i.innerText="Im Browser Abgeben",i.className="btn btn-success",n.innerHTML="Leider ist das hochladen von Dateien im Aufgabenmodul mit dem iServ Client nicht möglich. Du kannst diese nur im Browser abgeben",document.querySelector("#iserv_exercise_upload > div:nth-child(4) > div").appendChild(n),document.querySelector("#iserv_exercise_upload > div:nth-child(4) > div").appendChild(i),i.addEventListener("click",()=>{console.log("BetterIservButtonClicked|" + window.location)})}buttonInsert();`)

    let url = win.webContents.getURL()
    if(url.includes("mail"))
    {
      state = "E-Mail"
    }
    else if(url.includes("exercise"))
    {
      state = "Aufgabenmodul"
    }
    else if(url.includes("file"))
    {
      state = "Dateien"
    }
    else if(url.includes("calendar"))
    {
      state = "Kalendar"
    }
    else
    {
      state = "Startseite"
    }
    
    discord.updatePresence({
      state: state,
      startTimestamp: started,
      largeImageKey: 'iserv_logo',
      instance: true,
    });

    splashWin.close()
  });
  win.webContents.on('did-start-loading', () => {splash()});


  win.webContents.on("console-message", (event, level, message) => {
    if(message.includes("BetterIservButtonClicked"))
    {
      open(message.split("|")[1])
    }
  })



  win.setThumbarButtons([
    {
      tooltip: 'Aufgaben',
      icon: __dirname + '/png/ex.png',
      click() { win.loadURL(exer), win.show() }
    },

    {
      tooltip: 'E-Mail',
      icon: __dirname + '/png/mail.png',
      click() { win.loadURL(mail), win.show() }
    },
    {
      tooltip: 'Infobildschirm',
      icon: __dirname + '/png/info.png',
      click() { win.loadURL(info), win.show() }
    },
    {
      tooltip: 'Dateien',
      icon: __dirname + '/png/file.png',
      click() { win.loadURL(file), win.show() }
    },
    {
      tooltip: 'Kalender',
      icon: __dirname + '/png/cal.png',
      click() { win.loadURL(cal), win.show() }
    }
      
      
  ])
    
    


  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Infobildschirm', click: function (event) {
      win.loadURL(info)
      win.show()

    }},
    { label: 'E-Mail', click: function (event) {
      win.loadURL(mail)
      win.show()

    }},
    { label: 'Aufgaben', click: function (event) {
      win.loadURL(exer)
      win.show()

    }},
    { label: 'Dateien', click: function (event) {
      win.loadURL(file)
      win.show()

    }},
    { label: 'Kalender', click: function (event) {
      win.loadURL(cal)
      win.show()
 
    }},
    { label: 'Addressbuch', click: function (event) {
      win.loadURL(address)
      win.show()

    }},
    { label: 'Foren', click: function (event) {
      win.loadURL(forum)
      win.show()

    }},
    { label: 'Messenger', click: function (event) {
      win.loadURL(mess)
      win.show()

    }},
    { label: 'News', click: function (event) {
      win.loadURL(news)
      win.show()

    }},

  ])
  tray.setContextMenu(contextMenu)
  tray.setTitle(domain)
  tray.tooltip(domain)
  tray.on('click', function () {
    win.show()
  })
}

app.whenReady().then(() => {
  log("#### APP STARTED ####")
  checkUpdates()
  splash()
})

app.on("before-quit", () => {log("#### QUITTING APP ####")})













