window.addEventListener("load", function () {
  //qweqweqwe
});

var myArr;

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
document.getElementById("file").addEventListener("change", function (e) {
  var file = this.files[0];
  var fileName = file.name;

  var ajax = new XMLHttpRequest();
  //console.log(e);
  // ajax.addEventListener("load", function (e) {
  //   //console.log("ajax upload complete", e, this.responseText);
  // });
  ajax.open("post", "upload.php", true);
  var data = new FormData();
  data.append("file", file);
  document.getElementById("photo").style.backgroundImage =
    "url(" + fileName + ")";

  file = fileName.replace(/\.[^/.]+$/, "");
  fileNameJSON = file + ".json";

  getJSON();
  ajax.send(data);
});

document.getElementById("file").addEventListener("change", function (e) {
  var _URL = "";
  _URL = window.URL || window.webkitURL;
  if (document.getElementById("file")) {
    var file = "",
      img = "";

    if ((file = this.files[0])) {
      img = new Image();
      img.onload = function () {
        //alert("width: " + this.width + " Height: " + this.height);
        document.getElementById("photo").width = this.width;
        document.getElementById("photo").height = this.height;

        drawRECT(this.width, this.height);
      };
      img.onerror = function () {
        alert("Not a valid file: " + file.name);
      };
      img.src = _URL.createObjectURL(file);
    }
  }
});

function drawRECT(widthtPhoto, heightPhoto) {
  localStorage.clear();
  var i,
    c = "",
    ctx = "",
    randomColor,
    elementID;
  //IMAGE_WIDTH*LEFT_RATIO (X) , IMAGE_HEIGHT*TOP_RATIO (Y) , IMAGE_WIDTH*WIDTH_RATIO , IMAGE_HEIGHT*HEIGHT_RATIO
  for (i = 0; i < myArr["FaceDetails"].length; ++i) {
    c = document.getElementById("photo");
    imageHeight = heightPhoto;
    imageWidtht = widthtPhoto;

    ctx = ctx + i;

    ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "6";

    randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    //console.log(randomColor.length);

    if (randomColor.length < 7) {
      randomColor += "f";
    }

    ctx.strokeStyle = randomColor;
    elementID = "colName_" + i;
    //console.log(elementID + ":" + randomColor);

    document.getElementById(elementID).style.backgroundColor = randomColor;
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

function getJSON() {
  var ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myArr = JSON.parse(this.responseText);
      sendJSON();
      //console.log("SEND..");
      //console.log(myArr);
    }
  };
  ajax.open("GET", fileNameJSON, true);
  ajax.send();
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
