var fileName = "";
var myArr = [];
var file = "";
var fileNameJSON = "";
var fileWithoutExt = "";
var img = "";
var xmlhttp = "";
var imgWitdth = 0;
var imgHeight = 0;
var lenghtOfPeople = 0;

function clearVariables() {
  fileName = "";
  file = "";
  fileNameJSON = "";
  fileWithoutExt = "";
  xmlhttp = "";
  imgWitdth = 0;
  imgHeight = 0;
}

function getJSON() {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", fileNameJSON, true);

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      var status = xmlhttp.status;
      if (status === 0 || (status >= 200 && status < 400)) {
        myArr = JSON.parse(this.responseText);
        lenghtOfPeople = myArr.FaceDetails.length;
        //console.log("myArr.FaceDetails.length " + lenghtOfPeople);
        sendJSON(myArr);
      } else {
        console.log("Oh no! There has been an error with the request!");
      }
    }
  };
  xmlhttp.send();
}

function tableCheck() {
  var tableElement = document.forms[0];
  for (var j = 0; j < tableElement.length; j++) {
    if (!tableElement[j].checked) {
      document.getElementById(tableElement[j].value).style.display = "none";
    } else {
      document.getElementById(tableElement[j].value).style = "";
    }
  }
}

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function randomColor() {
  return (
    "rgb(" +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ")"
  );
}

document.getElementById("file").addEventListener(
  "change",
  function () {
    file = this.files[0];
    setBackgroundAndName(file);
    fileName = file.name;

    getJSON();

    var _URL = window.URL || window.webkitURL;

    if ((file = this.files[0])) {
      img = new Image();

      img.onload = function () {
        document.getElementsByClassName("canvas-photo")[0].style.display =
          "block";
        document.getElementsByClassName("main-tab")[0].style.display = "block";
      };
      img.onerror = function () {
        console.log("Not a valid file: " + file.name);
      };

      img.src = _URL.createObjectURL(file);
    }
  },
  false
);

function drawAll() {
  clearVariables();
  //IMAGE_WIDTH*LEFT_RATIO (X) , IMAGE_HEIGHT*TOP_RATIO (Y) , IMAGE_WIDTH*WIDTH_RATIO , IMAGE_HEIGHT*HEIGHT_RATIO
  console.log("myArr.length " + lenghtOfPeople);
  for (var i = 0; i < lenghtOfPeople; ++i) {
    imgHeight = document.getElementById("photo").height;
    imgWitdth = document.getElementById("photo").width;

    var canvas = document.getElementById("photo");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "6";

    var getColor = randomColor();
    document.getElementById("colName_" + i).style.color = getColor;
    ctx.strokeStyle = getColor;

    ctx.fillStyle = getColor;
    ctx.font = "Bold 48px Comic Sans MS";

    var json = myArr["FaceDetails"][i]["BoundingBox"];

    var ratioX = 0;
    ratioX = json.Left;

    var ratioY = 0;
    ratioY = json.Top;
    var ratioWidth = 0;
    ratioWidth = json.Width;
    var ratioHeight = 0;
    ratioHeight = json.Height;

    ctx.fillText(i + 1, imgWitdth * ratioX, imgHeight * ratioY - 10);

    ctx.rect(
      imgWitdth * ratioX,
      imgHeight * ratioY,
      imgWitdth * ratioWidth,
      imgHeight * ratioHeight
    );
    ctx.stroke();
    ctx.closePath();
  }
}

function setBackgroundAndName(file) {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("post", "upload.php", true);

  var data = new FormData();
  data.append("file", file);
  document.getElementById("photo").style.backgroundImage =
    "url(" + file.name + ")";
  fileWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  fileNameJSON = fileWithoutExt + ".json";

  xmlhttp.send(data);
}

function sendJSON(myArr) {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "server.php", true);
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      var status = xmlhttp.status;
      if (status === 0 || (status >= 200 && status < 400)) {
        document.getElementsByClassName(
          "inner"
        )[0].innerHTML = this.responseText;
        document.getElementById("photo").width = img.width;
        document.getElementById("photo").height = img.height;
        drawAll();
      } else {
        console.log("Oh no! There has been an error with the request!");
      }
    }
  };

  xmlhttp.send(
    JSON.stringify({
      send: true,
      length: myArr.FaceDetails.length,
      json: myArr,
    })
  );
}
