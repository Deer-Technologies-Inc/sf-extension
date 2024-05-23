// SF-BG-script
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "popup-click" },
      function (response) {}
    );
  });

  // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     if (tabs[0].url.includes("amazon.com/gp/css/order-history")) {
  //         console.log(tabs[0].autoDiscardable)
  //     }
  // });
});

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type == "checkOrderId") {
    console.log("checkOrderId.1", msg);

    $.ajax({
      type: "GET",
      url: msg.link,
      success: function (data) {
        console.log("checkOrderId.2", data);

        chrome.tabs.sendMessage(
          sender.tab.id,
          {
            action: msg.action,
            productId: msg.productId,
            price: msg.price,
            link: msg.link,
            content: data,
            itemOrder: msg.itemOrder,
            purchaseId: msg.purchaseId,
            email: msg.email,
          },
          function (response) {
            return true;
          }
        );
      },
      complete: function (data) {
        console.log("bg-complete", data);
      },
    });
  } else if (msg.type == "checkEmptyOrderAdress") {
    var countryCode = msg.countryCode;
    var orderId = msg.orderId;

    console.log(orderId, countryCode, "started");

    var domains = [];
    if (countryCode == "CA" || countryCode == "MX" || countryCode == "US") {
      domains.push("https://sellercentral.amazon.com");
      domains.push("https://sellercentral.amazon.ca");
      domains.push("https://sellercentral.amazon.com.mx");
    } else if (
      countryCode == "JP" ||
      countryCode == "SG" ||
      countryCode == "AU" ||
      countryCode == "IN"
    ) {
      domains.push("https://sellercentral.amazon.co.jp");
      domains.push("https://sellercentral-japan.amazon.com");
      domains.push("https://sellercentral.amazon.sg");
      domains.push("https://sellercentral.amazon.com.au");
      domains.push("https://sellercentral.amazon.in");
    } else if (
      countryCode == "SA" ||
      countryCode == "AE" ||
      countryCode == "EG"
    ) {
      domains.push("https://sellercentral.amazon.sa");
      domains.push("https://sellercentral.amazon.ae");
      domains.push("https://sellercentral.amazon.eg");
    } else if (
      countryCode == "DE" ||
      countryCode == "ES" ||
      countryCode == "FR" ||
      countryCode == "UK" ||
      countryCode == "BE" ||
      countryCode == "IT" ||
      countryCode == "NL" ||
      countryCode == "PL" ||
      countryCode == "SE" ||
      countryCode == "TR"
    ) {
      domains.push("https://sellercentral-europe.amazon.com");
      domains.push("https://sellercentral.amazon.de");
      domains.push("https://sellercentral.amazon.fr");
      domains.push("https://sellercentral.amazon.es");
      domains.push("https://sellercentral.amazon.co.uk");
      domains.push("https://sellercentral.amazon.nl");
      domains.push("https://sellercentral.amazon.pl");
      domains.push("https://sellercentral.amazon.es");
      domains.push("https://sellercentral.amazon.it");
      domains.push("https://sellercentral.amazon.se");
      domains.push("https://sellercentral.amazon.com.tr");
      domains.push("https://sellercentral.amazon.com.be");
    }
    console.log(msg.currentHostname);
    console.log(domains);
    var domain = "https://sellercentral.amazon.com";
    if (domains.includes(msg.currentHostname)) {
      domain = msg.currentHostname;
    } else {
      if (countryCode == "JP") domain = "https://sellercentral.amazon.co.jp";
      else if (countryCode == "SA") domain = "https://sellercentral.amazon.sa";
      else if (countryCode == "CA") domain = "https://sellercentral.amazon.ca";
      else if (countryCode == "DE") domain = "https://sellercentral.amazon.de";
      else if (countryCode == "ES") domain = "https://sellercentral.amazon.es";
      else if (countryCode == "FR") domain = "https://sellercentral.amazon.fr";
      else if (countryCode == "UK")
        domain = "https://sellercentral.amazon.co.uk";
      else if (countryCode == "AE") domain = "https://sellercentral.amazon.ae";
      else if (countryCode == "MX")
        domain = "https://sellercentral.amazon.com.mx";
      else if (countryCode == "IT")
        domain = "https://sellercentral-europe.amazon.com";
      else if (countryCode == "NL") domain = "https://sellercentral.amazon.nl";
      else if (countryCode == "PL") domain = "https://sellercentral.amazon.pl";
      else if (countryCode == "SE") domain = "https://sellercentral.amazon.se";
      else if (countryCode == "SG") domain = "https://sellercentral.amazon.sg";
      else if (countryCode == "AU")
        domain = "https://sellercentral.amazon.com.au";
      else if (countryCode == "US") domain = "https://sellercentral.amazon.com";
      else if (countryCode == "IN") domain = "https://sellercentral.amazon.in";
      else if (countryCode == "EG") domain = "https://sellercentral.amazon.eg";
      else if (countryCode == "TR")
        domain = "https://sellercentral.amazon.com.tr";
      else if (countryCode == "BE")
        domain = "https://sellercentral.amazon.com.be";
    }

    $.ajax({
      url: domain + "/orders-api/order/" + orderId,
      type: "GET",
      success: function (response) {
        try {
          var blobs = [];
          blobs.push(response.order.blob);

          $.ajax({
            url: domain + "/orders-st/resolve",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ blobs }),
            success: function (response) {
              console.log(response);
              var text = JSON.stringify(response);
              console.log(text);

              var orderId = Object.keys(response)[0];
              console.log(orderId);

              var address = text.split('"address":').pop().split("},")[0];
              address = address + "}";

              var addressJson = JSON.parse(address);
              console.log("addressJson", addressJson);
              console.log("addressJson.line3", addressJson.line3);

              $.ajax({
                url: msg.apiSubdomain + "orders",
                type: "PUT",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                  amazonOrderId: orderId,
                  customerName: addressJson.name ?? "",
                  customerAddressLine1: addressJson.line1 ?? "",
                  customerAddressLine2: addressJson.line2 ?? "",
                  customerAddressLine3: addressJson.line3 ?? "",
                  customerCity: addressJson.city ?? "",
                  customerCounty: addressJson.county ?? "",
                  customerDistrict: addressJson.district ?? "",
                  customerStateOrRegion: addressJson.stateOrRegion ?? "",
                  customerMunicipality: addressJson.municipality ?? "",
                  customerPostalCode: addressJson.postalCode ?? "",
                  customerCountryCode: addressJson.countryCode ?? "",
                  customerPhone: addressJson.phoneNumber ?? "",
                  customerCountryName: addressJson.countryLine ?? "",
                }),
                headers: { Authorization: "Bearer " + msg.token },
                success: function (response) {
                  console.log("Address updated", response);
                },
                failure: function (response) {
                  console.log("Address can not be updated", response);
                },
                complete: function (data) {
                  console.log("Address update DONE!", data);

                  // if (msg.isLastOne)
                  chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                      action: msg.type,
                      orderId: msg.orderId,
                      countryCode: countryCode,
                      succeed: true,
                    },
                    function (response) {
                      return true;
                    }
                  );
                },
              });
            },
            failure: function (response) {
              console.log("Order addresses can not be taken", response);
            },
          });
        } catch (err) {
          console.log("Error: ", response);
          chrome.tabs.sendMessage(
            sender.tab.id,
            {
              action: msg.type,
              orderId: msg.orderId,
              countryCode: countryCode,
              succeed: false,
            },
            function (response) {
              return true;
            }
          );
        }
      },
      failure: function (response) {
        console.log("Order addresses can not be taken. ", response);
      },
      complete: function (data) {
        console.log("bg-complete", data);
      },
    });

    console.log(orderId, "finished");
    console.log("----------------------------------------------");
  }
});
