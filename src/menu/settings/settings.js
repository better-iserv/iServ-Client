const fs = require('fs');
const { remote, app } = require('electron');

let th0 = document.getElementById("th0")
let th1 = document.getElementById("th1")
let back = document.getElementById("bac")

let state;
var win = remote.getCurrentWindow()



th0.addEventListener('click', () => { 

    th0.style.borderRadius = "8px"
    th0.style.border = "5px solid  #ff4d00"

    th1.style.borderRadius = "8px"
    th1.style.border = "0px solid  #ff4d00"
    //th2.style.borderRadius = "8px"
    //th2.style.border = "0px solid  #ff4d00"

    state = 0
});
th1.addEventListener('click', () => { 

    th1.style.borderRadius = "8px"
    th1.style.border = "5px solid  #ff4d00"

    th0.style.borderRadius = "8px"
    th0.style.border = "0px solid  #ff4d00"
    //th2.style.borderRadius = "8px"
    //th2.style.border = "0px solid  #ff4d00"

    state = 1
});

back.addEventListener('click', () => { 

    fs.writeFile(remote.app.getPath('userData') + '\\theme', state, function (err) {
        if (err) return console.log(err);
    });
    win.loadFile(process.cwd() + "/src/menu/menu.html")


});