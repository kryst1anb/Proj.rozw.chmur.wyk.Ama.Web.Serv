var myArr;
var fileName = "";

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
  document.getElementById("photo").style.backgroundImage = "url(" + file.name + ")";

  fileWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  fileNameJSON = fileWithoutExt + ".json";
  xhr.send(data);

  getJSON();
});

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function randomColor() {
  return "rgb(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")";
}

function drawRECT(widthtPhoto, heightPhoto) {
  var ctx;
  //IMAGE_WIDTH*LEFT_RATIO (X) , IMAGE_HEIGHT*TOP_RATIO (Y) , IMAGE_WIDTH*WIDTH_RATIO , IMAGE_HEIGHT*HEIGHT_RATIO
  for (var i = 0; i < myArr["FaceDetails"].length; i++) {
    imageHeight = heightPhoto;
    imageWidtht = widthtPhoto;

    var canvas = document.getElementById("photo");
    ctx += i;
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "6";

    const getColor = randomColor();
    ctx.strokeStyle = getColor;

    ctx.fillStyle = getColor;
    ctx.font = "Bold 48px Comic Sans MS";

    var json = myArr["FaceDetails"][i]["BoundingBox"];

    var ratioX = json["Left"];
    var ratioY = json["Top"];
    var ratioWidth = json["Width"];
    var ratioHeight = json["Height"];

    ctx.fillText(i + 1, imageWidtht * ratioX, imageHeight * ratioY - 10);

    ctx.rect(imageWidtht * ratioX, imageHeight * ratioY, imageWidtht * ratioWidth, imageHeight * ratioHeight);
    ctx.stroke();
  }
}

document.getElementById("file").addEventListener("change", function (e) {
  var _URL = window.URL || window.webkitURL;
  if (document.getElementById("file")) {
    var file = "",
      img = "";

    if ((file = this.files[0])) {
      img = new Image();
      img.onload = function () {
        //alert("width: " + this.width + " Height: " + this.height);

        document.getElementsByClassName("canvas-photo")[0].style.visibility = "visible";
        document.getElementsByClassName("main-tab")[0].style.visibility = "visible";

        document.getElementById("photo").width = this.width;
        document.getElementById("photo").height = this.height;
        drawRECT(this.width, this.height);
      };
      img.onerror = function () {
        console.log("Not a valid file: " + file.name);
      };
      img.src = _URL.createObjectURL(file);
    }
  }
});

function getJSON() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myArr = JSON.parse(this.responseText);
      sendJSON();
      console.log("getJSON..");
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
      document.getElementById("demo").innerHTML = this.responseText;
      console.log("sendJSon..");
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
