const { app, BrowserWindow, Notification, BrowserView, Menu, Tray, session, nativeTheme} = require('electron')
const fs = require('fs');
const { chrome } = require('process');
const request = require('request');


let domain = ""
firstUse = true
menuShowed = false;
let icon = __dirname + "/iserv_logo.png"



const updateurl = 'https://polkabeine.de/spielwiese/emil/iserv-client/'

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  
  });
};

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

function checkUpdates()
{
  
  try {
    fs.unlinkSync(app.getPath('userData') + '\\updateDescription.txt');
    fs.unlinkSync(app.getPath('userData') + '\\updateVersion.txt');
    console.log('successfully deleted descrip and version file');
    
  } catch (err) {
    console.log("no des or ver file was found");
  }



  request(updateurl, function (error, response, body) {
        
    if (!error && response.statusCode == 403) 
    {
        download(updateurl + "updateVersion.txt", app.getPath('userData') + '\\updateVersion.txt', function(){
  
          console.log("Downloaded update-version File")
          try 
          {
            const updateVersion = fs.readFileSync(app.getPath('userData') + '\\updateVersion.txt', 'utf8')
            let updateCompare = updateVersion.split(".")
            let versionCompare = app.getVersion().split(".")
            console.log("updateVersion:" + updateCompare.join(""))
            console.log("currentVersion:" + versionCompare.join(""))
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
                }
                start()

              } 
              catch (err)
              {
                console.log("update now")
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
  splashWin.loadFile(__dirname + "/splash.html")

}

function start()
{
  
  try {
    fs.unlinkSync(app.getPath('userData') + '\\updateVersion.txt');
    fs.unlinkSync(app.getPath('userData') + '\\updateDescription.txt');

    
  } catch (err) {

  }

  try 
  {
    const data = fs.readFileSync(app.getPath('userData') + '\\iserv.domain', 'utf8')
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
      if(!menuShowed) menu()   
    }

  } catch (err) {
    if(firstUse) config()   
  }
}

function config()
{
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
  
  const menWin = new BrowserWindow({
    width: 500,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: { 
      enableRemoteModule: true,
      nodeIntegration: true
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
  const theme = fs.readFileSync(app.getPath('userData') + '\\theme', 'utf8')
  if(theme === undefined)
  {
    console.log("default theme activated");
  } 
  else if(theme === "0")
  {
    console.log("default theme activated");
  } 
  else if(theme === "1")
  {
    session.defaultSession.loadExtension(app.getPath('userData') + "\\darkmode");
  } 
  else if(theme === "2")
  {
    session.defaultSession.loadExtension(app.getPath('userData') + "\\darkmode");
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
        menu: null,
  });




  win.setMenu(null)
  win.setTitle(domain + " - iServClient")
  win.setBounds({ x: 0, y: 0, width: 1000, height: 600 })
  win.loadURL('https://' + domain + '/iserv/')
  win.on('did-fail-load', function() {});



  win.webContents.on('did-fail-load', () => {alert("Es ist ein Fehler aufgetreten!")});
  win.webContents.on('did-stop-loading', () => {splashWin.close()});
  win.webContents.on('did-start-loading', () => {splash()});



  

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
    { label: 'Messager', click: function (event) {
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
  checkUpdates()
  splash()
})












