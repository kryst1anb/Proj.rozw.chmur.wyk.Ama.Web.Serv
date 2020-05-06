var fileName = "";
var myArr = [];
var file = "";
var fileNameJSON = "";

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

// document.getElementById("file").addEventListener("change", function (e) {
//   file = this.files[0];
//   fileName = file.name;
//   var xhr = new XMLHttpRequest();
//   //console.log(e);
//   xhr.addEventListener("load", function (e) {
//     console.log("xhr upload complete", e, this.responseText);
//   });
//   xhr.open("post", "upload.php", true);
//   var data = new FormData();
//   data.append("file", file);
//   document.getElementById("photo").style.backgroundImage = "url(" + file.name + ")";

//   fileWithoutExt = fileName.replace(/\.[^/.]+$/, "");
//   fileNameJSON = fileWithoutExt + ".json";
//   xhr.send(data);

//   getJSON();
// });

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
    myArr = [];
    file = this.files[0];
    // console.log(file);
    fileName = file.name;
    // console.log(file.name);

    var xhr = new XMLHttpRequest();
    // console.log(xhr);
    xhr.addEventListener("load", function (e) {
      console.log("xhr upload complete", e, this.responseText);
    });
    xhr.open("post", "upload.php", true);
    var data = new FormData();
    data.append("file", file);
    document.getElementById("photo").style.backgroundImage =
      "url(" + file.name + ")";

    var fileWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    fileNameJSON = fileWithoutExt + ".json";
    xhr.send(data);

    getJSON();

    var _URL = window.URL || window.webkitURL;
    // var file = "",
    var img = "";

    if ((file = this.files[0])) {
      img = new Image();
      img.onload = function () {
        //alert("width: " + this.width + " Height: " + this.height);
        // console.log(myArr.FaceDetails.length);
        document.getElementsByClassName("canvas-photo")[0].style.display =
          "block";
        document.getElementsByClassName("main-tab")[0].style.display = "block";

        document.getElementById("photo").width = this.width;
        document.getElementById("photo").height = this.height;
        //console.log(myArr["FaceDetails"]);

        //IMAGE_WIDTH*LEFT_RATIO (X) , IMAGE_HEIGHT*TOP_RATIO (Y) , IMAGE_WIDTH*WIDTH_RATIO , IMAGE_HEIGHT*HEIGHT_RATIO
        var arrayLength = Object.keys(myArr.FaceDetails).length;
        for (i = 0; i < arrayLength; ++i) {
          // var ctx;
          var json = "";

          // if (i > 0) {
          //   ctx.clearRect(0, 0, canvas.width, canvas.height);
          // }
          var imageHeight = this.height;
          var imageWidtht = this.width;

          var canvas = document.getElementById("photo");
          var ctx = canvas.getContext("2d");
          ctx.beginPath();
          ctx.lineWidth = "6";

          var getColor = randomColor();
          ctx.strokeStyle = getColor;

          ctx.fillStyle = getColor;
          ctx.font = "Bold 48px Comic Sans MS";

          json = myArr["FaceDetails"][i]["BoundingBox"];

          var ratioX = 0;
          ratioX = json.Left;

          var ratioY = 0;
          ratioY = json.Top;
          var ratioWidth = 0;
          ratioWidth = json.Width;
          var ratioHeight = 0;
          ratioHeight = json.Height;

          ctx.fillText(i + 1, imageWidtht * ratioX, imageHeight * ratioY - 10);

          ctx.rect(
            imageWidtht * ratioX,
            imageHeight * ratioY,
            imageWidtht * ratioWidth,
            imageHeight * ratioHeight
          );
          ctx.stroke();
          ctx.closePath();
        }
      };
      img.onerror = function () {
        console.log("Not a valid file: " + file.name);
      };

      img.src = _URL.createObjectURL(file);
    }
  },
  false
);

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
