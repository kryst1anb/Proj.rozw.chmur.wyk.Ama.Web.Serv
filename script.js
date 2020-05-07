var fileName = "";
var myArr = [];
var file = "";
var fileNameJSON = "";
var fileWithoutExt = "";
var img = "";
var xmlhttp = "";
var imgWidth = 0;
var imgHeight = 0;
var lenghtOfPeople = 0;

function clearVariables() {
  fileName = "";
  file = "";
  fileNameJSON = "";
  fileWithoutExt = "";
  xmlhttp = "";
  imgWidth = 0;
  imgHeight = 0;
}

function getJSON() {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", fileNameJSON, true);

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      var status = xmlhttp.status;

      var refreshIntervalId = setInterval(() => {
        if (status === 0 || (status >= 200 && status < 400)) {
          clearInterval(refreshIntervalId);
          myArr = JSON.parse(this.responseText);
          lenghtOfPeople = myArr.FaceDetails.length;
          //console.log("myArr.FaceDetails.length " + lenghtOfPeople);
          sendJSON(myArr);
          document.getElementsByClassName("functionBox")[0].style.display = "none";
          document.getElementsByClassName("loader")[0].style.display = "none";
        } else {
          status = 0;
          getJSON();
        }
      }, 1500);
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
  return "rgb(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")";
}

document.getElementById("file").addEventListener(
  "change",
  function () {
    file = this.files[0];
    if (file.type.split("/")[0] === "image") {
      document.getElementsByClassName("functionBox")[0].style.display = "block";
      document.getElementsByClassName("loader")[0].style.display = "block";
      document.getElementsByClassName("errorFormatter")[0].style.display = "none";
      setBackgroundAndName(file);
      fileName = file.name;
      getJSON();
      var _URL = window.URL || window.webkitURL;
      if ((file = this.files[0])) {
        img = new Image();
        img.src = _URL.createObjectURL(file);
      }
    } else {
      document.getElementsByClassName("loader")[0].style.display = "none";
      document.getElementsByClassName("functionBox")[0].style.display = "block";
      document.getElementsByClassName("errorFormatter")[0].style.display = "block";
      document.getElementsByClassName("errorFormatter")[0].style.color = "red";
      document.getElementsByClassName("errorFormatter")[0].innerHTML = "Not a valid file: " + file.name;
    }
  },
  false
);

function drawAll() {
  clearVariables();
  //IMAGE_WIDTH*LEFT_RATIO (X) , IMAGE_HEIGHT*TOP_RATIO (Y) , IMAGE_WIDTH*WIDTH_RATIO , IMAGE_HEIGHT*HEIGHT_RATIO
  for (var i = 0; i < lenghtOfPeople; i++) {
    imgHeight = document.getElementById("photo").height;
    imgWidth = document.getElementById("photo").width;

    var canvas = document.getElementById("photo");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "3";
    var getColor = randomColor();
    ctx.fillStyle = getColor;
    ctx.strokeStyle = getColor;
    var json = myArr["FaceDetails"][i]["BoundingBox"];

    var ratioX = 0;
    ratioX = json.Left;

    var ratioY = 0;
    ratioY = json.Top;
    var ratioWidth = 0;
    ratioWidth = json.Width;
    var ratioHeight = 0;
    ratioHeight = json.Height;

    if (imgWidth > 500 && imgHeight > 300) {
      var numberPerson = i + 1;
      ctx.lineWidth = "6";
      ctx.font = "Bold 48px Comic Sans MS";
      ctx.fillText(numberPerson, imgWidth * ratioX, imgHeight * ratioY - 10);
    }

    document.getElementById("colName_" + i).style.color = getColor;

    ctx.rect(imgWidth * ratioX, imgHeight * ratioY, imgWidth * ratioWidth, imgHeight * ratioHeight);
    ctx.stroke();
    ctx.closePath();
  }
  document.getElementsByClassName("canvas-photo")[0].style.display = "block";
  document.getElementsByClassName("main-tab")[0].style.display = "block";
}

function setBackgroundAndName(file) {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("post", "upload.php", true);
  xmlhttp.onreadystatechange = function () {
    document.getElementById("photo").style.backgroundImage = "url(upload/" + file.name + ")";
  };
  var data = new FormData();
  data.append("file", file);
  fileWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  fileNameJSON = "upload/" + fileWithoutExt + ".json";
  xmlhttp.send(data);
}

function sendJSON(myArr) {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "server.php", true);
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      var status = xmlhttp.status;

      if (status === 0 || (status >= 200 && status < 400)) {
        document.getElementsByClassName("inner")[0].innerHTML = this.responseText;
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
      fileNameToPy: file.name,
      length: myArr.FaceDetails.length,
      json: myArr,
    })
  );
}
