const fs = require('fs');
const child_process = require('child_process');
const { remote, app } = require('electron');

let th0 = document.getElementById("th0")
let th1 = document.getElementById("th1")
let th2 = document.getElementById("th2")
let th3 = document.getElementById("th3")
let th4 = document.getElementById("th4")

let back = document.getElementById("bac")
let report = document.getElementById("bug")

let state;
var win = remote.getCurrentWindow()
var application = remote.app;

let theme = fs.readFileSync(remote.app.getPath('userData') + '\\current.theme', 'utf8')
if(theme === "0")
{
    th0.style.borderRadius = "8px"
    th0.style.border = "5px solid  #ff4d00";
    state = 0
} 
else if(theme === "1")
{
    th1.style.borderRadius = "8px"
    th1.style.border = "5px solid  #ff4d00"
    state = 1
} 
else if(theme === "2")
{
    th2.style.borderRadius = "8px"
    th2.style.border = "5px solid  #ff4d00"
    state = 2
} 
else if(theme === "3")
{
    th3.style.borderRadius = "8px"
    th3.style.border = "5px solid  #ff4d00"
    state = 3
} 
else if(theme === "4")
{
    th4.style.borderRadius = "8px"
    th4.style.border = "5px solid  #ff4d00"
    state = 4
}



th0.addEventListener('click', () => { 

    th0.style.borderRadius = "8px"
    th0.style.border = "5px solid  #ff4d00"

    th1.style.borderRadius = "8px"
    th1.style.border = "0px solid  #ff4d00"

    th2.style.borderRadius = "8px"
    th2.style.border = "0px solid  #ff4d00"

    th3.style.borderRadius = "8px"
    th3.style.border = "0px solid  #ff4d00"

    th4.style.borderRadius = "8px"
    th4.style.border = "0px solid  #ff4d00"

    state = 0
});
th1.addEventListener('click', () => { 

    th1.style.borderRadius = "8px"
    th1.style.border = "5px solid  #ff4d00"

    th0.style.borderRadius = "8px"
    th0.style.border = "0px solid  #ff4d00"

    th2.style.borderRadius = "8px"
    th2.style.border = "0px solid  #ff4d00"

    th3.style.borderRadius = "8px"
    th3.style.border = "0px solid  #ff4d00"

    th4.style.borderRadius = "8px"
    th4.style.border = "0px solid  #ff4d00"

    state = 1
});
th2.addEventListener('click', () => { 

    th1.style.borderRadius = "8px"
    th1.style.border = "0px solid  #ff4d00"

    th0.style.borderRadius = "8px"
    th0.style.border = "0px solid  #ff4d00"

    th2.style.borderRadius = "8px"
    th2.style.border = "5px solid  #ff4d00"

    
    th3.style.borderRadius = "8px"
    th3.style.border = "0px solid  #ff4d00"

    
    th4.style.borderRadius = "8px"
    th4.style.border = "0px solid  #ff4d00"
    

    state = 2
});
th3.addEventListener('click', () => { 

    th1.style.borderRadius = "8px"
    th1.style.border = "0px solid  #ff4d00"

    th0.style.borderRadius = "8px"
    th0.style.border = "0px solid  #ff4d00"

    th2.style.borderRadius = "8px"
    th2.style.border = "0px solid  #ff4d00"

    th3.style.borderRadius = "8px"
    th3.style.border = "5px solid  #ff4d00"

    
    th4.style.borderRadius = "8px"
    th4.style.border = "0px solid  #ff4d00"

    state = 3
});
th4.addEventListener('click', () => { 

    th1.style.borderRadius = "8px"
    th1.style.border = "0px solid  #ff4d00"

    th0.style.borderRadius = "8px"
    th0.style.border = "0px solid  #ff4d00"

    th2.style.borderRadius = "8px"
    th2.style.border = "0px solid  #ff4d00"

    th3.style.borderRadius = "8px"
    th3.style.border = "0px solid  #ff4d00"

    
    th4.style.borderRadius = "8px"
    th4.style.border = "5px solid  #ff4d00"

    state = 4
});



back.addEventListener('click', () => { 

    fs.writeFile(remote.app.getPath('userData') + '\\current.theme', state, function (err) {
        if (err) return console.log(err);
    });
    win.loadFile(__dirname + "/menu.html")


});

back.addEventListener('click', () => { 

    fs.writeFile(remote.app.getPath('userData') + '\\current.theme', state, function (err) {
        if (err) return console.log(err);
    });
    win.loadFile(__dirname + "/menu.html")


});
