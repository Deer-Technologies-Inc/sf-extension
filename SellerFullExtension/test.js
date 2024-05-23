// test.js

// Bu kod, sayfa içerisinde bir div oluşturarak sağ alt köşede bir çember çizecek

// Yeni bir div oluşturma
var circleDiv = document.createElement("div");

// Stil tanımlama
circleDiv.style.width = "100px";
circleDiv.style.height = "100px";
circleDiv.style.background = "red";
circleDiv.style.borderRadius = "50%";
circleDiv.style.position = "fixed";
circleDiv.style.bottom = "20px";
circleDiv.style.right = "20px";
circleDiv.style.zIndex = "9999";

debugger;
console.log("SA -------------------");

// Div'i sayfaya ekleme
document.body.appendChild(circleDiv);
