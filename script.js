window.addEventListener("load", function () {
  //onload
  //jakiegoś pedała się tu doda jak będzie potrzeba np zerującego divy
});

function tableCheck() {
  var tableElement = document.forms[0];
  var i;
  for (i = 0; i < tableElement.length; i++) {
    if (!tableElement[i].checked) {
      document.getElementById(tableElement[i].value).style.display = "none";
    } else {
      document.getElementById(tableElement[i].value).style = "";
    }
  }
}
var fileName = "";
document.getElementById("file").addEventListener("change", function (e) {
  var file = this.files[0];
  fileName = file.name;
  var xhr = new XMLHttpRequest();
  //console.log(e);
  xhr.addEventListener("load", function (e) {
    //console.log("xhr upload complete", e, this.responseText);
  });
  xhr.open("post", "upload.php", true);
  var data = new FormData();
  data.append("file", file);
  document.getElementById("photo").style.backgroundImage =
    "url(" + file.name + ")";

  file = fileName.replace(/\.[^/.]+$/, "");
  fileNameJSON = file + ".json";

  getJSON();
  xhr.send(data);
});

var x = document.getElementById("file");
var _URL = window.URL || window.webkitURL;
x.addEventListener("change", function (e) {
  if (x) {
    var file, img;

    if ((file = this.files[0])) {
      img = new Image();
      img.onload = function () {
        //alert("width: " + this.width + " Height: " + this.height);
        document.getElementById("photo").width = this.width;
        document.getElementById("photo").height = this.height;
        drawRECT(this.width, this.height);
      };
      img.onerror = function () {
        //alert("Not a valid file: " + file.name);
      };
      img.src = _URL.createObjectURL(file);
    }
  }
});
var randomColor = "";
function generateColor() {
  randomColor = Math.floor(Math.random() * 16777215).toString(16);
  randomColor = "#" + randomColor;
  console.log(randomColor);
}

function drawRECT(widthtPhoto, heightPhoto) {
  localStorage.clear();
  //IMAGE_WIDTH*LEFT_RATIO (X) , IMAGE_HEIGHT*TOP_RATIO (Y) , IMAGE_WIDTH*WIDTH_RATIO , IMAGE_HEIGHT*HEIGHT_RATIO
  for (let i = 0; i < myArr["FaceDetails"].length; ++i) {
    var c = document.getElementById("photo");
    imageHeight = heightPhoto;
    imageWidtht = widthtPhoto;

    var ctx = ctx + i;

    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "6";
    generateColor();

    document.getElementById("colName_" + i).style.backgroundColor = randomColor;

    ctx.strokeStyle = randomColor;

    var json = myArr["FaceDetails"][i]["BoundingBox"];

    var ratioX = localStorage + ".ratioX" + i;
    var ratioY = localStorage + ".ratioY" + i;
    var ratioWidth = localStorage + ".ratioWidth" + i;
    var ratioHeight = localStorage + ".ratioHeight" + i;

    ratioX = json["Left"];
    ratioY = json["Top"];
    ratioWidth = json["Width"];
    ratioHeight = json["Height"];

    ctx.rect(
      imageWidtht * ratioX,
      imageHeight * ratioY,
      imageWidtht * ratioWidth,
      imageHeight * ratioHeight
    );
    ctx.stroke();
  }
  localStorage.clear();
}

var myArr;

function getJSON() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myArr = JSON.parse(this.responseText);
      sendJSON();
      //console.log("SEND..");
      console.log(myArr);
    }
  };
  xmlhttp.open("GET", fileNameJSON, true);
  xmlhttp.send();
}

function sendJSON() {
  var ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(true);
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };

  ajax.open("POST", "server.php", true);
  ajax.send(
    JSON.stringify({
      send: true,
      json: myArr,
    })
  );
}
