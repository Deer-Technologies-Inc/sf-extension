// SellerFlash Chrome Extension

const baseUrl = "https://x-test-api.sellerfull.com/api/";
const endPoints = {
  User: {
    me: "users/me",
  },
  Store: {
    stores: "stores",
  },
  StoreProduct: {
    storeProducts: "store-products",
  },
  Order: {
    addressNotCompleted: "orders/address-not-completed",
    byAmazonOrderId: "orders/by-amazon-order-id",
    updateAsPurchased: "orders/update-as-purchased",
    updateAsShipped: "orders/update-as-shipped",
    updateAsDelivered: "orders/update-as-delivered",
    notShipped: "orders/not-shipped",
    notDelivered: "orders/not-delivered",
    byAmazonOrderIds: "orders/by-amazon-order-ids",
  },
};

/* #region  Colors & Fonts */
var newStyle = document.createElement("style");
var newStyle2 = document.createElement("style");
var newStyle3 = document.createElement("style");
var newStyle4 = document.createElement("style");
var newStyle5 = document.createElement("style");
var nameFont = "Poppins";
var thin = 100;
var light = 200;
var regular = "normal";
var medium = 600;
var bold = "bold";
var newOrderDetection = true;

newStyle.appendChild(
  document.createTextNode(
    "\
@font-face {\
    font-family: " +
      nameFont +
      ";\
    src: url('" +
      chrome.runtime.getURL("fonts/Poppins-ExtraLight.ttf") +
      "');\
    font-weight: " +
      light +
      ";\
}\
"
  )
);
newStyle2.appendChild(
  document.createTextNode(
    "\
@font-face {\
    font-family: " +
      nameFont +
      ";\
    src: url('" +
      chrome.runtime.getURL("fonts/Poppins-Bold.ttf") +
      "');\
    font-weight: " +
      bold +
      ";\
}\
"
  )
);
newStyle3.appendChild(
  document.createTextNode(
    "\
@font-face {\
    font-family: " +
      nameFont +
      ";\
    src: url('" +
      chrome.runtime.getURL("fonts/Poppins-Thin.ttf") +
      "');\
    font-weight: " +
      thin +
      ";\
}\
"
  )
);
newStyle4.appendChild(
  document.createTextNode(
    "\
@font-face {\
    font-family: " +
      nameFont +
      ";\
    src: url('" +
      chrome.runtime.getURL("fonts/Poppins-Regular.ttf") +
      "');\
    font-weight: " +
      regular +
      ";\
}\
"
  )
);
newStyle5.appendChild(
  document.createTextNode(
    "\
@font-face {\
    font-family: " +
      nameFont +
      ";\
    src: url('" +
      chrome.runtime.getURL("fonts/Poppins-Medium.ttf") +
      "');\
    font-weight: " +
      medium +
      ";\
}\
"
  )
);

document.head.appendChild(newStyle);
document.head.appendChild(newStyle2);
document.head.appendChild(newStyle3);
document.head.appendChild(newStyle4);
document.head.appendChild(newStyle5);
/* #endregion */

$(document).keydown(function (e) {
  // ESCAPE key pressed
  if (e.keyCode == 27) {
    $("#sfMenu").hide();
  }
  if (e.keyCode == 83 && e.altKey) {
    $("#sfMenu").toggle();
  }

  if (e.keyCode == 70) {
  }
});

var snackbarDiv = `<div id="snackbar"></div>`;
$("body").append(snackbarDiv);

var language = "";
var activeLanguage = "TR";

$(document).ready(function () {
  if (
    localStorage.getItem("activeLanguage") != null &&
    localStorage.getItem("activeLanguage") != undefined &&
    localStorage.getItem("activeLanguage") != ""
  ) {
    activeLanguage = localStorage.getItem("activeLanguage");
  }

  checkLogin();

  //TODO: AÇ!
  fetch("https://hollow-ribbon-joke.glitch.me/contentcss")
    .then((response) => response.text())
    .then(function (response) {
      var linkElement = this.document.createElement("link");
      linkElement.setAttribute("rel", "stylesheet");
      linkElement.setAttribute("type", "text/css");
      linkElement.setAttribute(
        "href",
        "data:text/css;charset=UTF-8," + encodeURIComponent(response)
      );
      $("head").prepend(linkElement);
    });

  fetch("https://hollow-ribbon-joke.glitch.me/language")
    .then((response) => response.json())
    .then(function (json) {
      language = json;
    })
    .then(function () {
      createExtensionTools();
    });
});

function createExtensionTools() {
  $(document).ajaxError(function (event, jqXHR) {
    if (jqXHR.status === 401) {
      // Redirect the user to the login page
      // signOut();
      // location.reload();
      createSellerFlashMenu(false);
    }
  });

  if (user != null && user.token.length > 0) {
  } else {
    createSellerFlashMenu(false);
    return;
  }

  createSellerFlashMenu(true);
  $("#sf-logout").click(function () {
    signOut();
    location.reload();
  });

  if (location.hostname.includes("www.amazon.")) {
    if (
      (location.href.includes("/b/") && location.href.includes("node=")) ||
      (location.href.includes("/b?") && location.href.includes("node=")) ||
      location.href.includes("s?k=") ||
      location.href.includes("s?i=") ||
      location.href.includes("s?me=") ||
      location.href.includes("s?keywords=") ||
      location.href.includes("s?rh=") ||
      location.href.includes("s?bbn=")
    ) {
      // Search page | Category page | Seller page
      createSearchPageItems();
      createSaveFilterPageItems();
    }

    if (
      location.hostname == "www.amazon.com" ||
      location.hostname == "www.amazon.ca" ||
      location.host == "www.amazon.co.uk"
    ) {
      if (
        (location.href.includes("/b/") && location.href.includes("node=")) ||
        (location.href.includes("/b?") && location.href.includes("node=")) ||
        location.href.includes("s?k=") ||
        location.href.includes("s?i=") ||
        location.href.includes("s?me=") ||
        location.href.includes("s?keywords=") ||
        location.href.includes("s?rh=") ||
        location.href.includes("s?bbn=")
      ) {
        // Search page | Category page | Seller page
      } else if (location.href.includes("/associates/addtocart")) {
        location.replace(location.origin + "/gp/cart/view.html");
      } else if (location.href.includes("gp/aws/cart/add.html")) {
        // Order pages
        if (location.href.includes("confirmPage=confirm")) {
          // Step 2
          createOrderPageStep2Items();
        } else {
          // Step 1
          createOrderPageStep1Items();
        }
      } else if (location.href.includes("gp/cart/view.html")) {
        // Order pages // Step 2
        if (localStorage.getItem("orderDetails") != "") {
          orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
          if (
            orderDetails == "" ||
            orderDetails == null ||
            orderDetails == undefined
          ) {
            createInactivePageItems();
          } else {
            createOrderPageStep2Items();
          }
        }
      } else if (location.href.includes("gp/buy/")) {
        if (
          !location.href.includes("buy/thankyou") ||
          location.href.includes(
            "gp/buy/spc/handlers/static-submit-decoupled.html"
          )
        ) {
          checkBuyingPages();
        }

        if (location.href.includes("gp/cart/desktop/go-to-checkout")) {
          // Wrong address check ?
          createOrder_WrongAddressPageItems();
        }

        if (location.href.includes("gp/buy/accountselect")) {
          createOrder_BusinessPrimeAccountSelectPageItems();
        } else if (
          location.href.includes("gp/buy/businessorder") ||
          $("input#configurationId_0").length
        ) {
          createOrder_BusinessPrimeConfigurationIdPageItems();
        } else if (location.href.includes("gp/buy/addressselect")) {
          createOrder_AddressPageItems();
        } else if (location.href.includes("gp/buy/gift")) {
          createOrder_GiftPageItems();
        } else if (location.href.includes("gp/buy/shipoptionselect")) {
          createOrder_ShipOptionPageItems();
        } else if (location.href.includes("gp/buy/payselect")) {
          createOrder_PaymentPageItems();
        } else if (
          location.href.includes("buy/thankyou") ||
          location.href.includes(
            "gp/buy/spc/handlers/static-submit-decoupled.html"
          )
        ) {
          createOrderResultPageItems();
        } else if (location.href.includes("gp/buy/spc")) {
          createOrder_PlaceOrderPageItems();
        }
      } else if (
        location.href.includes("/order-history") ||
        location.href.includes("/your-orders/orders")
      ) {
        createShippingTrackerItems();
      } else if (location.href.includes("/addresses/add")) {
        createAddNewAddressPageItems();
      } else if (location.href.includes("/a/addresses")) {
        createAllAddressesPageItems();
      } else if (
        location.href.includes("/print.html") ||
        location.href.includes("/message-us")
      ) {
        // Do not activate extension here. Because this page is not appropriate for button.
      } else {
        createInactivePageItems();
      }
    } else if (location.hostname == "www.amazon.co.jp") {
      if (location.href.includes("/addresses/add")) {
        createAddNewAddressPageItems();
      } else if (location.href.includes("gp/buy/addressselect")) {
        createAddNewAddressPageItems();
      }
    }
  } else if (
    location.origin.includes("sellercentral") &&
    location.origin.includes("amazon")
  ) {
    if (location.href.includes("/home")) {
      createSellerCentralHomePageItems();
    } else if (location.href.includes("/messaging/inbox")) {
      createMessagesPageItems();
    } else if (
      location.href.indexOf("/orders-") > -1 &&
      location.href.indexOf("/order/") == -1
    ) {
      createOrdersPageItems();
    } else if (location.href.includes("/orders-v3/order")) {
      createOrderDetailPageItems(); //endpoint gelecek
    } else if (location.href.includes("/addresses/add")) {
      createAddNewAddressPageItems();
    } else if (location.href.includes("/a/addresses")) {
      createAllAddressesPageItems();
    } else if (location.href.indexOf("inventory/confirmAction") > -1) {
      createDeleteProductPageItems(!1);
    } else if (
      location.href.indexOf("inventory/pivot/inactive") > -1 ||
      location.href.indexOf("fixyourproducts") > -1
    ) {
      createRequestApprovalPageItems(); //endpoint eklenecek
      createRequestApprovalRemoveItems();
      createDeleteProductPageItems(!0); // sayfa yapısını bozuyor 1
      createFixProductPageItems(); // sayfa yapısını bozuyor 2
    } else if (location.href.indexOf("/automatepricing/rules/listings/") > -1) {
      createAutoPricePageItems();
    } else if (location.href.includes("/performance/dashboard")) {
      createPerformanceDashboardPageItems();
    } else if (location.href.includes("/fixyourproducts")) {
      // Yukarıda da var !!!
      createFixProductPageItems();
    } else if (location.href.includes("/listing/upload")) {
      createListingUploadPageItems();
    } else if (
      location.href.includes("/order-reports-and-feeds/feeds/confirmShipment")
    ) {
      createSellerCentralOrderFileUploadPageItems();
    }
  }
}

function createListingUploadPageItems() {
  setTimeout(() => {
    var marketplace = $("#partner-switcher")
      .data("marketplace_selection")
      .trim();

    var c = countryJson.find((i) => i.mwsCode == marketplace);

    var warning = ` <div id="sfMessage" class="sf-alert a-section" style="width: 73%;">
        <div class="sf-alert-content" > ${language["1000161"][activeLanguage]}<br> </div>`;
    warning = warning.replace("{COUNTRY}", c.country);

    $("#drag-target").prepend(warning);
  }, 1e3);
}

function createAutoPricePageItems() {
  var input1 = $(
    '<span class="a-button a-button-primary a-button-small yellow-button" id="sf-startbulkautoprice" style="width: 127px;"><span class="a-button-inner"><img style="width:20px;height:auto;float:left;" src="' +
      chrome.runtime.getURL("img/sf_extension.svg") +
      '"><input class="a-button-input" type="button" id="sf-startautorepricing"><span  class="a-button-text" aria-hidden="true">' +
      language["1000098"][activeLanguage] +
      "</span></span></span>"
  );
  var input2 = $(
    '<span class="a-button a-button-primary a-button-small yellow-button" id="sf-clearbulkautoprice" style="width: 127px;"><span class="a-button-inner"><img style="width:20px;height:auto;float:left;" src="' +
      chrome.runtime.getURL("img/sf_extension.svg") +
      '"><input class="a-button-input" type="button" id="sf-clearautorepricing"><span  class="a-button-text" aria-hidden="true">' +
      language["1000100"][activeLanguage] +
      "</span></span></span>"
  );
  var input3 = $(
    '<span class="a-button a-button-primary a-button-small yellow-button" id="sf-stopbulkautoprice" style="display:none;width: 127px;"><span class="a-button-inner"><img style="width:20px;height:auto;float:left;" src="' +
      chrome.runtime.getURL("img/sf_extension.svg") +
      '"><input class="a-button-input" type="button" id="sf-stopautorepricing"><span  class="a-button-text" aria-hidden="true">' +
      language["1000099"][activeLanguage] +
      "</span></span></span>"
  );

  input1.appendTo(jQuery(".horizontalFieldFirst"));
  input2.appendTo(jQuery(".horizontalFieldFirst"));
  input3.appendTo(jQuery(".horizontalFieldFirst"));

  var stopAction = false;

  $("#sf-startautorepricing").click(function () {
    $("#sf-startbulkautoprice").css("display", "none");
    $("#sf-clearbulkautoprice").css("display", "none");
    $("#sf-stopbulkautoprice").css("display", "inline-block");

    stopAction = false;
    process("associate");
  });

  $("#sf-stopautorepricing").click(function () {
    $("#sf-startbulkautoprice").css("display", "inline-block");
    $("#sf-clearbulkautoprice").css("display", "inline-block");
    $("#sf-stopbulkautoprice").css("display", "none");
    stopAction = true;
  });

  $("#sf-clearautorepricing").click(function () {
    $("#sf-startbulkautoprice").css("display", "none");
    $("#sf-clearbulkautoprice").css("display", "none");
    $("#sf-stopbulkautoprice").css("display", "inline-block");

    stopAction = false;
    process("disassociate");
  });

  function process(processType) {
    if (stopAction) {
      return;
    }

    function pageControl(processType) {
      var items = $("table#manage-listings-table .listing-table-row");
      var nextPage = $(".pagination-button.next-pagination-button");

      function nextPageControl() {
        var spinner = $("#listings-spinner-row");
        setTimeout(function () {
          "none" === spinner.css("display")
            ? items.length && process(processType)
            : nextPageControl();
        }, 200);
      }

      setTimeout(function () {
        if (nextPage.hasClass("a-button-disabled")) {
          if (processType == "associate") {
            alert(language["1000101"][activeLanguage]);
          } else {
            alert(language["1000102"][activeLanguage]);
          }
          location.reload();
        } else {
          nextPage.click();
          nextPageControl();
        }
      }, 200);
    }

    let ruleId;
    let ruleType;
    let counter = $("table#manage-listings-table .listing-table-row").length;
    let csrfToken = $("input[name='mars-csrf-token']").val();

    ruleId = location.href.split("rules/listings/").pop().split("?")[0];
    ruleType = $("#manage-listing-content")
      .html()
      .split('"ruleType":"')
      .pop()
      .split('"')[0];

    $("table#manage-listings-table .listing-table-row").each(function (
      index,
      item
    ) {
      var _this = $(item);
      var params = {};

      if (processType == "associate") {
        params.asin = _this.find("input.asin").val();
        params.sku = _this.find("input.sku").val();
        params.itemPrice = _this.find("input.displayprice").val();
        params.minPrice = _this.find("input.minPrice").val();
        params.maxPrice = _this.find("input.maxPrice").val();
        params.ruleId = ruleId;
        params.ruleType = ruleType;
        params.glType = _this.find("input.glType").val();
        params.shippingPrice = _this.find("input.shippingprice").val();
        params.localeString =
          $("input#localeString").attr("data-locale-string");
        params.token = _this.find("input.token").val();
        params.marketplaceId = _this.attr("data-listingmarketplace");
        params.pricingDiscriminator = _this
          .find("input.pricingDiscriminator")
          .val();
      } else {
        params.sku = _this.find("input.sku").val();
        params.marketplaceId = _this.attr("data-listingmarketplace");
        params.ruleId = ruleId;
      }

      $.ajax({
        url:
          "https://" +
          document.domain +
          "/automatepricing/ajax/rules/" +
          processType +
          "/multisku",
        type: "POST",
        dataType: "json",
        data: params,
        headers: {
          accept: "*/*",
          "content-type": "application/x-www-form-urlencoded",
          "anti-csrftoken-a2z": csrfToken,
        },
        success: function () {
          counter--;

          if (!counter) {
            pageControl(processType);
          }
        },
        error: function () {
          counter--;

          if (!counter) {
            pageControl(processType);
          }
        },
      });
    });
  }
}

function createInactivePageItems() {
  var sfButton = `
    <button id="sfButton" style="z-index: 999999; position: fixed; width:70px; height: 70px; bottom: 10px; right: 10px;
    background: none; border: none;  display: inline-block">
        <img src=${chrome.runtime.getURL(
          "img/sf_extension.svg"
        )} style="width: 90px;">
    </button>`;
  $("body").prepend(sfButton);

  var div = `
        <div id="sfContainer" class="sfContainer-bg3" style="display: none; ;">
            <div class="sfContainer-top">
                <div class="flex ai-c jc-sb" style="height:42px;padding: 0 0 0 15px;;">
                    <div class="flex ai-c">
                        <i class="fas fa-user"></i>
                        <span class="ml-15">${user.name}</span>
                    </div>
                    <div>
                        <button class="yellow-button" id="sf-hide" style="width:30px; font-weight:bold;">${language["1000070"][activeLanguage]}</button>
                    </div>
                </div>
            </div>
            <div class="sfContent">
                <div class="title">${language["1000096"][activeLanguage]}</div>
                <div class="description" style="margin-top: 20px;">
                        <p>
                        ${language["1000097"][activeLanguage]}
                        </p>
                </div>
            </div>
        </div> `;

  $("body").prepend(div);

  $("#sfButton").click(function () {
    $("#sfContainer").show();
    $("#sfButton").hide();
  });

  $("#sf-hide").click(function () {
    $("#sfContainer").hide();
    $("#sfButton").show();
  });
}

var tmpBuyerOrderId = "",
  tmpSellerOrderId = "";
var checkOrderIdAttempt = 0;

function createOrderResultPageItems() {
  chromeGetOrderDetails();

  if (localStorage.getItem("checkOrderIdInterval") != null)
    localStorage.removeItem("checkOrderIdInterval");
  if (localStorage.getItem("checkOrderIdIntervalFinished") != null)
    localStorage.removeItem("checkOrderIdIntervalFinished");

  localStorage.setItem("reloaded", 0);

  setTimeout(() => {
    var div = `

        <div id='sfPreloader-message'>
        <img src='${chrome.runtime.getURL(
          "img/loading.gif"
        )}' style='height:50px; margin-left:20px;' /><br>
        ${language["1000087"][activeLanguage]}
        </div>

        <div id='sfPreloader'><div>
     `;
    $("body").prepend(div);
  }, 200);

  var purchaseId = location.href.split("purchaseId=").pop().split("&")[0];
  var email = "";

  $.ajax({
    url: "https://www.amazon.com/ap/signin?openid.pape.max_auth_age=900&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fap%2Fcnep%3Fie%3DUTF8%26orig_return_to%3Dhttps%253A%252F%252Fwww.amazon.com%252Fyour-account%26openid.assoc_handle%3Dusflex%26pageId%3Dusflex&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0",
    type: "GET",
    contentType: "application/json;charset=utf-8",
    success: function (response) {
      var el = $("<div></div>");
      el.html(response);

      if ($(".a-color-tertiary", el).length) {
        email = $(".a-color-tertiary", el).text();
        email = email.replace("\n", "").trim();
      }

      if (email == "" || email == undefined) {
        if ($("form#cnep_1a_email_form", el).length) {
          email = $("form#cnep_1a_email_form", el)
            .text()
            .replaceAll("Email:", "")
            .replaceAll("Edit", "")
            .replaceAll("\n", "")
            .trim();
        }
      }
    },
    failure: function () {},
    complete: function () {
      console.log("email", email);
    },
  });

  var t = setInterval(function () {
    if (
      localStorage.getItem("checkOrderIdInterval") != null &&
      localStorage.getItem("checkOrderIdInterval") == purchaseId
    ) {
      localStorage.setItem("checkOrderIdIntervalFinished", true);
      clearInterval(t);

      $("#sfPreloader").hide();
      $("#sfPreloader-message").hide();

      var divFinished = `
            <div id='sfPreloaderFinished'>
                <div id='sfPreloaderFinished-message'>
                    <div style="float:right; margin-right: 0px;">
                        <button class="yellow-button" id="sf-hidePreloader" style="width:25px; font-weight:bold;">${language["1000070"][activeLanguage]}</button>
                    </div>
                    <div style="margin-top:40px">
                        <p>${language["1000091"][activeLanguage]}</p>
                        <hr style="color: black; border-color: black; margin-top: 10px;">
                        <p style="font-size:18px; margin-top:20px">${language["1000094"][activeLanguage]} : ${tmpBuyerOrderId}
                            <button class="yellow-button" id="sf-copyBuyerOrderId" style="width:30px; font-weight:bold;"><i class="fa fa-copy"></i> </button>
                        </p>
                        <p><i class="fa fa-arrow-down"></i></p>
                        <p style="font-size:18px; margin-top:20px">${language["1000114"][activeLanguage]} : ${tmpSellerOrderId}
                            <button class="yellow-button" id="sf-copySellerOrderId" style="width:30px; font-weight:bold;"><i class="fa fa-copy"></i> </button>
                        </p>
                        <hr style="color: black; border-color: black; margin-top: 10px;">
                        <p style="font-size:16px; ">${language["1000095"][activeLanguage]}</p>
                    </div>
                </div>
            </div>
            `;
      $("body").prepend(divFinished);
      $("#sf-hidePreloader").click(function () {
        $("#sfPreloaderFinished").hide();
      });

      $("#sf-copyBuyerOrderId").click(function () {
        navigator.clipboard.writeText(tmpBuyerOrderId);
        $("#sf-copyBuyerOrderId").html('<i class="fa fa-check"></i>');
        setTimeout(() => {
          $("#sf-copyBuyerOrderId").html('<i class="fa fa-copy"></i>');
        }, 2e3);
      });

      $("#sf-copySellerOrderId").click(function () {
        navigator.clipboard.writeText(tmpSellerOrderId);
        $("#sf-copySellerOrderId").html('<i class="fa fa-check"></i>');
        setTimeout(() => {
          $("#sf-copySellerOrderId").html('<i class="fa fa-copy"></i>');
        }, 2e3);
      });

      // here comes redirect
      setTimeout(() => {
        location.href = "https://www.amazon.com";
      }, 60e3);

      return;
    } //https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_search?opt=ab&search=&disableCsd=no-js
    else if (
      checkOrderIdAttempt > 50 ||
      localStorage.getItem("orderDetails") == null ||
      localStorage.getItem("orderDetails") == undefined
    ) {
      // Buyer order bilgisi alınamadı veya seller order bilgisi bulunamadı. Uyarı mesajı verilerek işlem sonlanacak.
      localStorage.setItem("checkOrderIdIntervalFinished", true);
      clearInterval(t);

      $("#sfPreloader").hide();
      $("#sfPreloader-message").hide();

      var divFinished = `
            <div id='sfPreloaderFinished'>
                <div id='sfPreloaderFinished-message'>
                    <div style="float:right; margin-right: 0px;">
                        <button class="yellow-button" id="sf-hidePreloader" style="width:25px; font-weight:bold;">${language["1000070"][activeLanguage]}</button>
                    </div>
                    <div style="margin-top:40px">
                        <p style="font-size:18px; margin-top:90px">${language["1000127"][activeLanguage]}</p>
                    </div>
                </div>
            </div>
            `;
      $("body").prepend(divFinished);
      $("#sf-hidePreloader").click(function () {
        $("#sfPreloaderFinished").hide();
      });

      return;
    } else {
      if (localStorage.getItem("checkOrderIdIntervalFinished") == null) {
        var link = "";
        if (newOrderDetection && checkOrderIdAttempt < 3) {
          link =
            location.origin +
            "/gp/your-account/order-history?ie=UTF8&ref%5F=ya%5Fd%5Fc%5Fyo&disableCsd=no-js";
        } else {
          link =
            location.origin +
            "/gp/your-account/order-history/ref=ppx_yo_dt_b_search?opt=ab&search=" +
            purchaseId +
            "&disableCsd=no-js";
        }

        console.log("attemp #: " + checkOrderIdAttempt + " Url: " + link);

        if (
          localStorage.getItem("configurationIdSelected") === 1 ||
          localStorage.getItem("configurationIdSelected") === 0
        ) {
          link = link + "&selectedB2BGroupKey=yourself";
        }

        checkOrderIdAttempt = checkOrderIdAttempt + 1;
        chrome.runtime.sendMessage({
          type: "checkOrderId",
          link: link,
          purchaseId: purchaseId,
          email: email,
          action:
            newOrderDetection && checkOrderIdAttempt < 3
              ? "newCheckOrderId"
              : "checkOrderId",
        });
      } else {
        $("#sfPreloader").hide();
        $("#sfPreloader-message").hide();
      }
    }
  }, 5e3);
}

function getFilterSettingAsync() {
  let fetchHeaders = new Headers();
  fetchHeaders.append("Authorization", `Bearer ${user.token}`);

  const fetchOptions = {
    method: "GET",
    headers: fetchHeaders,
  };

  fetch(
    user.apiSubdomain + "api/extensionfiltersetting/filtersetting",
    fetchOptions
  )
    .then((response) => response.text())
    .then(function (response) {
      if (!response) {
        return;
      }

      let result = JSON.parse(response);

      var divFilters = `<select name="sfFilterOptions" id="sfFilterOptions" style="font-size: 15px; width: 190px;">`;

      divFilters += `<option selected value="0">${language["1000172"][activeLanguage]}</option>`;

      $.each(result, function (index, value) {
        divFilters += `<option value="${value.extensionFilterSettingId}">${value.filterName}</option>`;
      });

      divFilters += "</select>";

      $("#sfFilterSelect").html(divFilters);

      const selectedFilterSettingId = parseInt($("#sfFilterOptions")[0].value);
      if (selectedFilterSettingId === 0) {
        $("#sfDeleteFilterButton")[0].hidden = true;
        $("#sfSaveFilters")[0].textContent =
          language["1000175"][activeLanguage];
      } else {
        $("#sfSaveFilters")[0].textContent =
          language["1000170"][activeLanguage];
      }

      $("select#sfFilterOptions").change(function () {
        const selectedFilterSettingId = parseInt(
          $("#sfFilterOptions")[0].value
        );

        if (selectedFilterSettingId === 0) {
          $("#sfSaveFilters")[0].textContent =
            language["1000175"][activeLanguage];
          $("#sfDeleteFilterButton")[0].hidden = true;
        } else {
          $("#sfSaveFilters")[0].textContent =
            language["1000170"][activeLanguage];
          $("#sfDeleteFilterButton")[0].hidden = false;
        }

        let selectedFilter = result.find(
          (p) => p.extensionFilterSettingId === selectedFilterSettingId
        );
        if (selectedFilter) {
          $("#sfSponsored").prop(
            "checked",
            selectedFilter.buySponsoredProducts
          );
          $("#sfCouponDiscount").prop(
            "checked",
            selectedFilter.buyCouponDiscountProducts
          );
          $("#sfPriceMin").val(selectedFilter.minPrice);
          $("#sfPriceMax").val(selectedFilter.maxPrice);
          $("#sfStarsMin").val(selectedFilter.minStar);
          $("#sfStarsMax").val(selectedFilter.maxStar);
        }
      });
    });
}

async function createSaveFilterPageItems() {
  setTimeout(() => {
    var element = $("#sfMarketPlace");

    if (!element.length) {
      createSaveFilterPageItems();
      return;
    }

    getFilterSettingAsync();
  }, 500);
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function createRequestApprovalPageItems() {
  setTimeout(() => {
    var divMenu = `
        <div id="sfApprovalButton">
            <input type="button" value="${language["1000163"][activeLanguage]}" title="${language["1000168"][activeLanguage]}" class="yellow-button" style="width:auto; margin-left:10px" id="approveButtonSf" >
            </input>
        </div>`;

    var element = $(".filter-bar");

    if (!element.length) {
      createRequestApprovalPageItems();
      return;
    }

    const selected = $(".filter-option-link span.selected");

    if (!selected.length) {
      createRequestApprovalPageItems();
      return;
    }

    if (!selected[0].textContent) {
      createRequestApprovalPageItems();
      return;
    }

    if (!selected[0].textContent.includes("Approval")) {
      createRequestApprovalPageItems();
      return;
    }

    var marketplace = $("#partner-switcher")
      .data("marketplace_selection")
      .trim();
    var country = countryJson.find((i) => i.mwsCode == marketplace);

    let sellingPartnerId = $("div#partner-switcher")
      .data("merchant_selection")
      .trim();

    sellingPartnerId = sellingPartnerId.replace("amzn1.merchant.o.", "");

    $(element).append(divMenu);
    document
      .getElementById("approveButtonSf")
      .addEventListener("click", async () => {
        debugger;
        let tempMail = prompt(language["1000169"][activeLanguage], user.email);

        if (!confirm(language["1000167"][activeLanguage])) {
          // do what ever you want if the form is submitted.
          return;
        }

        if (
          !$(".filter-option-link span.selected")[0].textContent.includes(
            "Approval"
          )
        ) {
          alert(language["1000166"][activeLanguage]);
          return;
        }

        const pages = $(
          ".pagination-container .pagination-component-wrapper kat-pagination"
        )[0].shadowRoot.querySelectorAll("ul li.item.page");

        const totalPage = parseInt(
          pages[pages.length - 1].attributes["data-page"].value
        );

        var div = `

            <div id='sfPreloader-message'>
            <img src='${chrome.runtime.getURL(
              "img/loading.gif"
            )}' style='height:50px; margin-left:20px;' /><br>
              <div id='sfProgressMessage'>
              </div>
            </div>
            <div id='sfPreloader'><div>
         `;
        $("body").prepend(div);

        for (let i = 1; i <= totalPage; i++) {
          let progressText = `${language["1000164"][activeLanguage]} <br> ${language["1000165"][activeLanguage]} ${i}/${totalPage}`;

          $("#sfProgressMessage").html(progressText);

          const currentPage = $(
            ".pagination-container .pagination-component-wrapper kat-pagination"
          )[0].shadowRoot.querySelector(`ul li.item.page[data-page="${i}"]`);

          if (!currentPage) {
            console.error("could not found page", i);
            continue;
          }

          currentPage.click();

          await waitForElm("#row-0");

          const asins = Array.from(
            document.querySelectorAll(".product-details-card .asin")
          ).map((r) => r.textContent.replace("ASIN: ", "").trim());
          const approvedAsins = [];
          const { origin } = location;
          for (const asin of asins) {
            try {
              const url = `${origin}/hz/approvalrequest/restrictions/approve?asin=${asin}&itemcondition=new&ref=myi_il_ra`;

              const response = await fetch(url);

              if (response.status !== 200) {
                console.log(`${response.status} for ASIN: ${asin}`);
                continue;
              }

              const body = await response.text();

              const $approval = $(body);

              const href = `/abis/Display/ItemSelected?asin=${asin}`;

              const $alreadyApproved = $approval.find(`a[href='${href}']`);
              if ($alreadyApproved.length) {
                console.log("already approved skipping", asin);
                continue;
              }

              const csrf = $approval
                .find("input[name=appFormPageCsrfToken]")
                .val();

              const form = new FormData();

              form.append("appFormPageCsrfToken", csrf);

              const url2 = `${origin}/hz/approvalrequest?asin=${asin}&itemcondition=new`;
              const referrer = url;
              const redirect = await fetch(url2, {
                body: new URLSearchParams(form),
                method: "POST",
                referrer,
              });

              const approvalUrl = redirect.url;
              const applicationId = approvalUrl.split("application-id=").pop();

              const approveResponse = await fetch(approvalUrl, {
                referrer,
              });

              const approvalBody = await approveResponse.text();
              const $approvalForm = $(approvalBody);
              const $documentRequired = $approvalForm.find(
                "#container-dnd-Invoice-SU--"
              );
              if ($documentRequired.length) {
                console.log("document required skipping asin ", asin);
                continue;
              }

              const approvalCsrf = $approvalForm
                .find("input[name=appFormPageCsrfToken]")
                .val();
              const config = $approvalForm
                .find(".SellerUniversityWidgetDocumentConfig")
                .attr("data-su-widget-config");
              const configJson = JSON.parse(config);
              const { moduleId } = configJson;

              const preConfirmUrl = `${origin}/hz/approvalrequest/seller-university-validation?appFormPageCsrfToken=${approvalCsrf}`;

              _ = await fetch(preConfirmUrl, {
                referrer: `${origin}/hz/approvalrequest/approve?input-value=${applicationId}&input-type=applicationId&application-id=${applicationId}`,
                referrerPolicy: "strict-origin-when-cross-origin",
                body: moduleId,
                method: "POST",
                mode: "cors",
                credentials: "include",
              });

              const approveUrl = `${origin}/hz/approvalrequest/confirmation`;

              const approvalForm = new FormData();
              const jsonBody =
                '{"questionIdToAnsweredOptionsMap":{"saw_ques_seller_type":[{"optionId":"saw_reseller_dstr","domOptionId":"saw_ques_seller_type__saw_reseller_dstr","value":"saw_reseller_dstr","optionGroup":null}],"saw_ques_listing_resp_header":[{"optionId":"saw_ques_listing_resp_option4","domOptionId":"saw_ques_listing_resp_header__saw_ques_listing_resp_option4","value":"saw_ques_listing_resp_option4","optionGroup":null}],"saw_ques_illegal_product_header":[{"optionId":"saw_ques_illegal_product_option_aotb","domOptionId":"saw_ques_illegal_product_header__saw_ques_illegal_product_option_aotb","value":"saw_ques_illegal_product_option_aotb","optionGroup":null}],"saw_ques_best_pract_compl_header":[{"optionId":"saw_ques_best_pract_compl_option_aotb","domOptionId":"saw_ques_best_pract_compl_header__saw_ques_best_pract_compl_option_aotb","value":"saw_ques_best_pract_compl_option_aotb","optionGroup":null}],"saw_ack_auth":[{"optionId":"saw_ack_auth","domOptionId":"saw_ack_auth__saw_ack_auth","value":"saw_ack_auth","optionGroup":null}]},"version":null}';
              approvalForm.append("seller-questionnaire-input", jsonBody);
              let email = user.email;

              if (tempMail) {
                email = tempMail;
              }

              approvalForm.append("emails", email);
              approvalForm.append("primary-email", email);
              approvalForm.append("application-type", "BRAND");
              approvalForm.append("application-id", applicationId);
              approvalForm.append("phone", "");
              approvalForm.append("racerx-start-node", "Start");
              approvalForm.append("is-draft", false);
              approvalForm.append("workflow", "");
              approvalForm.append("case-id", "");
              approvalForm.append("input-type", "applicationId");
              approvalForm.append("input-value", applicationId);
              approvalForm.append("appFormPageCsrfToken", approvalCsrf);

              const searchParams = new URLSearchParams(approvalForm);
              const approvalResult = await fetch(
                approveUrl,

                {
                  body: searchParams,
                  method: "POST",
                }
              );

              if (approvalResult.ok) {
                approvedAsins.push(asin);
              }
            } catch (err) {
              console.log(`error for asin ${asin}`, err);
              continue;
            }
          }

          if (!approvedAsins.length) {
            continue;
          }
          var formData1 = new FormData();

          formData1.append("countryCode", country.countryCode.trim());
          formData1.append("sellingPartnerId", sellingPartnerId.trim());
          formData1.append("customerId", 0);

          for (let index = 0; index < approvedAsins.length; index++) {
            formData1.append("asinList[]", approvedAsins[index]);
          }

          // $.ajax({
          //   type: "POST",
          //   url:
          //     user.apiSubdomain +
          //     "api/inventoryitem/updateinventoryitemsfromextension",
          //   headers: { Authorization: "Bearer " + user.token },
          //   data: formData1,
          //   processData: false,
          //   contentType: false,
          //   success: async function () {
          //     console.log("inventory item updates success!");
          //   },
          //   failure: function () {
          //     console.log("inventory item updates fail!");
          //   },
          //   complete: async function () {
          //     console.log("inventory item updates complete!");
          //   },
          // });
        }

        $("#sfPreloader").hide();
        $("#sfPreloader-message").hide();
      });
  }, 500);
}

async function createRequestApprovalRemoveItems() {
  setTimeout(() => {
    var divMenu = `
        <div>
            <input type="button" value="${language["1000182"][activeLanguage]}" title="${language["1000183"][activeLanguage]}" class="yellow-button" style="width:auto; margin-left:10px; color: white; background-color: #ff4242" id="approveRemoveButtonSf" >
            </input>
        </div>`;

    var element = $(".filter-bar");

    if (!element.length) {
      createRequestApprovalRemoveItems();
      return;
    }

    const selected = $(".filter-option-link span.selected");

    if (!selected.length) {
      createRequestApprovalRemoveItems();
      return;
    }

    if (!selected[0].textContent) {
      createRequestApprovalRemoveItems();
      return;
    }

    if (!selected[0].textContent.includes("Approval")) {
      createRequestApprovalRemoveItems();
      return;
    }

    var marketplace = $("#partner-switcher")
      .data("marketplace_selection")
      .trim();

    var country = countryJson.find((i) => i.mwsCode == marketplace);

    let sellingPartnerId = $("div#partner-switcher")
      .data("merchant_selection")
      .trim();

    sellingPartnerId = sellingPartnerId.replace("amzn1.merchant.o.", "");

    $(element).append(divMenu);
    document
      .getElementById("approveRemoveButtonSf")
      .addEventListener("click", async () => {
        if (
          !$(".filter-option-link span.selected")[0].textContent.includes(
            "Approval"
          )
        ) {
          alert(language["1000166"][activeLanguage]);
          return;
        }

        const pages = $(
          ".pagination-container .pagination-component-wrapper kat-pagination"
        )[0].shadowRoot.querySelectorAll("ul li.item.page");

        const totalPage = parseInt(
          pages[pages.length - 1].attributes["data-page"].value
        );

        var div = `

            <div id='sfPreloader-message'>
            <img src='${chrome.runtime.getURL(
              "img/loading.gif"
            )}' style='display:block; height:50px; margin-left: auto; margin-right: auto;' /><br>
              <div id='sfProgressMessage'>
              </div>
            </div>
            <div id='sfPreloader'><div>
         `;
        $("body").prepend(div);

        for (let i = 1; i <= totalPage; i++) {
          let progressText = `${language["1000164"][activeLanguage]} <br> ${language["1000165"][activeLanguage]} ${i}/${totalPage}`;

          $("#sfProgressMessage").html(progressText);

          const currentPage = $(
            ".pagination-container .pagination-component-wrapper kat-pagination"
          )[0].shadowRoot.querySelector(`ul li.item.page[data-page="${i}"]`);

          if (!currentPage) {
            console.error("could not found page", i);
            continue;
          }

          currentPage.click();

          await waitForElm("#row-0");

          const asins = Array.from(
            document.querySelectorAll(".product-details-card .asin")
          ).map((r) => r.textContent.replace("ASIN: ", "").trim());
          const skus = Array.from(
            document.querySelectorAll(".product-details-card .sku")
          ).map((r) => r.textContent.replace("SKU: ", "").trim());
          const skuMap = new Map();

          for (let i = 0; i < asins.length; ++i) {
            skuMap.set(asins[i], skus[i]);
          }

          const removeAsins = [];
          const { origin } = location;
          for (const asin of asins) {
            try {
              const url = `${origin}/hz/approvalrequest/restrictions/approve?asin=${asin}&itemcondition=new&ref=myi_il_ra`;
              const response = await fetch(url);

              if (response.status !== 200) {
                console.log(`${response.status} for ASIN: ${asin}`);
                continue;
              }

              const body = await response.text();
              const $approval = $(body);
              const href = `/abis/Display/ItemSelected?asin=${asin}`;

              const $alreadyApproved = $approval.find(`a[href='${href}']`);
              if ($alreadyApproved.length) {
                console.log("already approved skipping", asin);
                continue;
              }

              const approveItemText = $approval.find(".a-list-item").text();

              if (approveItemText.indexOf(asin) > -1) {
                removeAsins.push(asin);
                continue;
              }

              const csrf = $approval
                .find("input[name=appFormPageCsrfToken]")
                .val();

              const form = new FormData();

              form.append("appFormPageCsrfToken", csrf);

              const url2 = `${origin}/hz/approvalrequest?asin=${asin}&itemcondition=new`;
              const referrer = url;
              const redirect = await fetch(url2, {
                body: new URLSearchParams(form),
                method: "POST",
                referrer,
              });

              const approvalUrl = redirect.url;

              const approveResponse = await fetch(approvalUrl, {
                referrer,
              });

              const approvalBody = await approveResponse.text();
              const $approvalForm = $(approvalBody);
              const $documentRequired = $approvalForm.find(
                "#container-dnd-invoice-checkboxes-new-1--, #container-dnd-Invoice-SU--"
              );
              if ($documentRequired.length) {
                removeAsins.push(asin);
              }
            } catch (err) {
              console.log(`error for asin ${asin}`, err);
              continue;
            }
          }

          if (!removeAsins.length) {
            continue;
          }
          debugger;
          var pList = [];

          // for (let i = 0; i < removeAsins.length; ++i) {
          //   var obj = {};
          //   obj["Sku"] = skuMap.get(removeAsins[i]);
          //   pList.push(obj);
          // }
          for (let i = 0; i < removeAsins.length; ++i) {
            pList.push(skuMap.get(removeAsins[i]));
          }

          // var mp = getMarketplaceByPage().AmazonMarketplaceId;
          console.log("P List");
          console.log(pList);
          $.ajax({
            url: `${baseUrl}${endPoints.StoreProduct.storeProducts}`,
            type: "DELETE",
            contentType: "application/json;charset=utf-8",
            headers: { Authorization: "Bearer " + user.token },
            data: JSON.stringify({
              skUs: pList,
              storeProductIds: [],
              asiNs: [],
            }),
            success: function () {},
            failure: function (response) {
              console.log("Error (failure)! ", response);
            },
            complete: function (data) {
              if (data.status == 200) {
                $(".sf-alert-content").html(
                  language["1000008"][activeLanguage]
                );
              } else {
                $(".sf-alert-content").html(
                  "<i class='fa fa-exclamation-circle' style='margin-right: 5px;' /> " +
                    language["1000009"][activeLanguage]
                );
              }
            },
          });
        }

        $("#sfPreloader").hide();
        $("#sfPreloader-message").hide();
      });
  }, 500);
}

function createSellerCentralOrderFileUploadPageItems() {
  var divMenu = `
    <div id="sfContainerMenu" class="sfContainer-bg3" style="width:450px; height:500px;">
        <div class="sfContainer-top">
            <div class="flex ai-c jc-sb" style="height:42px; padding: 0 0 0 15px;">
                <div class="flex ai-c">
                    <i class="fas fa-user"></i>
                    <span class="ml-15">${user.name}</span>
                </div>
                <div>
                    <button class="yellow-button" id="sf-hideTracker" style="width:30px;  font-weight:bold;">${
                      language["1000070"][activeLanguage]
                    }</button>
                </div>
            </div>
        </div>
        <div class="sfContent">
            <div style="text-align: center !important; margin-top:0px;">
                <img src=${chrome.runtime.getURL(
                  "img/logo_uzun.png"
                )} style="height: 40px; margin:20px;">
            </div>
            <div style="text-align: center; margin-bottom:10px;">
            <span style="font-family: 'Poppins';">Manuel Yönetim İşlemleri</span>
            </div>
            <div class="flex ai-c jc-sb mb-10">
                <div style="margin-top: 3px;">
                    <img src='${chrome.runtime.getURL(
                      "img/sf2amz.png"
                    )}' style='height: 34px;' alt='' />
                </div>
                <div class="flex ai-c jc-end">
                    <button id='sfManualGetShippingTrackingInformationFromSF' class="yellow-button" style="width:310px; font-family: 'Poppins';">
                        ${language["1000153"][activeLanguage]}
                    </button>
                    <div>
                        <i class='fa fa-info-circle sftooltip' style='margin-left: 5px;' >
                        <span class="sftooltiptext" style="top: -35px;left: -400px; width: 400px;">
                            <ul style="color: white;">
                                <li>Siparişlerinizin kargo ve taşıyıcı bilgileri SellerFlash’tan Amazon’a aktarılacaktır.</li>
                                <li>Sipariş takip bilgileri için günde 4 kez bir bu işlemin yapılması gerekmektedir. </li>
                                <li>Alıcı hesabı kargo bilgileri SellerFlash’a aktarıldığında bu işlemin yapılması tavsiye edilmektedir. </li>
                            </ul>
                        </span>
                        </i>
                    </div>
                </div>
            </div>
            <div class="flex ai-c jc-sb mb-10">
                <div style="margin-top: 3px;">
                    <img src='${chrome.runtime.getURL(
                      "img/sf2amz.png"
                    )}' style='height: 34px;' alt='' />
                </div>
                <div class="flex ai-c jc-end">
                    <button id='sfManualTransferShippingTrackingLoadingResults' class="yellow-button" style="width:310px; font-family: 'Poppins';">
                        ${language["1000155"][activeLanguage]}
                    </button>
                    <div>
                        <i class='fa fa-info-circle sftooltip' style='margin-left: 5px;' >
                        <span class="sftooltiptext" style="top: -35px;left: -400px; width: 400px;">
                            <ul style="color: white;">
                                <li>Manuel Envanter güncelleme raporları oluştukça bu buton aktif olacaktır.</li>
                                <li>Tamamlanan raporlar sonuçları SellerFlash’a aktarılarak envanter güncelleme işlemleri tamamlanmış olur. </li>
                                <li>Buton aktif ise bekleyen rapor sonuçlarının işlenmesi için işlem yapılmalıdır. </li>
                            </ul>
                        </span>
                        </i>
                    </div>
                </div>
            </div>
            <button id='sfManualGoHomePage' class="blue-button" style="width:100%; font-family: 'Poppins';">
                ${language["1000159"][activeLanguage]}
            </button>
            <div style="width: 100%;">
                <div id="sfProcessDetails" class="sf-process mt-10  jc-center" style="display:none;">
                </div>
            </div>
        </div>
    </div> `;

  var sfButton = `
        <button id="sfButton" style="z-index: 999999; position: fixed; width:80px; height: 80px; bottom: 10px; right: 10px; display: none;
        background: none; border: none; ">
            <img src=${chrome.runtime.getURL(
              "img/sf_extension.svg"
            )} style="width: 80px;">
        </button>`;
  $("body").prepend(sfButton);
  $("body").append(divMenu);

  $("#sfButton").click(function () {
    $("#sfContainerMenu").show();
    $("#sfButton").hide();
  });
  $("#sf-hideTracker").click(function () {
    $("#sfContainerMenu").hide();
    $("#sfButton").show();
  });

  setTimeout(() => {
    var marketplace = $("#partner-switcher")
      .data("marketplace_selection")
      .trim();
    var country = countryJson.find((i) => i.mwsCode == marketplace);
    var sellerId = $("div#partner-switcher").data("merchant_selection").trim();
    sellerId = sellerId.replace("amzn1.merchant.o.", "");

    $.ajax({
      type: "GET",
      url:
        user.apiSubdomain +
        "api/feeds/getPendingFeeds?sellerId=" +
        sellerId +
        "&feedType=14&countryCode=" +
        country.countryCode,
      headers: { Authorization: "Bearer " + user.token },
      success: async function (response) {
        if (response.length == 0) {
          $("#sfManualTransferShippingTrackingLoadingResults").prop(
            "disabled",
            true
          );
          $("#sfManualTransferShippingTrackingLoadingResults").css(
            "cursor",
            "not-allowed"
          );
          $("#sfManualTransferShippingTrackingLoadingResults").prop(
            "title",
            "Tüm güncellemeler tamamlanmıştır."
          );
        } else {
          $("#sfManualTransferShippingTrackingLoadingResults").prop(
            "disabled",
            false
          );
          $("#sfManualTransferShippingTrackingLoadingResults").css(
            "cursor",
            "pointer"
          );
          $("#sfManualTransferShippingTrackingLoadingResults").text(
            $("#sfManualTransferShippingTrackingLoadingResults").text() +
              " (" +
              response.length +
              " adet)"
          );
        }
      },
      failure: function (response) {
        console.log("listing/getPendingFeeds.failure!", response);
      },
      complete: async function (response) {
        console.log("listing/getPendingFeeds.complete!", response);
      },
    });
  }, 1e3);

  $("#sfManualGetShippingTrackingInformationFromSF").click(async function () {
    $("#sfProcessDetails").html(
      `<div class='flex ai-c' style="width:100%; font-family: 'Poppins';"> <img src='` +
        chrome.runtime.getURL("img/loading.gif") +
        "' style='width: 40px; height: 40px; margin-right: 20px;'  />" +
        language["1000090"][activeLanguage] +
        "</div>"
    );
    $("#sfProcessDetails").show();

    await manualGetShippingTrackingInformationFromSF();
  });

  $("#sfManualTransferShippingTrackingLoadingResults").click(async function () {
    $("#sfProcessDetails").html(
      `<div class='flex ai-c' style="width:100%; font-family: 'Poppins';"> <img src='` +
        chrome.runtime.getURL("img/loading.gif") +
        "' style='width: 40px; height: 40px; margin-right: 20px;'  />" +
        language["1000090"][activeLanguage] +
        "</div>"
    );
    $("#sfProcessDetails").show();

    await manualTransferShippingTrackingLoadingResults();
  });

  $("#sfManualGoHomePage").click(async function () {
    $("#sfProcessDetails").html(
      `<div class='flex ai-c' style="width:100%; font-family: 'Poppins';"> <img src='` +
        chrome.runtime.getURL("img/loading.gif") +
        "' style='width: 40px; height: 40px; margin-right: 20px;'  />" +
        language["1000090"][activeLanguage] +
        "</div>"
    );
    $("#sfProcessDetails").show();

    location.replace(location.origin + "/home");
  });
}

function createSellerCentralHomePageItems() {
  setTimeout(async () => {
    var marketplace = $("#partner-switcher")
      .data("marketplace_selection")
      .trim();
    var country = countryJson.find((i) => i.mwsCode == marketplace);
    var sellerId = $("div#partner-switcher").data("merchant_selection").trim();
    sellerId = sellerId.replace("amzn1.merchant.o.", "");

    var isManualManagementMarketPlace = false;

    setTimeout(() => {
      var s = $("#KPI_CARD_LIST_DATA").text();
      var map = s.split('"merchantMarketplacesMap":"').pop().split('}",')[0];
      map = map + "}";
      map = map.replaceAll('\\"', "");
    }, 1e3);

    if (!isManualManagementMarketPlace) {
      let sfDiv = `
        <div class="css-93gqc1" style="min-height: 67px; border: 1px solid rgb(206, 209, 210);padding: 8px;">
          <div id="sfContainer" style="width:250px;">
            <button id='sfCheckAddresses' class="yellow-button">
                  ${language["1000088"][activeLanguage]}
            </button>
            <p id="sfMessage"> ${language["1000089"][activeLanguage]}</p>
          </div>
        </div>
          `;

      let container = $("#kpiCardList div[data-testid='Grid']");

      if (!container || container.length == 0) {
        container = $("#KpiCardList casino-channel-grid");
        sfDiv = `
          <casino-card class="hydrated" style="order: 200; grid-column: span 10;">
            ${sfDiv}
          </casino-card>
        `;
      }

      container.first().append(sfDiv);

      $("#sfCheckAddresses").click(async function () {
        $("#sfMessage").text(language["1000090"][activeLanguage]);
        $("#sfCheckAddresses").prop("disabled", true);

        await checkIfNotFullAddressExists();
      });

      setInterval(() => {
        checkIfNotFullAddressExists();
      }, 60000 * 10); // Every 10 min.
    }
  }, 1e3);
}

var csrfToken = "";
var completedFeedCount = 0;

//manual transfer iptal edildi
async function manualTransferShippingTrackingLoadingResults() {
  completedFeedCount = 0;

  var marketplace = $("#partner-switcher").data("marketplace_selection").trim();
  var country = countryJson.find((i) => i.mwsCode == marketplace);
  var sellerId = $("div#partner-switcher").data("merchant_selection").trim();
  sellerId = sellerId.replace("amzn1.merchant.o.", "");

  $.ajax({
    type: "GET",
    url:
      user.apiSubdomain +
      "api/feeds/getPendingFeeds?sellerId=" +
      sellerId +
      "&feedType=14&countryCode=" +
      country.countryCode,
    headers: { Authorization: "Bearer " + user.token },
    success: async function (response) {
      var batchIdList = response;

      if (response.length == 0) {
        $("#sfProcessDetails").html(
          "Kontrol edilmesi gereken rapor bulunmuyor. <br>Tüm yükleme sonuç raporları SellerFlash'a aktarılmıştır."
        );
      } else {
        $.ajax({
          type: "GET",
          url:
            location.origin +
            "/order-reports-and-feeds/api/feedStatus?type=confirmShipment",
          success: async function (response) {
            var result = response;

            var existingFeeds = result.feedRequestResult.filter(
              (x) =>
                batchIdList.some((y) => y.documentId === x.referenceId) &&
                x.requestState === "Done"
            );
            for (const value of existingFeeds) {
              var feedId = batchIdList.find(
                (x) => x.documentId === value.referenceId
              ).feedId;

              var batchResultDownloadLink =
                "/order-reports-and-feeds/feeds/download?documentName=" +
                value.documentName +
                "&documentId=" +
                value.processingReportDocumentId +
                "&fileType=txt";

              await new Promise((resolve, reject) => {
                $.ajax({
                  type: "GET",
                  url: location.origin + batchResultDownloadLink,
                  xhrFields: { responseType: "blob" },
                  success: async function (response) {
                    var formData3 = new FormData();
                    formData3.append("image", response);
                    formData3.append("sellerId", sellerId);
                    formData3.append("feedId", feedId);
                    formData3.append("feedType", 14);
                    formData3.append("countryCode", country.countryCode);

                    $.ajax({
                      type: "POST",
                      url: user.apiSubdomain + "api/feeds/uploadasync",
                      headers: { Authorization: "Bearer " + user.token },
                      data: formData3,
                      processData: false,
                      contentType: false,
                      success: async function () {
                        completedFeedCount = completedFeedCount + 1;
                        resolve();
                      },
                      failure: function () {
                        reject();
                      },
                      complete: async function (response) {
                        console.log("feeds/uploadasync.complete!", response);
                      },
                    });
                  },
                  failure: function (response) {
                    console.log("batchResultDownloadLink.failure!", response);
                    reject();
                  },
                  complete: async function (response) {
                    console.log("batchResultDownloadLink.complete!", response);
                  },
                });
              });
            }

            $("#sfProcessDetails").html(
              `<div class='flex ai-c' style="width:100%; font-family: 'Poppins';"> <img src='` +
                chrome.runtime.getURL("img/check.png") +
                "' style='width: 40px; height: 40px; margin-right: 20px;'  />" +
                language["1000091"][activeLanguage] +
                "</div>"
            );
          },
          failure: function (response) {
            console.log("listing/status.failure!", response);
          },
          complete: async function (response) {
            console.log("listing/status.complete!", response);
          },
        });
      }
    },
    failure: function (response) {
      console.log("listing/getPendingFeeds.failure!", response);
    },
    complete: async function (response) {
      console.log("listing/getPendingFeeds.complete!", response);
    },
  });
}

function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}

injectScript(chrome.extension.getURL("injection.js"), "body");

window.addEventListener("message", function (event) {
  if (event.data && event.data.type == "getCsrfToken") {
    csrfToken = event.data.csrfToken;
  }
});

async function manualGetShippingTrackingInformationFromSF() {
  var marketplace = $("#partner-switcher").data("marketplace_selection").trim();
  var country = countryJson.find((i) => i.mwsCode == marketplace);
  var sellerId = $("div#partner-switcher").data("merchant_selection").trim();
  sellerId = sellerId.replace("amzn1.merchant.o.", "");

  $.ajax({
    type: "GET",
    url:
      user.apiSubdomain +
      "api/feeds/downloadinventoryfileasync?sellerId=" +
      sellerId +
      "&countryCode=" +
      country.countryCode +
      "&feedType=14",
    xhrFields: { responseType: "blob" },
    headers: { Authorization: "Bearer " + user.token },
    success: async function (response, s, request) {
      var headerDisposition = request.getResponseHeader("content-disposition");
      if (!headerDisposition) {
        $("#sfProcessDetails").html("İşlem tamamlandı.");
        return;
      }
      var fileName = headerDisposition.split("filename=").pop().split(";")[0];
      var feedId = fileName.split("-")[1];

      var file = response;

      var formData1 = new FormData();

      formData1.append("feedFile", file);
      formData1.append("feedName", "confirmShipment");
      formData1.append("feedVersion", "new");
      formData1.append("csrfToken", csrfToken);

      setTimeout(() => {
        $.ajax({
          type: "POST",
          url: location.origin + "/order-reports-and-feeds/api/uploadFeed",
          data: formData1,
          processData: false,
          contentType: false,
          success: async function (response) {
            var batchId = response.batchId;

            var updateData = {};
            updateData.FeedId = feedId;
            updateData.FeedType = 14;
            updateData.SellerId = sellerId;
            updateData.CountryCode = country.countryCode;
            updateData.DocumentId = batchId;

            $.ajax({
              type: "POST",
              url: user.apiSubdomain + "api/feeds/updateprocessingstatusasync",
              headers: { Authorization: "Bearer " + user.token },
              data: JSON.stringify(updateData),
              contentType: "application/json; charset=utf-8",
              success: async function () {
                $("#sfProcessDetails").html(
                  `<div class='flex ai-c' style="width:100%; font-family: 'Poppins';"> <img src='` +
                    chrome.runtime.getURL("img/check.png") +
                    "' style='width: 40px; height: 40px; margin-right: 20px;'  />" +
                    language["1000091"][activeLanguage] +
                    "</div>"
                );
              },
              failure: function (response) {
                console.log("updateprocessingstatusasync.failure!", response);
              },
              complete: async function (response) {
                console.log("updateprocessingstatusasync.complete!", response);
              },
            });
          },
          failure: function (response) {
            console.log("introspect-feed.failure!", response);
          },
          complete: async function (response) {
            console.log("introspect-feed.complete!", response);
          },
        });
      }, 2e3);
    },
    failure: function (response) {
      console.log("downloadinventoryfileasync.failure!", response);
    },
    complete: async function (response) {
      console.log("downloadinventoryfileasync.complete!", response);
    },
  });
}
function createDeleteProductPageItems(n) {
  function t() {
    $(".sfDeleteProduct").click(function () {
      var asinList = [];
      var skuList = [];
      var reasonList = [];

      n
        ? $("#tableBody .item-row").each(function (n, i) {
            if ($(i).find("kat-checkbox").attr("checked") != undefined) {
              var r = $(i).find("div.asin"),
                u = $(r)
                  .text()
                  .replace(/ASIN\s*: /, "")
                  .trim();
              asinList.push(u);
            }
          })
        : $("div[data-column='asin']")
            .find("span")
            .each(function (n, i) {
              var r = $(i).text().trim();
              asinList.push(r);
            });

      n
        ? $("#tableBody .item-row").each(function (n, i) {
            if ($(i).find("kat-checkbox").attr("checked") != undefined) {
              var r = $(i).find("div.sku"),
                u = $(r)
                  .text()
                  .replace(/SKU\s*: /, "")
                  .trim();
              skuList.push(u);
            }
          })
        : $("div[data-column='sku']")
            .find("a")
            .each(function (n, i) {
              var r = $(i).text().trim();
              skuList.push(r);
            });

      n
        ? $("#tableBody .item-row").each(function (n, i) {
            if ($(i).find("kat-checkbox").attr("checked") != undefined) {
              var r = $(i).find("div.reason-code"),
                u = $(r).contents().text().trim();
              reasonList.push(u);
            }
          })
        : "";

      var pList = [];

      for (let i = 0; i < asinList.length; ++i) {
        var obj = {};
        obj["Asin"] = asinList[i];
        obj["Sku"] = skuList[i];
        if (
          reasonList != null &&
          reasonList.length > i &&
          reasonList[i] != null
        ) {
          obj["Reason"] = reasonList[i];
        } else {
          obj["Reason"] = "Inventory page";
        }
        pList.push(obj);
      }

      var mp = getMarketplaceByPage().AmazonMarketplaceId;

      var url =
        this.id == "sfDeleteProducts"
          ? user.apiSubdomain + "api/inventoryItem/removeInventoryItems"
          : user.apiSubdomain +
            "api/inventoryItem/removeAndBlockInventoryItems";

      $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json;charset=utf-8",
        headers: { Authorization: "Bearer " + user.token },
        data: JSON.stringify({
          customerId: user.customerId,
          marketPlaceCode: mp,
          productList: pList,
        }),
        success: function () {},
        failure: function (response) {
          console.log("Error (failure)! ", response);
        },
        complete: function (data) {
          if (data.status == 200) {
            $(".sf-alert-content").html(language["1000008"][activeLanguage]);
          } else {
            $(".sf-alert-content").html(
              "<i class='fa fa-exclamation-circle' style='margin-right: 5px;' /> " +
                language["1000009"][activeLanguage]
            );
          }
        },
      });

      $(".sf-alert-container-info").remove();
    });
  }
  var i = `
        <div id="sfMessage" class="sf-alert a-section">
        <div class="sf-alert-content" > ${language["1000001"][activeLanguage]}<br> </div>
        <button id="sfDeleteProducts" class="sfDeleteProduct yellow-button" style="width: fit-content;margin-top:10px;">  ${language["1000002"][activeLanguage]}</button><br>
        <button id="sfDeleteAndBlockProducts" class="sfDeleteProduct yellow-button" style="width: fit-content;margin-top:10px;"> ${language["1000003"][activeLanguage]} </button>
        </div>`,
    r;
  if (n) {
    function n() {
      $(document).delegate(
        "div.bulk-container div.select-options div.option, #bulk-delete-listing button, .fyp-bulk-selection-bar-button button, .fyp-bulk-selection-bar-button",
        "click",
        function () {
          setTimeout(function () {
            var r = $(
              "kat-modal-content .kat-row, #delete-listing-modal .kat-row"
            ).last();
            r.find(".sf-alert").remove();
            r.append(i);
            n();
            t();
          }, 500);
        }
      );
    }
    n();
  } else
    $("#interStitialPageMessage")
      .text()
      .toLowerCase()
      .indexOf("delete product and listing") > -1 &&
      ((r = $("#interstitialPageWarningAlert .a-alert-content")),
      r.append(i),
      t());
}

function createOrderDetailPageItems() {
  var orderIdFromUrl = location.href.replace(
    location.origin + "/orders-v3/order/",
    ""
  );

  var btn = `
            <button id='sfCopyAddress' class="yellow-button">
            ${language["1000004"][activeLanguage]}</button>
      `;

  setTimeout(function () {
    if ($("span[data-test-id=shipping-section-label]").length) {
      $("span[data-test-id=shipping-section-label]").parent().append(btn);

      $("#sfCopyAddress").click(function () {
        $("#sfCopyAddress").text(language["1000007"][activeLanguage]);
        $("#sfCopyAddress").attr("disabled", "disabled");

        $.ajax({
          url: location.origin + "/orders-api/order/" + orderIdFromUrl,
          type: "GET",
          success: function (response) {
            var blobs = [];
            blobs.push(response.order.blob);

            $.ajax({
              url: location.origin + "/orders-st/resolve",
              type: "POST",
              contentType: "application/json;charset=utf-8",
              data: JSON.stringify({ blobs }),
              success: function (response) {
                var text = JSON.stringify(response);

                var orderId = Object.keys(response)[0];

                var address = text.split('"address":').pop().split("},")[0];
                address = address + "}";

                var addressJson = JSON.parse(address);

                $.ajax({
                  url:
                    user.apiSubdomain +
                    "api/sellerOrder/setCopiedSellerOrderAddress?sellerOrderAmazonId=" +
                    orderId,
                  type: "POST",
                  contentType: "application/json;charset=utf-8",
                  data: JSON.stringify({
                    name: addressJson.name,
                    addressLine1: addressJson.line1,
                    addressLine2: addressJson.line2,
                    addressLine3: addressJson.line3,
                    city: addressJson.city,
                    county: addressJson.county,
                    district: addressJson.district, // TODO : KONTROL
                    stateOrRegion: addressJson.stateOrRegion,
                    municipality: addressJson.municipality,
                    postalCode: addressJson.postalCode,
                    countryCode: addressJson.countryCode,
                    phone: addressJson.phoneNumber,
                    email: null,
                    addressType: null,
                  }),
                  headers: { Authorization: "Bearer " + user.token },
                  success: function () {
                    $("#sfCopyAddress").text(
                      language["1000005"][activeLanguage]
                    );
                    $("#sfCopyAddress").css({ background: "green" });

                    setTimeout(function () {
                      $("#sfCopyAddress").text(
                        language["1000004"][activeLanguage]
                      );
                      $("#sfCopyAddress").removeAttr("disabled");
                      $("#sfCopyAddress").css({ background: "" });
                    }, 2e3);
                  },
                  failure: function (response) {
                    console.log("Address can not be copied", response);
                  },
                  complete: function (data) {
                    console.log("Address copy complete!", data);
                  },
                });
              },
              failure: function (response) {
                console.log(
                  "Order addresses can not be taken (orders-st)",
                  response
                );
              },
              complete: function (response) {
                console.log("orders-st/resolve.complete!", response);
              },
            });
          },
          failure: function (response) {
            console.log(
              "Order addresses can not be taken (orders-api)",
              response
            );
          },
          complete: function (response) {
            console.log("orders-api/order.complete!", response);
          },
        });
      });
    } else {
      console.log("No address found");
    }
  }, 2e3);
}

function createAllAddressesPageItems() {
  var btn = `
        <button id='sfRemoveAddresses' class="red-button" style="position:absolute;right:0;top:40px;">
        ${language["1000006"][activeLanguage]}</button>
    `;

  $.ajax({
    url:
      user.apiSubdomain +
      "api/storedBuyerAddress/getStoredBuyerAddressList?customerId=" +
      user.customerId,
    type: "GET",
    headers: { Authorization: "Bearer " + user.token },
    success: function (response) {
      $("form[action='/a/addresses/delete']")
        .find("input[name='addressID']")
        .each(function (t, i) {
          var hidden = $(i),
            addressid = hidden.attr("value");

          var bColorRemovable,
            sColorRemovable,
            bColorUnremovable,
            sColorUnremovable;
          bColorUnremovable = "#ec7063"; //NOTPURCHASED
          bColorRemovable = "#1976d2"; //PURCHASED

          sColorUnremovable = "#ffcdd2"; //NOTPURCHASED
          sColorRemovable = "#b3e5fc"; //PURCHASED

          var sfDiv =
            "<div id='sf-div-" +
            addressid +
            "'  class='sfAddressStatus' style='border-radius: 5px; height: 24px; padding: 1px; width:250px; background-color:" +
            (response.includes(addressid)
              ? bColorUnremovable
              : bColorRemovable) +
            ";'> " +
            "<a id='sf-a-" +
            addressid +
            "' href='#' data-action='" +
            (response.includes(addressid) ? "unremovable" : "removable") +
            "' data-addressid='" +
            addressid +
            "' >" +
            "<span class='sf-badge-l sf-badge-warning'><img src='" +
            chrome.runtime.getURL("img/sf_extension.svg") +
            "' style='width: 34px; height: 34px; margin-top:-6px; margin-left:-6px' alt='' /></span><span id='sf-s-" +
            addressid +
            "'  style='color: " +
            (response.includes(addressid)
              ? sColorUnremovable
              : sColorRemovable) +
            " !important; font-weight:bold '>" +
            (response.includes(addressid)
              ? language["1000011"][activeLanguage]
              : language["1000010"][activeLanguage]) +
            "</span></a></div>";

          $(i).closest(".edit-address-desktop-link").prepend(sfDiv);

          $("#sf-a-" + addressid).click(function () {
            var addressid = $(this).attr("data-addressid");

            if ($(this).attr("data-action") == "unremovable") {
              $.ajax({
                url:
                  user.apiSubdomain +
                  "api/storedBuyerAddress/removeStoredBuyerAddress?addressId=" +
                  addressid +
                  "&customerId=" +
                  user.customerId,
                type: "POST",
                headers: { Authorization: "Bearer " + user.token },
                success: function (response) {
                  console.log("response", response);
                },
                failure: function (response) {
                  console.log("Address can not be removed", response);
                },
                complete: function (response) {
                  if (response.status == 200) {
                    $("#sf-a-" + addressid).attr("data-action", "removable");
                    $("#sf-s-" + addressid).text(
                      language["1000010"][activeLanguage]
                    );
                    $("#sf-div-" + addressid).css(
                      "background-color",
                      bColorRemovable
                    );
                    $("#sf-s-" + addressid).css("color", sColorRemovable);
                  }
                },
              });
            } else {
              $.ajax({
                url:
                  user.apiSubdomain +
                  "api/storedBuyerAddress/addStoredBuyerAddress?addressId=" +
                  addressid +
                  "&customerId=" +
                  user.customerId,
                type: "POST",
                headers: { Authorization: "Bearer " + user.token },
                success: function (response) {
                  console.log("response", response);
                },
                failure: function (response) {
                  console.log("Address can not be added", response);
                },
                complete: function (response) {
                  if (response.status == 200) {
                    $("#sf-a-" + addressid).attr("data-action", "unremovable");
                    $("#sf-s-" + addressid).text(
                      language["1000011"][activeLanguage]
                    );
                    $("#sf-div-" + addressid).css(
                      "background-color",
                      bColorUnremovable
                    );
                    $("#sf-s-" + addressid).css("color", sColorUnremovable);
                  }
                },
              });
            }

            return false;
          });
        });
    },
    failure: function (response) {
      console.log("Order ID can not be taken", response);
    },
  });

  $("h1").parent().prepend(btn);
  $("#sfRemoveAddresses").click(function () {
    $("#sfRemoveAddresses").text(language["1000007"][activeLanguage]);
    $("#sfRemoveAddresses").attr("disabled", "disabled");

    $.ajax({
      url:
        user.apiSubdomain +
        "api/storedBuyerAddress/getStoredBuyerAddressList?customerId=" +
        user.customerId,
      type: "GET",
      headers: { Authorization: "Bearer " + user.token },
      success: function (r) {
        var i = $("input[name='csrfToken']:first()").val(),
          n = $("form[action='/a/addresses/delete']").find(
            "input[name='addressID']"
          ),
          t = 0;

        n.each(function (u, f) {
          setTimeout(async function () {
            var s, e, o, u;
            t++;
            s = $(f);
            e = s.attr("value");
            r.indexOf(e) == -1 &&
              ((o = $(".edit-address-desktop-link")
                .find("a[href*='addressID=" + e + "']")
                .parents("div.address-column")),
              (u = []),
              u.push("addressID=" + e),
              u.push("isStoreAddress=false"),
              u.push("csrfToken=" + i),
              $.ajax({
                type: "POST",
                url: "/a/addresses/delete",
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                data: u.join("&"),
                dataType: "html",
                success: function () {
                  console.log(e + " is deleted");
                },
              }),
              o.hide());
            await delay(1000);
            n.length == t && location.reload();
          }, u * 250);

          $("#sfRemoveAddresses").text(language["1000006"][activeLanguage]);
          $("#sfRemoveAddresses").removeAttr("disabled");
        });
      },
    });
  });
}

function createAddNewAddressPageItems() {
  var style = "";
  if (location.href.includes("/addresses/add")) {
    style = "position:absolute;right:0;top:0;";
  } else {
    style = "position:relative;right:0;top:0;";
  }

  var btn = `
            <button id='sfPasteAddress' class="blue-button" style="${style}">
            ${language["1000013"][activeLanguage]}</button>
      `;

  setTimeout(function () {
    if (
      $("input[id=address-ui-widgets-reload-url]").length ||
      $("div[id=addres-new]").length
    ) {
      $("input[id=address-ui-widgets-reload-url], div[id=addres-new]")
        .parent()
        .prepend(btn);

      $("#sfPasteAddress").click(function () {
        $("#sfPasteAddress").text(language["1000007"][activeLanguage]);
        $("#sfPasteAddress").attr("disabled", "disabled");

        $.ajax({
          url:
            user.apiSubdomain +
            "api/sellerOrder/getCopiedSellerOrderAddress?customerId=" +
            user.customerId,
          type: "GET",
          headers: { Authorization: "Bearer " + user.token },
          success: function (response) {
            $(
              "select#address-ui-widgets-countryCode option, select#address-ui-widgets-countryCode-dropdown-nativeId option, #enterAddressCountryCode option"
            ).each(function () {
              $(this).val() === response.countryCode &&
                $(
                  "select#address-ui-widgets-countryCode, select#address-ui-widgets-countryCode-dropdown-nativeId, #address-ui-widgets-countryCode-dropdown-nativeId, #enterAddressCountryCode"
                ).val($(this).val());
            });
            simulateEvents(
              $(
                "select#address-ui-widgets-countryCode, select#address-ui-widgets-countryCode-dropdown-nativeId, #enterAddressCountryCode"
              )[0],
              "change",
              1
            );

            setTimeout(function () {
              $("#address-ui-widgets-enterAddressFullName").val(response.name);
              $("#address-ui-widgets-enterAddressPhoneNumber").val(
                response.phone
              );
              $(
                "#address-ui-widgets-enterAddressLine1, #enterAddressAddressLine1, #address-ui-widgets-streetName"
              ).val(response.addressLine1);
              $(
                "#address-ui-widgets-enterAddressLine2, #address-ui-widgets-enter-building-name-or-number, #enterAddressAddressLine2"
              ).val(response.addressLine2);
              $(
                "#address-ui-widgets-enterAddressLine3, #enterAddressAddressLine3"
              ).val(response.addressLine3);
              $("#address-ui-widgets-enterAddressCity, #enterAddressCity").val(
                response.city ? response.city : ""
              );
              $(
                "#address-ui-widgets-enterAddressStateOrRegion, #enterAddressStateOrRegion"
              ).val(response.stateOrRegion);
              var dorc =
                response.district != null || response.district != ""
                  ? response.district
                  : response.county;
              $(
                "#address-ui-widgets-enterAddressDistrictOrCounty, #enterAddressDistrictOrCounty"
              ).val(dorc);

              if (location.hostname == "www.amazon.co.jp") {
                $(
                  "#address-ui-widgets-enterAddressPostalCodeOne, #enterAddressPostalCodeOne"
                ).val(response.postalCode.split("-")[0]);
                $(
                  "#address-ui-widgets-enterAddressPostalCodeTwo, #enterAddressPostalCodeTwo"
                ).val(response.postalCode.split("-")[1]);
              } else {
                $(
                  "#address-ui-widgets-enterAddressPostalCode, #enterAddressPostalCode"
                ).val(response.postalCode);
              }

              $(
                "select#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId option"
              ).each(function () {
                $(this).val().toUpperCase() ===
                  response.stateOrRegion.toUpperCase() &&
                  $(
                    "select#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId"
                  ).val($(this).val());
              });

              simulateEvents(
                $(
                  "select#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId"
                )[0],
                "change",
                0
              );

              $("#sfPasteAddress").text(language["1000013"][activeLanguage]);
              $("#sfPasteAddress").removeAttr("disabled");
            }, 3e3);
          },
          failure: function (response) {
            console.log("Address can not be taken", response);
          },
          complete: function (response) {
            console.log("complete!", response);
          },
        });
      });
    } else {
      console.log("No tag found");
    }
  }, 2e3);
}

class SFUserInformation {
  constructor(token, checkDate, name, email) {
    this.token = token;
    this.checkDate = checkDate;
    this.name = name;
    this.email = email;
  }
}
// class SFUserInformation {
//   constructor(
//     customerId,
//     token,
//     userType,
//     checkDate,
//     platform,
//     apiSubdomain,
//     name,
//     email
//   ) {
//     this.customerId = customerId;
//     this.token = token;
//     this.userType = userType;
//     this.checkDate = checkDate;
//     this.platform = platform;
//     this.apiSubdomain = apiSubdomain;
//     this.name = name;
//     this.email = email;
//   }
// }
// class SellerFullUserInformation {
//   constructor(token, checkDate, name, email) {
//     this.token = token;
//     this.checkDate = checkDate;
//     this.name = name;
//     this.email = email;
//   }
// }
var user = new SFUserInformation();
// var SellerFull_User = new SellerFullUserInformation();

function signOut() {
  chrome.storage.sync.set(
    {
      token: "",
      checkDate: "",
    },
    function () {
      user = new SFUserInformation();
      console.log("SF logout success!");
    }
  );
}

function signIn(token, name, email) {
  chrome.storage.sync.set(
    {
      token: token,
      checkDate: Date.now(),
      name: name,
      email: email,
    },
    function () {
      user = new SFUserInformation(token, Date.now(), name, email);
      console.log(user);
    }
  );
}

var previousUrl = "";
var timerUrlCheck = setTimeout(checkUrlChange, 2000);

function checkUrlChange() {
  if (
    location.href.includes("sellerfull.com") &&
    previousUrl != location.href
  ) {
    previousUrl = location.href;
    checkLogin();
  }

  timerUrlCheck = setTimeout(checkUrlChange, 2000); // repeat checkUrlChange
}

function checkLogin() {
  const accessToken = sessionStorage.getItem("accessToken");
  var name = "";
  var email = "";
  if (location.href.includes("sellerfull.com")) {
    if (accessToken) {
      $.ajax({
        url: `${baseUrl}${endPoints.User.me}`,
        type: "GET",
        headers: { Authorization: "Bearer " + accessToken },
        success: function (response) {
          console.log("Başarılı istek: ", response);
          name = `${response.name} ${response.surname}`;
          email = response.email;
          if (accessToken && name && email) {
            signIn(accessToken, name, email);
          }
        },
        error: function (xhr, status, error) {
          console.error("İstek hatası: ", xhr, status, error);
        },
      });
    }
  }

  if (accessToken > 0) {
    return;
  }

  checkStoredLoginInformation();
}

function checkStoredLoginInformation() {
  chrome.storage.sync.get(
    ["token", "checkDate", "name", "email"],
    function (items) {
      if (items.token != undefined) {
        user.token = items.token;

        if (items.checkDate != undefined || items.checkDate != "") {
          user.checkDate = items.checkDate;
        }

        if (items.name != undefined || items.name != "") {
          user.name = items.name;
        }
        if (items.email != undefined || items.email != "") {
          user.email = items.email;
        }
      } else {
        setTimeout(() => {
          console.log("No stored login information");
          checkLogin();
        }, 2000);
      }
    }
  );
}

function checkIfNotFullAddressExists() {
  $.ajax({
    url: `${baseUrl}${endPoints.Order.addressNotCompleted}`,
    type: "GET",
    headers: { Authorization: "Bearer " + user.token },
    success: function (response) {
      if (response.length == 0) {
        setTimeout(() => {
          $("#sfMessage").text(language["1000091"][activeLanguage]);
          $("#sfCheckAddresses").prop("disabled", false);
        }, 2000);
        return;
      } else {
        for (let index = 0; index < response.length; index++) {
          var orderId = response[index].amazonOrderId;
          var countryCode = response[index].countryCode;

          chrome.runtime.sendMessage({
            type: "checkEmptyOrderAdress",
            currentHostname: location.origin,
            orderId: orderId,
            countryCode: countryCode,
            token: user.token,
            apiSubdomain: baseUrl,
            isLastOne: index == response.length - 1,
          });
        }
      }
    },
    failure: function (response) {
      console.log("Order ID can not be taken", response);
    },
  });
}

function createOrdersPageItems() {
  var panelLink = "https://panel.sellerflash.com";
  if (user.platform == "test") panelLink = "https://paneltest.sellerflash.com";
  else if (user.platform == "dev")
    panelLink = "https://paneldev.sellerflash.com";

  setInterval(function () {
    var n = [];
    $("#orders-table tbody")
      .find("tr:not(.sf-queued)")
      .each(function (t, i) {
        var u = $(i),
          orderId;
        u.addClass("sf-queued");
        orderId = u
          .find(
            ".cell-body a[href*='/hz/orders/details'], .cell-body a[href*='/orders-v3/order']"
          )
          .text()
          .trim();
        orderId != "" &&
          orderId != null &&
          orderId != undefined &&
          n.push(orderId);
      });

    n.length > 0 && getOrderStatusList(n);
  }, 3e3);
}

function getOrderStatusList(n) {
  const data = {
    sellerAmazonOrderIds: n,
  };
  $.ajax({
    type: "POST",
    url: `${baseUrl}${endPoints.Order.byAmazonOrderIds}`,
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    data: JSON.stringify(data),
    headers: { Authorization: "Bearer " + user.token },
    success: function (response) {
      if (response == undefined || response == "") {
        console.log("Sipariş bilgisi alınamadı");
        return;
      }

      response = JSON.parse(response);
      $.each(response, function (n, t) {
        var r = $("#orders-table tbody")
            .find(
              "a[href*='orderId=" +
                t.sellerAmazonOrderId +
                "'], a[href*='/orders-v3/order/" +
                t.sellerAmazonOrderId +
                "']"
            )
            .parents("div.cell-body"),
          i = "";
        t.buyerStatus == "Delivered" &&
          (i = ": " + formatTimestamp(t.deliveryDate));

        var statusColor = "#fff";
        var bgColor = "#d4d4d4";
        if (t.buyerStatus == "Delivered") {
          bgColor = "#145a32";
          statusColor = "#7dcea0";
        }
        if (t.buyerStatus == "Purchased") {
          bgColor = "#1976d2";
          statusColor = "#b3e5fc";
        }
        if (t.buyerStatus == "Shipped") {
          bgColor = "#27AE60";
          statusColor = "#a9dfbf";
        }
        if (t.buyerStatus == "NotPurchased") {
          bgColor = "#ec7063";
          statusColor = "#ffcdd2";
        }
        if (t.buyerStatus == "GoingToWarehouse") {
          bgColor = "#1C39CE";
        }
        if (t.buyerStatus == "DeliveredToWarehouse") {
          bgColor = "#16CDA3";
        }
        if (t.buyerStatus == "SentFromWarehouse") {
          bgColor = "#FFD900";
        }
        if (t.buyerStatus == "WaitingAtCustom") {
          bgColor = "#B2CCE4";
        }
        if (t.buyerStatus == "MayBeLost") {
          bgColor = "#AE431E";
        }
        if (t.buyerStatus == "Undeliverable") {
          bgColor = "#e64a19";
        }
        if (t.buyerStatus == "Cancelled") {
          bgColor = "#E01F20";
        }
        if (t.buyerStatus == "OutForDelivery") {
          bgColor = "#630000";
        }

        r.prepend(
          "<div class='sfOrderStatus' style='border-radius: 5px; height: 24px; padding: 1px; background-color:" +
            bgColor +
            ";'> " +
            "<a href='" +
            panelLink +
            "/sellerOrder/" +
            t.sellerAmazonOrderId +
            "' title=\"" +
            language["1000014"][activeLanguage] +
            "\" target='_blank'><span class='sf-badge-l sf-badge-warning'><img src='" +
            chrome.runtime.getURL("img/sf_extension.svg") +
            "' style='width: 34px; height: 34px; margin-top:-6px; margin-left:-6px' alt='' /></span><span style='color: " +
            statusColor +
            "; font-weight:bold '>" +
            t.buyerStatus.toUpperCase() +
            i +
            "</span></a></div>"
        );
      });
    },
    failure: function () {
      $("#sfOrderDetails").html(language["1000021"][activeLanguage]);
    },
    complete: function () {},
  });
}

function createMessagesPageItems() {
  var panelLink = "https://www.sellerfull.com";
  if (user.platform == "test") panelLink = "https://x-test.sellerfull.com";
  else if (user.platform == "dev") panelLink = "https://x-test.sellerfull.com";

  var n = "";
  setInterval(function () {
    var t = $(".thread-context kat-link, .case-context-content kat-link").attr(
      "label"
    );

    (t == null || t == "" || t == undefined) &&
      (t = $(
        "a[href*='/orders-v3/order/'], div.order-context-property-item kat-link a[href*='/order'], div.order-context-property-item kat-link a[href*='/orders']"
      )
        .first()
        .text());

    t != null && t != "" && t != undefined && (t = t.trim());

    if (t != null && t != "" && t != undefined && n != t) {
      n = t;

      var i = $(
        "kat-expander[label='Order'] div.kat-expander-content, .thread-context, .case-context-product"
      ).first();
      i.prepend(
        "<div class='order-context-property-item sfOrderInformation' style='border: 2px solid; border-radius: 5px; margin-top:5px; padding: 5px;'>" +
          "<div class='order-context-property-label'>" +
          language["1000022"][activeLanguage] +
          "</div><div><div class='sf-order-item'>" +
          "<span class='sf-badge-l sf-badge-warning'><img style='height: 30px;' src='" +
          chrome.runtime.getURL("img/sf_extension.svg") +
          "'>" +
          "<span id='sfOrderDetails'>" +
          language["1000044"][activeLanguage] +
          "</span>" +
          "</div></div>"
      );

      $.ajax({
        type: "GET",
        url: `${baseUrl}${endPoints.Order.byAmazonOrderId}?amazonOrderId=${t}`,
        headers: { Authorization: "Bearer " + user.token },
        success: function (response) {
          var i = $(
            "kat-expander[label='Order'] div.kat-expander-content, .thread-context, .case-context-product"
          ).first();
          i.find("div.sfOrderInformation").remove();

          if (response == undefined || response == "") {
            i.prepend(
              "<div class='order-context-property-item sfOrderInformation' style='border: 2px solid; border-radius: 5px; margin-top:5px; padding: 5px;'>" +
                "<div class='order-context-property-label'>" +
                language["1000022"][activeLanguage] +
                "</div><div><div class='sf-order-item'>" +
                "<span class='sf-badge-l sf-badge-warning'><img style='height: 30px;' src='" +
                chrome.runtime.getURL("img/sf_extension.svg") +
                "'>" +
                "<span id='sfOrderDetails'>" +
                language["1000023"][activeLanguage] +
                "</span>" +
                "</div></div>"
            );

            return;
          }

          var bColor, sColor;
          if (response.buyerOrder.buyerOrderStatus == "NOTPURCHASED") {
            bColor = "#ec7063";
          } else if (response.buyerOrder.buyerOrderStatus == "CANCELED") {
            bColor = "#424949";
          } else if (response.buyerOrder.buyerOrderStatus == "SHIPPED") {
            bColor = "#27ae60";
          } else if (response.buyerOrder.buyerOrderStatus == "PURCHASED") {
            bColor = "#1976d2";
          } else if (response.buyerOrder.buyerOrderStatus == "DELIVERED") {
            bColor = "#145a32";
          }

          if (response.sellerOrder.orderStatus == "NOTPURCHASED") {
            sColor = "#ec7063";
          } else if (response.sellerOrder.orderStatus == "CANCELED") {
            sColor = "#424949";
          } else if (response.sellerOrder.orderStatus == "SHIPPED") {
            sColor = "#27ae60";
          } else if (response.sellerOrder.orderStatus == "PURCHASED") {
            sColor = "#1976d2";
          } else if (response.sellerOrder.orderStatus == "DELIVERED") {
            sColor = "#145a32";
          }

          i.prepend(
            "<div class='order-context-property-item sfOrderInformation' style='border: 2px solid; border-radius: 5px; margin-top:5px; padding: 5px;'>" +
              "<div class='order-context-property-label'> <img style='height: 30px;' title='" +
              language["1000112"][activeLanguage] +
              "'  src='" +
              chrome.runtime.getURL("img/sf_extension.svg") +
              "'>" +
              language["1000022"][activeLanguage] +
              "</div><div><div class='sf-order-item'>" +
              "<div class='sf-badge' style='background-color: " +
              bColor +
              "; border-color: " +
              bColor +
              ";'> <span class='sf-badge-initial'>B</span> <span class='sf-badge-text'>" +
              response.buyerOrder.buyerOrderStatus +
              "</span></div>" +
              "<div class='sf-badge' style='background-color: " +
              sColor +
              "; border-color: " +
              sColor +
              ";'> <span class='sf-badge-initial'>S</span> <span class='sf-badge-text'>" +
              response.sellerOrder.orderStatus +
              "</span></div>" +
              "</div></div>" +
              "<hr />" +
              "<div><strong>" +
              language["1000114"][activeLanguage] +
              ": </strong> <br>" +
              "<a href='" +
              panelLink +
              "/sellerOrder/" +
              t +
              "' target='_blank'> " +
              t +
              "</a>" +
              ' <button id="sf-copySellerOrderId" style="width:25px; height:25px; font-weight:bold; background-color: transparent; border-width: 0px;"><i class="fa fa-copy"></i> </button>' +
              "</div>" +
              (response.buyerOrder.buyerOrderDetails[0].amazonOrderId != null
                ? "<div><strong>" +
                  language["1000094"][activeLanguage] +
                  ": </strong> <br>" +
                  "<a href='https://www.amazon.com/gp/your-account/order-details/?orderID=" +
                  response.buyerOrder.buyerOrderDetails[0].amazonOrderId +
                  "' target='_blank'>" +
                  response.buyerOrder.buyerOrderDetails[0].amazonOrderId +
                  "</a> " +
                  ' <button id="sf-copyBuyerOrderId" style="width:25px; height:25px; font-weight:bold;  background-color: transparent; border-width: 0px;"><i class="fa fa-copy"></i> </button>' +
                  "<br>" +
                  "</div>" +
                  "<hr />" +
                  "<div><strong>" +
                  language["1000025"][activeLanguage] +
                  ": </strong> " +
                  response.sellerOrder.sellerOrderDetails[0].profit +
                  "</div><div><strong>" +
                  language["1000026"][activeLanguage] +
                  ": </strong> " +
                  "<a href='https://www.amazon.com/progress-tracker/package/ref=TE_SIMP_typ?_encoding=UTF8&from=gp&itemId=&orderId=" +
                  response.buyerOrder.buyerOrderDetails[0].amazonOrderId +
                  "&packageIndex=0&shipmentId=1" +
                  "' target='_blank'> " +
                  response.buyerOrder.buyerOrderDetails[0].amazonOrderId +
                  "</a>" +
                  "</div></div>"
                : "</div>")
          );

          $("#sf-copyBuyerOrderId").click(function () {
            navigator.clipboard.writeText(
              response.buyerOrder.buyerOrderDetails[0].amazonOrderId
            );
            $("#sf-copyBuyerOrderId").html('<i class="fa fa-check"></i>');
            setTimeout(() => {
              $("#sf-copyBuyerOrderId").html('<i class="fa fa-copy"></i>');
            }, 1500);
          });

          $("#sf-copySellerOrderId").click(function () {
            navigator.clipboard.writeText(t);
            $("#sf-copySellerOrderId").html('<i class="fa fa-check"></i>');
            setTimeout(() => {
              $("#sf-copySellerOrderId").html('<i class="fa fa-copy"></i>');
            }, 1500);
          });
        },
        failure: function () {
          $("#sfOrderDetails").html(language["1000021"][activeLanguage]);
        },
        complete: function (data) {
          if (data.status != 200) {
            $("#sfOrderDetails").html(language["1000023"][activeLanguage]);
          }
        },
      });
    } else {
    }
  }, 2e3);
}

var stopSearch = false;
function createShippingTrackerItems() {
  var div = `
        <div id="sfContainer" class="sfContainer-bg3">
            <div class="sfContainer-top">
                <div class="flex ai-c jc-sb" style="height:42px; padding: 0 0 0 15px;">
                    <div class="flex ai-c">
                        <i class="fas fa-user"></i>
                        <span class="ml-15">${user.name}</span>
                    </div>
                    <div>
                        <button class="yellow-button" id="sf-hideTracker" style="width:30px; font-weight:bold;">${
                          language["1000070"][activeLanguage]
                        }</button>
                    </div>
                </div>
            </div>
            <div class="sfContent">
                <div style="text-align: center !important; margin-top:0px;">
                    <img src=${chrome.runtime.getURL(
                      "img/logo_uzun.png"
                    )} style="height: 40px; margin:20px;">
                </div>
                <div id="stores-for-buyer">
                </div>
                <div class="">
                    <button id='sfCheckCargoButton' class="yellow-button" style="width:100%;">
                        ${language["1000027"][activeLanguage]}
                    </button>
                </div>
                <div class="mt-10" style="margin-bottom:20px;">
                    <button id='sfCheckDeliveryButton' class="blue-button" style="width:100%;">
                        ${language["1000029"][activeLanguage]}
                    </button>
                </div>
                <div id="sfShippingDetails" class="flex jc-center"></div>
                <div id="sfShippingCheckProgress" class="flex jc-center"></div>
            </div>
        </div> `;

  var sfButton = `
    <button id="sfButton" style="z-index: 999999; position: fixed; width:80px; height: 80px; bottom: 10px; right: 10px; display: none;
    background: none; border: none; ">
        <img src=${chrome.runtime.getURL(
          "img/sf_extension.svg"
        )} style="width: 80px;">
    </button>`;
  $("body").prepend(sfButton);
  $("body").append(div);

  getMarketPlacesForBuyer();
  console.log("test --------------------------------------");

  $("#sfButton").click(function () {
    $("#sfContainer").show();
    $("#sfButton").hide();
  });

  $("#sf-hideTracker").click(function () {
    $("#sfContainer").hide();
    $("#sfButton").show();
  });

  $("#sfCheckCargoButton").click(function () {
    sfCheckCargoButtonClicked();
  });

  $("#sfCheckDeliveryButton").click(function () {
    sfCheckDeliveryButtonClicked();
  });
}

var flagShippingControlActive = false;
var flagDeliveryControlActive = false;

function sfCheckCargoButtonClicked() {
  $("#sfCheckCargoButton").prop("disabled", true);
  $("#sfCheckDeliveryButton").prop("disabled", true);
  $("#sfCheckCargoButton").css("cursor", "not-allowed");
  $("#sfCheckDeliveryButton").css("cursor", "not-allowed");

  $("#sfCheckCargoButton").html(language["1000007"][activeLanguage]);

  $("#sfShippingDetails").html(language["1000037"][activeLanguage]);
  $("#sfShippingDetails").css({
    background: "white",
    margin: "10px 0",
    padding: "10px",
    color: "cornflowerblue",
  });

  $("#sfShippingCheckProgress").html("");

  // = not shipped
  var selectedStoreId = $("#sfMarketPlace").val();
  console.log(selectedStoreId);
  $.ajax({
    type: "GET",
    url: `${baseUrl}${endPoints.Order.notShipped}?storeId=${selectedStoreId}`,
    headers: { Authorization: "Bearer " + user.token },
    success: async function (response) {
      $("#sfShippingDetails").html(language["1000031"][activeLanguage]);

      var siList = [];
      var totalCount = response.length;
      var checkCount = 1;
      let index = 0;
      for (index = 0; index < totalCount; index++) {
        if (stopSearch) {
          flagShippingControlActive = false;
          return;
        }

        var amazonOrderId = response[index].amazonOrderId;
        var lastPromise = response[index].lastPromiseMessage;
        var lastShortStatus = response[index].lastShortStatus;
        if (!lastShortStatus && response[index].status == 1) {
          lastShortStatus = "ORDER_PLACED";
        }

        await delay(100);

        $.ajax({
          type: "GET",
          url:
            location.origin +
            "/progress-tracker/package/ref=TE_SIMP_typ?_encoding=UTF8&from=gp&itemId=&packageIndex=0&shipmentId=1&orderId=" +
            amazonOrderId,
          async: !0,
          success: async function (response2) {
            var page = $("<div></div>");
            page.html(response2);

            if (
              $("input#signInSubmit", page).length ||
              $("input#continue", page).length
            ) {
              $("#sfShippingCheckProgress").html(
                language["1000125"][activeLanguage] +
                  "<br> <a style='color: white;' href='" +
                  location.origin +
                  "/progress-tracker/package/ref=TE_SIMP_typ?_encoding=UTF8&from=gp&itemId=&packageIndex=0&shipmentId=1&orderId=" +
                  amazonOrderId +
                  "'> " +
                  language["1000126"][activeLanguage] +
                  "</a>"
              );
              $("#sfShippingCheckProgress").css({
                background: "red",
                color: "white",
                margin: "10px 0",
                padding: "10px",
                display: "block",
              });
              $("#sfShippingDetails").html("");

              stopSearch = true;
            } else if (
              response2.includes(
                "Sorry, we are unable to get the tracking information right now"
              )
            ) {
              $("#sfShippingCheckProgress").html(
                language["1000032"][activeLanguage] +
                  Math.min(index + 1, totalCount) +
                  " / " +
                  totalCount
              );
              $("#sfShippingCheckProgress").css({
                background: "white",
                color: "black",
                margin: "10px 0",
                padding: "10px",
              });
            } else {
              var si = await getShippingInformation(response2);
              siList.push(si);

              $("#sfShippingCheckProgress").html(
                language["1000032"][activeLanguage] +
                  Math.min(index + 1, totalCount) +
                  " / " +
                  totalCount
              );
            }
          },
          failure: function (response2) {
            console.log("Error! ", response2);
          },
          complete: function () {
            checkCount = checkCount + 1;
          },
        });
      }
      var totalWait = 10;

      while (checkCount <= response.length) {
        await delay(1000);
        totalWait = totalWait - 1;
        if (totalWait <= 0) {
          break;
        }
      }

      var updateSiList = [];

      for (index = 0; index < response.length; index++) {
        var lastPromise = response[index].lastPromiseMessage;
        var lastShortStatus = response[index].lastShortStatus;
        var amazonOrderId = response[index].amazonOrderId;

        var si = "";
        for (let index2 = 0; index2 < siList.length; index2++) {
          if (siList[index2].AmazonOrderId == response[index].amazonOrderId) {
            si = siList[index2];
          }
        }

        if (si != "") {
          if (
            isShippingStatusUpdatable(
              1,
              lastShortStatus,
              lastPromise,
              si.ShortStatus,
              si.PromiseMessage
            )
          ) {
            if (!si.DeliveryDate) delete si.DeliveryDate;

            if (!si.ExpectedDeliveryDateEnd) delete si.ExpectedDeliveryDateEnd;

            if (!si.ExpectedDeliveryDateStart)
              delete si.ExpectedDeliveryDateStart;

            if (!delete si.ShipDate) delete si.ShipDate;

            updateSiList.push(si);
          }
        }
      }
      // update as shipped
      if (updateSiList && updateSiList.length > 0) {
        $.ajax({
          type: "PUT",
          url: `${baseUrl}${endPoints.Order.updateAsShipped}`,
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify(updateSiList),

          headers: { Authorization: "Bearer " + user.token },
          success: function () {
            console.log("Shipping information Updated!");
          },
          failure: function (response) {
            console.log("Shipping information can not be updated", response);
          },
          complete: function (data) {
            console.log("DONE!", data);
          },
        });
      }

      $("#sfShippingCheckProgress").html(
        $("#sfShippingCheckProgress").html() +
          "<br>" +
          language["1000147"][activeLanguage] +
          updateSiList.length
      );

      $("#sfCheckCargoButton").prop("disabled", false);
      $("#sfCheckDeliveryButton").prop("disabled", false);
      $("#sfCheckCargoButton").css("cursor", "pointer");
      $("#sfCheckDeliveryButton").css("cursor", "pointer");
      $("#sfCheckCargoButton").html(language["1000027"][activeLanguage]);

      $("#sfShippingDetails").html(language["1000033"][activeLanguage]);
      $("#sfShippingDetails").css({
        background: "white",
        margin: "10px 0",
        padding: "10px",
        color: "green",
      });

      flagShippingControlActive = false;
    },
    failure: function (response) {
      console.log("Cargo list can not be taken", response);
    },
  });
}

function sfCheckDeliveryButtonClicked() {
  $("#sfCheckCargoButton").prop("disabled", true);
  $("#sfCheckDeliveryButton").prop("disabled", true);
  $("#sfCheckCargoButton").css("cursor", "not-allowed");
  $("#sfCheckDeliveryButton").css("cursor", "not-allowed");

  $("#sfCheckDeliveryButton").html(language["1000007"][activeLanguage]);

  $("#sfShippingDetails").html(language["1000034"][activeLanguage]);
  $("#sfShippingDetails").css({
    background: "white",
    margin: "10px 0",
    padding: "10px",
    color: "cornflowerblue",
  });

  $("#sfShippingCheckProgress").html("");
  var selectedStoreId = $("#sfMarketPlace").val();

  $.ajax({
    type: "GET",
    url: `${baseUrl}${endPoints.Order.notDelivered}?storeId=${selectedStoreId}`,
    headers: { Authorization: "Bearer " + user.token },
    success: async function (response) {
      $("#sfShippingDetails").html(language["1000035"][activeLanguage]);

      var siList = [];
      var checkCount = 1;
      let index = 0;
      var totalCount = response.length;
      for (index = 0; index < response.length; index++) {
        if (stopSearch) {
          flagDeliveryControlActive = false;
          return;
        }

        var amazonOrderId = response[index].amazonOrderId;

        await delay(100);

        $.ajax({
          type: "GET",
          url:
            location.origin +
            "/progress-tracker/package/ref=TE_SIMP_typ?_encoding=UTF8&from=gp&itemId=&packageIndex=0&shipmentId=1&orderId=" +
            amazonOrderId,
          async: !0,
          success: async function (response2) {
            var page = $("<div></div>");
            page.html(response2);

            if (
              $("input#signInSubmit", page).length ||
              $("input#continue", page).length
            ) {
              $("#sfShippingCheckProgress").html(
                language["1000125"][activeLanguage] +
                  "<br> <a style='color: white;' href='" +
                  location.origin +
                  "/progress-tracker/package/ref=TE_SIMP_typ?_encoding=UTF8&from=gp&itemId=&packageIndex=0&shipmentId=1&orderId=" +
                  amazonOrderId +
                  "'> " +
                  language["1000126"][activeLanguage] +
                  "</a>"
              );
              $("#sfShippingCheckProgress").css({
                background: "red",
                color: "white",
                margin: "10px 0",
                padding: "10px",
                display: "block",
              });
              $("#sfShippingDetails").html("");

              stopSearch = true;
            } else if (
              response2.includes(
                "Sorry, we are unable to get the tracking information right now"
              )
            ) {
              $("#sfShippingCheckProgress").html(
                language["1000032"][activeLanguage] +
                  Math.min(index + 1, totalCount) +
                  " / " +
                  totalCount
              );
            } else {
              var si = await getShippingInformation(response2);
              siList.push(si);

              $("#sfShippingCheckProgress").html(
                language["1000032"][activeLanguage] +
                  Math.min(index + 1, totalCount) +
                  " / " +
                  totalCount
              );
            }
          },
          failure: function (response2) {
            console.log("Error!", response2);
          },
          complete: function () {
            checkCount = checkCount + 1;
          },
        });
      }

      var totalWait = 10;

      while (checkCount <= response.length) {
        await delay(1000);
        totalWait = totalWait - 1;
        if (totalWait <= 0) {
          break;
        }
      }

      var updateSiList = [];

      for (index = 0; index < response.length; index++) {
        var lastPromise = response[index].lastPromiseMessage;
        var lastShortStatus = response[index].lastShortStatus;
        var amazonOrderId = response[index].amazonOrderId;

        var si = "";
        for (let index2 = 0; index2 < siList.length; index2++) {
          if (siList[index2].AmazonOrderId == response[index].amazonOrderId) {
            si = siList[index2];
          }
        }

        if (si != "") {
          if (
            isShippingStatusUpdatable(
              2,
              lastShortStatus,
              lastPromise,
              si.ShortStatus,
              si.PromiseMessage
            )
          ) {
            if (!si.DeliveryDate) delete si.DeliveryDate;

            if (!si.ExpectedDeliveryDateEnd) delete si.ExpectedDeliveryDateEnd;

            if (!si.ExpectedDeliveryDateStart)
              delete si.ExpectedDeliveryDateStart;

            if (!delete si.ShipDate) delete si.ShipDate;

            updateSiList.push(si);
          }
        }
      }

      // update as delivered
      if (updateSiList && updateSiList.length > 0) {
        $.ajax({
          type: "PUT",
          url: `${baseUrl}${endPoints.Order.updateAsDelivered}`,
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify(updateSiList),

          headers: { Authorization: "Bearer " + user.token },
          success: function () {
            console.log("Shipping information Updated!");
          },
          failure: function (response) {
            console.log("Shipping information can not be updated", response);
          },
          complete: function (data) {
            console.log("DONE!", data);
          },
        });
      }

      $("#sfShippingCheckProgress").html(
        $("#sfShippingCheckProgress").html() +
          "<br>" +
          language["1000148"][activeLanguage] +
          updateSiList.length
      );

      $("#sfCheckCargoButton").prop("disabled", false);
      $("#sfCheckDeliveryButton").prop("disabled", false);
      $("#sfCheckCargoButton").css("cursor", "pointer");
      $("#sfCheckDeliveryButton").css("cursor", "pointer");
      $("#sfCheckDeliveryButton").html(language["1000029"][activeLanguage]);

      $("#sfShippingDetails").html(language["1000036"][activeLanguage]);
      $("#sfShippingDetails").css({
        background: "white",
        margin: "10px 0",
        padding: "10px",
        color: "green",
      });

      flagDeliveryControlActive = false;
    },
    failure: function (response) {
      console.log("Cargo list can not be taken", response);
    },
  });
}

function createPerformanceDashboardPageItems() {
  var div = `
        <div id="sfContainer" class="sfContainer-bg3">
            <div class="sfContainer-top">
                <div class="flex ai-c jc-sb" style="height:42px; padding: 0 0 0 15px;">
                    <div class="flex ai-c">
                        <i class="fas fa-user"></i>
                        <span class="ml-15">${user.name}</span>
                    </div>
                    <div>
                        <button class="yellow-button" id="sf-hide" style="width:30px; font-weight:bold;">${language["1000070"][activeLanguage]}</button>
                    </div>
                </div>
            </div>
            <div class="sfContent">
                <div class="description">
                    ${language["1000110"][activeLanguage]}
                </div>
                <div class="mt-10">
                    <button id='sfTransferAlerts' class="yellow-button" style="width:100%;">
                        ${language["1000107"][activeLanguage]}
                    </button>
                </div>
                <div id="sfTransferResult" class="flex jc-center"></div>
            </div>
        </div> `;

  var sfButton = `
    <button id="sfButton" style="z-index: 999999; position: fixed; width:70px; height: 70px; bottom: 10px; right: 10px; display: none;
    background: none; border: none; ">
        <img src=${chrome.runtime.getURL(
          "img/sf_extension.svg"
        )} style="width: 90px;">
    </button>`;

  $("body").prepend(sfButton);
  $("body").append(div);

  $("#sfButton").click(function () {
    $("#sfContainer").show();
    $("#sfButton").hide();
  });

  $("#sf-hide").click(function () {
    $("#sfContainer").hide();
    $("#sfButton").show();
  });

  $("#sfTransferAlerts").click(function () {
    $("#sfTransferAlerts").prop("disabled", true);
    $("#sfTransferResult").html(language["1000007"][activeLanguage]);

    $("#sfTransferAlerts").html(language["1000108"][activeLanguage]);
    $("#sfTransferResult").css({
      background: "cornflowerblue",
      margin: "10px 0",
      padding: "10px",
      color: "white",
    });

    var sub = "https://inv.sellerflash.com/";
    if (user.platform == "test") sub = "https://invtest.sellerflash.com/";
    else if (user.platform == "dev") sub = "https://invdev.sellerflash.com/";

    var metricsInitialDate = getShortDateTime(-175);
    var metricsEndDate = getShortDateTime(0);

    $.ajax({
      type: "POST",
      url:
        location.origin +
        "/performance/api/product/policy/defects/pagination?metricNames=ProductSafety,ProductAuthenticity,ProductCondition,ListingPolicy,IntellectualProperty,RESTRICTED_PRODUCTS,PRODUCT_REVIEW_ABUSE,AUTOMATED_BRAND_PROTECTION,POSITIVE_CUSTOMER_EXPERIENCE&pageSize=1000&duration=180&offset=0&startDate=" +
        metricsInitialDate +
        "&endDate=" +
        metricsEndDate +
        "&nextPageToken=&statuses=Open&sortField=CREATION_DATE&sortByOrder=DESC",
      async: false,
      success: function (response) {
        response = response.replaceAll("$cc_metadata", "cc_metadata");

        response = JSON.parse(response);
        //account health data burada çekiliyor
        $.ajax({
          type: "POST",
          url: sub + "api/Inventory/AddAccountHealthData",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data: JSON.stringify(response),
          headers: { Authorization: "Bearer " + user.token },
          success: function () {
            $("#sfTransferAlerts").prop("disabled", false);
            $("#sfTransferAlerts").html(language["1000107"][activeLanguage]);

            $("#sfTransferResult").html(language["1000109"][activeLanguage]);
            $("#sfTransferResult").css({
              background: "green",
              margin: "10px 0",
              padding: "10px",
              color: "white",
            });
          },
          failure: function () {
            $("#sfTransferAlerts").prop("disabled", false);
            $("#sfTransferAlerts").html(language["1000107"][activeLanguage]);

            $("#sfTransferResult").html(language["1000111"][activeLanguage]);
            $("#sfTransferResult").css({
              background: "green",
              margin: "10px 0",
              padding: "10px",
              color: "white",
            });
          },
          complete: function (data) {
            if (data.status == 200) {
              $("#sfTransferAlerts").prop("disabled", false);
              $("#sfTransferAlerts").html(language["1000107"][activeLanguage]);

              $("#sfTransferResult").html(language["1000109"][activeLanguage]);
              $("#sfTransferResult").css({
                background: "green",
                margin: "10px 0",
                padding: "10px",
                color: "white",
              });
            } else {
              $("#sfTransferAlerts").prop("disabled", false);
              $("#sfTransferAlerts").html(language["1000107"][activeLanguage]);

              $("#sfTransferResult").html(language["1000111"][activeLanguage]);
              $("#sfTransferResult").css({
                background: "red",
                margin: "10px 0",
                padding: "10px",
                color: "white",
              });
            }
          },
        });
      },
      failure: function (response) {
        console.log("Error! ", response);
      },
    });
  });
}

function createFixProductPageItems() {
  var div = `
        <div id="sfContainer" class="sfContainer-bg3">
            <div class="sfContainer-top">
                <div class="flex ai-c jc-sb" style="height:42px; padding: 0 0 0 15px;">
                    <div class="flex ai-c">
                        <i class="fas fa-user"></i>
                        <span class="ml-15">${user.name}</span>
                    </div>
                    <div>
                        <button class="yellow-button" id="sf-hide" style="width:30px; font-weight:bold;">${language["1000070"][activeLanguage]}</button>
                    </div>
                </div>
            </div>
            <div class="sfContent">
                <div class="description">
                    <p>
                        ${language["1000120"][activeLanguage]}
                    </p>
                </div>
                <div class="mt-10">
                    <button id='sfTransferAlerts' class="yellow-button" style="width:100%;">
                        ${language["1000116"][activeLanguage]}
                    </button>
                </div>
                <div id="sfTransferResult" class="flex jc-center"></div>
            </div>
        </div> `;

  var sfButton = `
    <button id="sfButton" style="z-index: 999999; position: fixed; width:70px; height: 70px; bottom: 10px; right: 10px; display: none;
    background: none; border: none; ">
        <img src=${chrome.runtime.getURL(
          "img/sf_extension.svg"
        )} style="width: 90px;">
    </button>`;

  $("body").prepend(sfButton);
  $("body").append(div);

  $("#sfButton").click(function () {
    $("#sfContainer").show();
    $("#sfButton").hide();
  });

  $("#sf-hide").click(function () {
    $("#sfContainer").hide();
    $("#sfButton").show();
  });

  $("#sfTransferAlerts").click(function () {
    $("#sfTransferAlerts").prop("disabled", true);
    $("#sfTransferResult").html(language["1000007"][activeLanguage]);

    $("#sfTransferAlerts").html(language["1000117"][activeLanguage]);
    $("#sfTransferResult").css({
      background: "cornflowerblue",
      margin: "10px 0",
      padding: "10px",
      color: "white",
    });

    var sub = "https://inv.sellerflash.com/";
    if (user.platform == "test") sub = "https://invtest.sellerflash.com/";
    else if (user.platform == "dev") sub = "https://invdev.sellerflash.com/";

    var marketPlaceID = $("#partner-switcher").attr(
      "data-marketplace_selection"
    );

    var offset = 0;
    var pageSize = 50;
    var totalCount = 0;
    var isErrorOccured = false;

    while (true) {
      if (offset > totalCount || isErrorOccured) {
        break;
      }

      let progressText = `${language["1000164"][activeLanguage]} <br> ${language["1000165"][activeLanguage]} ${offset}/${totalCount}`;

      $("#sfProgressMessage").html(progressText);

      $.ajax({
        type: "GET",
        url:
          location.origin +
          `/fixyourproducts/completeSkus?status=ISSUE_INACTIVE&pageSize=${pageSize}&offset=${offset}&sortType=DATE&sortOrder=DESCENDING&searchTerm=null&searchType=null&filter=%5B%7B%22type%22%3A%22AGGREGATED_LISTING_STATUS%22%2C%22values%22%3A%5B%22INACTIVE_LOW_PRICE_WEAK_BLOCK%22%2C%22INACTIVE_HIGH_PRICE_WEAK_BLOCK%22%5D%7D%5D`,
        async: false,
        success: function (response) {
          response.MarketPlaceID = marketPlaceID;
          if (offset === 0) {
            totalCount = response.totalItems;
          }
          offset += pageSize;
          $.ajax({
            type: "POST",
            url: sub + "api/Inventory/AddPricingIssuesData",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(response),

            headers: { Authorization: "Bearer " + user.token },
            success: function () {
              $("#sfTransferResult").html(
                language["1000181"][activeLanguage] +
                  offset +
                  " / " +
                  totalCount
              );

              $("#sfTransferAlerts").prop("disabled", false);
              $("#sfTransferAlerts").html(language["1000116"][activeLanguage]);
            },
            failure: function () {
              $("#sfTransferAlerts").prop("disabled", false);
              $("#sfTransferAlerts").html(language["1000116"][activeLanguage]);

              $("#sfTransferResult").html(language["1000111"][activeLanguage]);
              $("#sfTransferResult").css({
                background: "green",
                margin: "10px 0",
                padding: "10px",
                color: "white",
              });
              isErrorOccured = true;
            },
            complete: function (data) {
              if (data.status == 200) {
                $("#sfTransferAlerts").prop("disabled", false);
                $("#sfTransferAlerts").html(
                  language["1000116"][activeLanguage]
                );

                $("#sfTransferResult").html(
                  language["1000118"][activeLanguage]
                );
                $("#sfTransferResult").css({
                  background: "green",
                  margin: "10px 0",
                  padding: "10px",
                  color: "white",
                });
              } else {
                $("#sfTransferAlerts").prop("disabled", false);
                $("#sfTransferAlerts").html(
                  language["1000116"][activeLanguage]
                );

                $("#sfTransferResult").html(
                  language["1000119"][activeLanguage]
                );
                $("#sfTransferResult").css({
                  background: "red",
                  margin: "10px 0",
                  padding: "10px",
                  color: "white",
                });
              }
            },
          });
        },
        failure: function () {
          isErrorOccured = true;
        },
      });
    }
  });
}

function isShippingStatusUpdatable(
  type,
  oldStatus,
  oldPromiseMessage,
  newStatus,
  newPromiseMessage
) {
  if (oldStatus == "IN_TRANSIT" && newStatus == "ORDER_PLACED") {
    return false;
  }
  if (
    oldPromiseMessage != newPromiseMessage &&
    (oldPromiseMessage == null ||
      !oldPromiseMessage.includes("Undeliverable")) &&
    newPromiseMessage.includes("Undeliverable")
  ) {
    return true;
  }

  if (type == 1) {
    // Shipping

    if (
      oldStatus == null ||
      oldStatus == "" ||
      oldStatus == "ORDER_PLACED" ||
      oldStatus == "SHIPPING_SOON"
    ) {
      if (newStatus == "ORDER_PLACED" || newStatus == "SHIPPING_SOON") {
        return false;
      } else {
        return true;
      }
    } else if (newStatus == "DELIVERED") {
      return true;
    } else {
      if (
        oldStatus == null ||
        oldStatus == "" ||
        oldStatus == "NO_INFORMATION_AVAILABLE"
      ) {
        return true;
      }
      return false;
    }
  } else if (type == 2) {
    // Delivery
    if (oldStatus != newStatus) {
      if (
        (oldStatus == "IN_TRANSIT" || oldStatus == "OUT_FOR_DELIVERY") &&
        (newStatus == "IN_TRANSIT" || newStatus == "OUT_FOR_DELIVERY")
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (
        (oldPromiseMessage.includes("Arriving") ||
          oldPromiseMessage.includes("Now expected")) &&
        (newPromiseMessage.includes("Arriving") ||
          newPromiseMessage.includes("Now expected"))
      ) {
        return false;
      }

      if (
        oldPromiseMessage != newPromiseMessage &&
        !oldPromiseMessage.includes("Your package may be lost") &&
        newPromiseMessage.includes("Your package may be lost")
      ) {
        return true;
      }

      return false;
    }
  } else {
    // No need to update
    return false;
  }
}

class shippingInfo {
  constructor(
    amazonOrderId,
    buyerOrderId,
    carrierName,
    trackingId,
    newBuyerOrderStatus,
    expectedDeliveryDateStart,
    expectedDeliveryDateEnd,
    shipDate,
    deliveryDate
  ) {
    this.BuyerAmazonOrderId = amazonOrderId;
    this.SellerAmazonOrderId = "";
    this.AmazonOrderId = amazonOrderId;
    this.BuyerOrderId = buyerOrderId;
    this.CarrierName = carrierName;
    this.TrackingId = trackingId;
    this.NewBuyerOrderStatus = newBuyerOrderStatus;
    this.ExpectedDeliveryDateStart = expectedDeliveryDateStart;
    this.ExpectedDeliveryDateEnd = expectedDeliveryDateEnd;
    this.ShipDate = shipDate;
    this.DeliveryDate = deliveryDate;
    this.ShortStatus = newBuyerOrderStatus;
    this.PromiseMessage = expectedDeliveryDateStart;
  }
}

async function getShippingInformation(content) {
  var page = $("<div></div>");
  page.html(content);

  var si = new shippingInfo("", 0, "", "", "", "", "", "", "");

  var scripts = $("script[type=a-state]", page)[0];

  var s = JSON.parse(scripts.innerText);
  si.ShortStatus = s.shortStatus;
  si.PromiseMessage = s.promise.promiseMessage;
  si.AmazonOrderId = s.orderId;
  si.BuyerAmazonOrderId = s.orderId;
  si.TrackingId = s.trackingId;

  var carrier = page
    .find("div#tracking-events-container div.tracking-event-carrier-header h2")
    .text()
    .trim();
  if (carrier == null || carrier == "") {
    carrier = page
      .find("#carrierRelatedInfo-container h1.widgetHeader")
      .text()
      .trim();
  }
  if (carrier == null || carrier == "") {
    carrier = page
      .find("h1.carrierRelatedInfo-mfn-carrierNameTitle")
      .text()
      .trim();
  }
  carrier = carrier.replace("Shipped with", "").trim();
  carrier = carrier.replace("Delivery by", "").trim();
  si.CarrierName = carrier;

  var primaryStatus = page.find("span#primaryStatus").text().trim();
  if (page.find("div#lexicalProgressTracker-container h2").length) {
    primaryStatus +=
      " ### " +
      page.find("div#lexicalProgressTracker-container h2").text().trim();
  }
  si.NewBuyerOrderStatus = primaryStatus;

  if (primaryStatus.includes("Arriving")) {
    var expectedDeliveryDate = primaryStatus.replace("Arriving", "").trim();
    si.ExpectedDeliveryDateStart = expectedDeliveryDate;
    si.ExpectedDeliveryDateEnd = expectedDeliveryDate;

    var milestones = page.find("span.milestone-primaryMessage");
    for (let index = 0; index < milestones.length; index++) {
      const element = milestones[index];
      if (element.innerText.includes("Shipped")) {
        var shipDate = element.innerText.replace("Shipped", "").trim();
        if (shipDate != null && shipDate != "") {
          si.NewBuyerOrderStatus = "Shipped";
          si.ShipDate = shipDate;
        }
      }
    }
  } else if (primaryStatus.includes("Delivered")) {
    var deliveryDate = primaryStatus.replace("Delivered", "").trim();
    si.NewBuyerOrderStatus = "Delivered";
    si.DeliveryDate = deliveryDate;
  }

  return si;
}

function checkBuyingPages() {
  var cbp = setInterval(async function () {
    var isContinueButtonVisible = true;

    if (location.href.includes("gp/buy/accountselect")) {
      createOrder_BusinessPrimeAccountSelectPageItems();
    }

    if (
      location.href.includes("gp/buy/businessorder") ||
      $("input#configurationId_0").length
    ) {
      createOrder_BusinessPrimeConfigurationIdPageItems();
    }

    if (localStorage.getItem("configurationIdSelected") == 1) {
      localStorage.setItem("configurationIdSelected", 0);
      location.replace(
        location.origin +
          "/gp/buy/addressselect/handlers/display.html?hasWorkingJavascript=1"
      );
    }

    if (
      $("#newShippingAddressFormFromIdentity").length &&
      !$("#sfContainer").length
    ) {
      createOrder_AddressPageItems();
    }
    //changeQuantityFormId
    if (
      location.href.includes(
        location.origin + "/gp/buy/itemselect/handlers/display.html"
      )
    ) {
      setTimeout(() => {
        location.replace(
          location.origin +
            "/gp/buy/addressselect/handlers/display.html?hasWorkingJavascript=1"
        );
      }, 1000);
    }

    if (
      ($(".sender-name-text-input").length ||
        $(".save-gift-button-box").length ||
        "form#giftOptions".length) &&
      !$("#sfContainer").length
    ) {
      createOrder_GiftPageItems();
    }

    if ($("#shippingOptionFormId").length) {
      createOrder_ShipOptionPageItems();
    }

    if (
      ($("#orderSummaryPrimaryActionBtn-announce").length ||
        $(
          "input#continue-top, input[name='ppw-widgetEvent:SetPaymentPlanSelectContinueEvent'], .pmts-credit-card-row span.pmts-button-input input"
        ).length) &&
      !$("#sfContainer").length
    ) {
      createOrder_PaymentPageItems();
    }

    if ($("input[name='placeYourOrder1']").length) {
      await createOrder_PlaceOrderPageItems();
      isContinueButtonVisible = false;
    }

    if (location.href.includes("thankyou")) {
      clearInterval(cbp);
    }

    isContinueButtonVisible
      ? $("#sfAutoPilotDiv").show()
      : $("#sfAutoPilotDiv").hide();
  }, 5e3);
}

function createOrder_BusinessPrimeAccountSelectPageItems() {
  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(false);
  }

  chromeGetOrderDetails();

  setTimeout(() => {
    if (
      orderDetails == "" ||
      orderDetails == null ||
      orderDetails == undefined
    ) {
    } else {
      setOrderSummary(orderDetails);
    }

    if (orderDetails.isAutoPilotOn) {
      setTimeout(() => {
        if ($("span#orderSummaryPrimaryActionBtn").length) {
          triggerClick("span#orderSummaryPrimaryActionBtn:first()", 1);
        }
      }, 2e3);
    }
  }, 2e3);

  $("#sfContinueButton").click(function () {
    if ($("span#orderSummaryPrimaryActionBtn").length) {
      triggerClick("span#orderSummaryPrimaryActionBtn:first()", 1);
    }
  });
}

function createOrder_BusinessPrimeConfigurationIdPageItems() {
  localStorage.setItem("configurationIdSelected", 1);

  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(false);
  }

  chromeGetOrderDetails();

  if (orderDetails == "" || orderDetails == null || orderDetails == undefined) {
  } else {
    setOrderSummary(orderDetails);
  }

  if (orderDetails.isAutoPilotOn) {
    setTimeout(() => {
      if ($("span#orderSummaryPrimaryActionBtn").length) {
        triggerClick("span#orderSummaryPrimaryActionBtn:first()", 1);
      }
    }, 3e3);
  }

  $("#sfContinueButton").click(function () {
    if ($("span#orderSummaryPrimaryActionBtn").length) {
      triggerClick("span#orderSummaryPrimaryActionBtn:first()", 1);
    }
  });
}

function createOrder_WrongAddressPageItems() {
  if (localStorage.getItem("addressSelected") != 1) {
    setTimeout(() => {
      location.replace(
        location.origin +
          "/gp/buy/addressselect/handlers/display.html?hasWorkingJavascript=1"
      );
    }, 2e3);
  }

  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(false);
  }

  $(
    "select[name='addressID.destinationType.destinationId.destinationOwnerId.1'] option"
  ).each(function () {
    if ($(this).val().includes(orderDetails.purchaserInfo.name)) {
      $("#sfPageMessage").html("Bu adrese gönderim yapılamamaktadır. ");

      $("#sfAutoPilotDiv").hide();
    } else {
      setTimeout(() => {
        location.replace(
          location.origin +
            "/gp/buy/addressselect/handlers/display.html?hasWorkingJavascript=1"
        );
      }, 2e3);
    }
  });

  $("#sfContinueButton").click(function () {});

  chromeGetOrderDetails();
}

function createOrder_AddressPageItems() {
  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(false);
  }

  chromeGetOrderDetails();
  setTimeout(function () {
    if (
      orderDetails == "" ||
      orderDetails == null ||
      orderDetails == undefined
    ) {
    } else {
      setOrderSummary(orderDetails);
    }
    if ($("#newShippingAddressFormFromIdentity").length) {
      $("#newShippingAddressFormFromIdentity").get(0).scrollIntoView();
    }
    triggerClick($("#add-new-address-popover-link").parent(), 1);

    $(
      "select#address-ui-widgets-countryCode option, select#address-ui-widgets-countryCode-dropdown-nativeId option, #enterAddressCountryCode option"
    ).each(function () {
      $(this).val() === orderDetails.purchaserInfo.countryCode &&
        $(
          "select#address-ui-widgets-countryCode, select#address-ui-widgets-countryCode-dropdown-nativeId, #address-ui-widgets-countryCode-dropdown-nativeId, #enterAddressCountryCode"
        ).val($(this).val());
    });
    simulateEvents(
      $(
        "select#address-ui-widgets-countryCode, select#address-ui-widgets-countryCode-dropdown-nativeId, #enterAddressCountryCode"
      )[0],
      "change",
      1
    );

    if (
      orderDetails == "" ||
      orderDetails == null ||
      orderDetails == undefined
    ) {
      $("#sfOrderDetails").html(language["1000038"][activeLanguage]);
    } else {
      setTimeout(function () {
        $(
          "#address-ui-widgets-enterAddressFullName, [id^=address-ui-widgets-enterAddressFullName]"
        ).val(orderDetails.purchaserInfo.name);
        $(
          "#address-ui-widgets-enterAddressLine1, #enterAddressAddressLine1, #address-ui-widgets-streetName,[id^=address-ui-widgets-enterAddressLine1]"
        ).val(orderDetails.purchaserInfo.addressLine1);
        $(
          "#address-ui-widgets-enterAddressLine2, #enterAddressAddressLine2, #address-ui-widgets-enter-building-name-or-number, [id^=address-ui-widgets-enterAddressLine2]"
        ).val(
          orderDetails.purchaserInfo.addressLine2 != null
            ? orderDetails.purchaserInfo.addressLine2
            : ""
        );

        if (
          $(
            "#address-ui-widgets-enterAddressLine3, #enterAddressAddressLine3, [id^=address-ui-widgets-enterAddressLine3]"
          ).length
        ) {
          $(
            "#address-ui-widgets-enterAddressLine3, #enterAddressAddressLine3, [id^=address-ui-widgets-enterAddressLine3]"
          ).val(orderDetails.purchaserInfo.addressLine3);
        } else if (
          orderDetails.purchaserInfo.addressLine3 != null &&
          orderDetails.purchaserInfo.addressLine3 != undefined
        ) {
          $(
            "#address-ui-widgets-enterAddressLine2, #enterAddressAddressLine2, #address-ui-widgets-enter-building-name-or-number, [id^=address-ui-widgets-enterAddressLine2]"
          ).val(
            (orderDetails.purchaserInfo.addressLine2 != null
              ? orderDetails.purchaserInfo.addressLine2
              : "") +
              " " +
              orderDetails.purchaserInfo.addressLine3
          );
        }

        if (orderDetails.purchaserInfo.countryCode == "AU") {
          try {
            $(
              "#address-ui-widgets-enterAddressPhoneNumber, #enterAddressPhoneNumber, [id^=address-ui-widgets-enterAddressPhoneNumber]"
            ).val(orderDetails.purchaserInfo.phone);
            simulateInput(
              $(
                "#address-ui-widgets-enterAddressPhoneNumber, #enterAddressPhoneNumber, [id^=address-ui-widgets-enterAddressPhoneNumber]"
              )[0],
              orderDetails.purchaserInfo.phone
            );
          } catch (t) {}

          try {
            $(
              "#address-ui-widgets-enterAddressPostalCode, #enterAddressPostalCode, [id^=address-ui-widgets-enterAddressPostalCode]"
            ).val(orderDetails.purchaserInfo.postalCode);
            simulateInput(
              $(
                "#address-ui-widgets-enterAddressPostalCode, #enterAddressPostalCode, [id^=address-ui-widgets-enterAddressPostalCode]"
              )[0],
              orderDetails.purchaserInfo.postalCode
            );
          } catch (t) {}

          setTimeout(() => {
            $(
              "#address-ui-widgets-enterAddressCity, #enterAddressCity, [id^=address-ui-widgets-enterAddressCity]"
            ).val(
              orderDetails.purchaserInfo.city
                ? orderDetails.purchaserInfo.city
                : ""
            );
            var dorc = orderDetails.purchaserInfo.district
              ? orderDetails.purchaserInfo.district
              : orderDetails.purchaserInfo.county;
            $(
              "#address-ui-widgets-enterAddressDistrictOrCounty, #enterAddressDistrictOrCounty, [id^=address-ui-widgets-enterAddressDistrictOrCounty]"
            ).val(dorc);
            $(
              "#address-ui-widgets-enterAddressStateOrRegion, #enterAddressStateOrRegion, [id^=address-ui-widgets-enterAddressStateOrRegion]"
            ).val(orderDetails.purchaserInfo.stateOrRegion);
          }, 2000);
        } else {
          $(
            "#address-ui-widgets-enterAddressCity, #enterAddressCity, [id^=address-ui-widgets-enterAddressCity]"
          ).val(
            orderDetails.purchaserInfo.city
              ? orderDetails.purchaserInfo.city
              : ""
          );
          var dorc = orderDetails.purchaserInfo.district
            ? orderDetails.purchaserInfo.district
            : orderDetails.purchaserInfo.county;
          $(
            "#address-ui-widgets-enterAddressDistrictOrCounty, #enterAddressDistrictOrCounty, [id^=address-ui-widgets-enterAddressDistrictOrCounty]"
          ).val(dorc);
          $(
            "#address-ui-widgets-enterAddressStateOrRegion, #enterAddressStateOrRegion, [id^=address-ui-widgets-enterAddressStateOrRegion]"
          ).val(orderDetails.purchaserInfo.stateOrRegion);
          $(
            "#address-ui-widgets-enterAddressPostalCode, #enterAddressPostalCode, [id^=address-ui-widgets-enterAddressPostalCode]"
          ).val(orderDetails.purchaserInfo.postalCode);

          try {
            simulateInput(
              $(
                "#address-ui-widgets-enterAddressPostalCode, #enterAddressPostalCode, [id^=address-ui-widgets-enterAddressPostalCode]"
              )[0],
              orderDetails.purchaserInfo.postalCode
            );
          } catch (t) {}
          $(
            "#address-ui-widgets-enterAddressPhoneNumber, #enterAddressPhoneNumber, [id^=address-ui-widgets-enterAddressPhoneNumber]"
          ).val(orderDetails.purchaserInfo.phone);
          try {
            simulateInput(
              $(
                "#address-ui-widgets-enterAddressPhoneNumber, #enterAddressPhoneNumber, [id^=address-ui-widgets-enterAddressPhoneNumber]"
              )[0],
              orderDetails.purchaserInfo.phone
            );
          } catch (t) {}
        }

        $(
          "select#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId option"
        ).each(function () {
          $(this).val().toUpperCase() ===
            orderDetails.purchaserInfo.stateOrRegion.toUpperCase() &&
            $(
              "select#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId"
            ).val($(this).val());
        });
        simulateEvents(
          $(
            "select#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId"
          )[0],
          "change",
          0
        );

        setTimeout(function () {
          orderDetails.purchaserInfo.countryCode == "MX" &&
            triggerClick(
              "input[name='address-ui-widgets-enterAddressPostalCode-submit']",
              0
            );
          setTimeout(function () {
            orderDetails.purchaserInfo.countryCode == "MX" &&
              triggerClick(
                "input[name='address-ui-widgets-enterAddressPostalCode-submit']",
                0
              );
            setTimeout(function () {
              $(
                "select#address-ui-widgets-enterAddressLine2SelectNative option"
              ).each(function () {
                $(this).val() ===
                  orderDetails.purchaserInfo.addressLine2.toUpperCase() &&
                  $(
                    "select#address-ui-widgets-enterAddressLine2SelectNative"
                  ).val($(this).val().toUpperCase());
              });
              simulateEvents(
                $("select#address-ui-widgets-enterAddressLine2SelectNative")[0],
                "change",
                0
              );
              $(
                "select#address-ui-widgets-enterAddressCity-dropdown-nativeId option"
              ).each(function () {
                $(this).val() ===
                  orderDetails.purchaserInfo.city.toUpperCase() &&
                  $(
                    "select#address-ui-widgets-enterAddressCity-dropdown-nativeId"
                  ).val($(this).val().toUpperCase());
              });
              simulateEvents(
                $(
                  "select#address-ui-widgets-enterAddressCity-dropdown-nativeId"
                )[0],
                "change",
                0
              );
              $(
                "#address-ui-widgets-enterAddressPhoneNumber, #enterAddressPhoneNumber"
              ).val(orderDetails.purchaserInfo.phone);
            }, 1e3);
          }, 1e3);
        }, 1e3);

        if (orderDetails.selectOriginalAddress) {
          var t = setInterval(function () {
            $("input[name='address-ui-widgets-saveOriginalOrSuggestedAddress']")
              .length &&
              (triggerClick("input[value='original-address-']", 1),
              triggerClick(
                "input[name='address-ui-widgets-saveOriginalOrSuggestedAddress']",
                1
              ),
              clearInterval(t));
          }, 1e3);
        }

        if (orderDetails.isAutoPilotOn) {
          localStorage.setItem("addressSelected", 1);
          setTimeout(() => {
            if (localStorage.getItem("giftMessageSelected") != 1) {
              createOrder_GiftPageItems();
            } else {
              createOrder_PaymentPageItems();
            }
            triggerClick(
              "#address-ui-checkout-submit-button input, #address-ui-widgets-form-submit-button input, span[data-action='add-address-popover-submit']",
              3
            );
          }, 3e3);
        } else {
          $("#sfPageMessage").html(language["1000039"][activeLanguage]);
        }

        localStorage.setItem("addressSelected", 1);
      }, 5e3);
    }
  }, 2e3);

  $("#sfOrderDetails").html(
    language["1000044"][activeLanguage] +
      "<img src='" +
      chrome.runtime.getURL("img/loading.gif") +
      "' style='width: 60%; height: 60%;' />"
  );

  $("#sfContinueButton").click(function () {
    localStorage.setItem("addressSelected", 1);
    $("#sfPageMessage").html("");
    setTimeout(() => {
      triggerClick(
        "#address-ui-checkout-submit-button input, #address-ui-widgets-form-submit-button input, span[data-action='add-address-popover-submit']",
        3
      );
    }, 500);
  });
}

//TODO:
// https://www.amazon.com/gp/buy/billingaddressselect/handlers/display.html?hasWorkingJavascript=1

function createOrder_GiftPageItems() {
  if (localStorage.getItem("addressSelected") != 1) {
    location.replace(
      location.origin +
        "/gp/buy/addressselect/handlers/display.html?hasWorkingJavascript=1"
    );
  }

  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(false);
  }

  $("#sfContinueButton").click(function () {
    $("#sfPageMessage").html("");
    if ($("span#orderSummaryPrimaryActionBtn").length) {
      triggerClick("span#orderSummaryPrimaryActionBtn:first()", 1);
    } else {
      triggerClick("div.save-gift-button-box input[type='submit']:first()", 1);
    }
    localStorage.setItem("giftMessageSelected", 1);
    createOrder_PaymentPageItems();
  });

  chromeGetOrderDetails();

  setTimeout(function () {
    if (
      orderDetails == "" ||
      orderDetails == null ||
      orderDetails == undefined
    ) {
    } else {
      setOrderSummary(orderDetails);
    }

    if ($("#submitOrderButtonId").length) {
      // Gift options and Payment method already selected
      createOrder_PlaceOrderPageItems();
    } else {
      if (
        $(".sender-name-text-input").length ||
        $(".save-gift-button-box").length ||
        ($("form#giftOptions").length &&
          $("form#giftOptions").html().includes("Gift options not available"))
      ) {
        if ($("textarea").length) {
          $("textarea").val(orderDetails.giftCardContent);
        }
        if ($(".sender-name-text-input").length) {
          $(".sender-name-text-input").val(orderDetails.giftCardSender);
        }

        if (orderDetails.isAutoPilotOn) {
          setTimeout(() => {
            if ($("span#orderSummaryPrimaryActionBtn").length) {
              triggerClick("span#orderSummaryPrimaryActionBtn:first()", 1);
            } else {
              triggerClick(
                "div.save-gift-button-box input[type='submit']:first()",
                1
              );
            }
            localStorage.setItem("giftMessageSelected", 1);
            createOrder_PaymentPageItems();
          }, 3e3);
        } else {
          $("#sfPageMessage").html(language["1000039"][activeLanguage]);
        }
      } else {
        autoPilotTryCounterGift++;
        if (autoPilotTryCounterGift <= 5) {
          setTimeout(createOrder_GiftPageItems, 500);
          return;
        }
      }
    }

    localStorage.setItem("giftMessageSelected", 1);
  }, 3e3);
}

var autoPilotTryCounterGift = 0;
var autoPilotTryCounterPayment = 0;

function createOrder_ShipOptionPageItems() {
  if (localStorage.getItem("addressSelected") != 1) {
    location.replace(
      location.origin +
        "/gp/buy/addressselect/handlers/display.html?hasWorkingJavascript=1"
    );
  } else if (localStorage.getItem("giftMessageSelected") != 1) {
    location.replace(
      location.origin +
        "/gp/buy/gift/handlers/display.html?hasWorkingJavascript=1"
    );
  }

  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(false);
  }

  $("#sfContinueButton").click(function () {
    $("#sfPageMessage").html("");
    triggerClick($("input[type=submit]")[0], 1);
  });

  chromeGetOrderDetails();

  if (orderDetails == "" || orderDetails == null || orderDetails == undefined) {
  } else {
    setOrderSummary(orderDetails);
  }

  if ($("#submitOrderButtonId").length) {
    // Ship option already selected
    createOrder_PlaceOrderPageItems();
  } else {
    setTimeout(function () {
      if (orderDetails.isAutoPilotOn) {
        triggerClick($("input[type=submit]")[0], 1);
      }
    }, 3e3);
  }
}

function createOrder_PaymentPageItems() {
  if (localStorage.getItem("addressSelected") != 1) {
    location.replace(
      location.origin +
        "/gp/buy/addressselect/handlers/display.html?hasWorkingJavascript=1"
    );
  } else if (localStorage.getItem("giftMessageSelected") != 1) {
    location.replace(
      location.origin +
        "/gp/buy/gift/handlers/display.html?hasWorkingJavascript=1"
    );
  }

  if (autoPilotTryCounterPayment > 5 && !orderDetails.pauseAtCardStep) {
    createOrder_PlaceOrderPageItems();
    return;
  }
  autoPilotTryCounterPayment++;

  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(false);
  }
  $("#sfContinueButton").click(function () {
    $("#sfPageMessage").html("");
    triggerClick("span#orderSummaryPrimaryActionBtn-announce", 1);
    triggerClick(
      $(
        "input#continue-top, input[name='ppw-widgetEvent:SetPaymentPlanSelectContinueEvent'], .pmts-credit-card-row span.pmts-button-input input"
      ).first(),
      3
    );
    createOrder_PlaceOrderPageItems();
  });

  chromeGetOrderDetails();

  setTimeout(function () {
    if (
      orderDetails == "" ||
      orderDetails == null ||
      orderDetails == undefined
    ) {
    } else {
      setOrderSummary(orderDetails);
    }

    if ($("#submitOrderButtonId").length) {
      // Payment method already selected
      createOrder_PlaceOrderPageItems();
    } else {
      if (
        $("#orderSummaryPrimaryActionBtn-announce").length ||
        $(
          "input#continue-top, input[name='ppw-widgetEvent:SetPaymentPlanSelectContinueEvent'], .pmts-credit-card-row span.pmts-button-input input"
        ).length
      ) {
        tt = setInterval(function () {
          if (orderDetails.isAutoPilotOn && !orderDetails.pauseAtCardStep) {
            var t = $("span:contains('ending in " + 2238 + "')") // TODO: Last4Digits
                .parents(".payment-row, .pmts-instrument-box")
                .first()
                .find(
                  "input[name='paymentMethod'], input[name='ppw-instrumentRowSelection']"
                )
                .first(),
              i;

            if (t.length) {
              triggerClick(t, 1);
              i = $(
                "input#addCreditCardNumber[placeholder='ending in " +
                  3911 + // TODO: Last4Digits
                  "'], div.apx-add-credit-card-number input[placeholder='ending in " +
                  3911 +
                  "']"
              );
              if (i.length) {
                triggerClick(
                  $(
                    "input#confirm-card, .pmts-selected .pmts-button-input button"
                  ).first(),
                  2
                );
                triggerClick(
                  $(
                    "input#continue-top, .pmts-credit-card-row span.pmts-button-input input"
                  ).first(),
                  2
                );
              }

              triggerClick("span#orderSummaryPrimaryActionBtn-announce", 1);
              triggerClick(
                $(
                  "input#continue-top, input[name='ppw-widgetEvent:SetPaymentPlanSelectContinueEvent'], .pmts-credit-card-row span.pmts-button-input input"
                ).first(),
                3
              );
            }

            triggerClick("span#orderSummaryPrimaryActionBtn-announce", 1);

            triggerClick(
              $(
                "input#continue-top, input[name='ppw-widgetEvent:SetPaymentPlanSelectContinueEvent'], .pmts-credit-card-row span.pmts-button-input input"
              ).first(),
              3
            );

            clearInterval(tt);
            createOrder_PlaceOrderPageItems();
          }
        }, 10e3);
      } else {
        setTimeout(createOrder_PaymentPageItems, 500);
      }
    }
  }, 10e3);
}

function createOrder_PlaceOrderPageItems() {
  if (localStorage.getItem("addressSelected") != 1) {
    location.replace(
      location.origin +
        "/gp/buy/addressselect/handlers/display.html?hasWorkingJavascript=1"
    );
  } else if (localStorage.getItem("giftMessageSelected") != 1) {
    location.replace(
      location.origin +
        "/gp/buy/gift/handlers/display.html?hasWorkingJavascript=1"
    );
  }

  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(true);
  } else {
    $("#sfAutoPilotDiv").hide();
  }

  chromeGetOrderDetails();

  setTimeout(() => {
    if (
      orderDetails == "" ||
      orderDetails == null ||
      orderDetails == undefined
    ) {
    } else {
      setOrderSummary(orderDetails);
    }

    var quantityErrorDiv =
      "<div id='sf-quantityErrorDiv' class='sf-alert' style='margin-top:5px; margin-bottom: 5px; padding: 10px; font-weight: 600; display: none;'>" +
      language["1000140"][activeLanguage] +
      "</div>";

    if ($("#placeYourOrder").length) {
      $("#placeYourOrder").parent().append(quantityErrorDiv);
    } else if ($("#submitOrderButtonId").length) {
      $("#submitOrderButtonId").parent().append(quantityErrorDiv);
    }

    //myEarningUSD
    //wareHouseCostUSD

    setInterval(function () {
      if (orderDetails.myEarningUSD > 0) {
        var totalPriceText = $(".grand-total-price")
          .first()
          .text()
          .replace("USD", "")
          .replace("$", "")
          .trim();
        var totalPrice = parseFloat(totalPriceText);

        var earnings = orderDetails.myEarningUSD - orderDetails.taxUSD;
        var totalCost = totalPrice + orderDetails.wareHouseCostUSD;
        var profit = (100.0 * (earnings - totalCost)) / totalCost;
        var profitUsd = earnings - totalCost;

        if (!isNaN(profit)) {
          $("#sfOrderProfit").text("% " + profit.toFixed(2));
          $("#sfOrderProfitUsd").text(profitUsd.toFixed(2) + " $");

          $("#sfOrderProfitDiv").show();

          if (profit > 0) {
            $("#sfOrderProfit").css("border", "1px solid green");
            $("#sfOrderProfit").css("color", "green");
            $("#sfOrderProfitUsd").css("border", "1px solid green");
            $("#sfOrderProfitUsd").css("color", "green");
          } else {
            $("#sfOrderProfit").css("border", "1px solid red");
            $("#sfOrderProfit").css("color", "red");
            $("#sfOrderProfitUsd").css("border", "1px solid red");
            $("#sfOrderProfitUsd").css("color", "red");
          }
        } else {
          $("#sfOrderProfitDiv").hide();
        }
      } else {
        $("#sfOrderProfitDiv").hide();
      }

      if ($("input[name='dupOrderCheckArgs']").length) {
        var o = [];
        $("input[name='dupOrderCheckArgs']").each(function () {
          var n = $(this).val();
          asinPos = n.split("|");
          var t = asinPos[0],
            i = asinPos[1],
            r = { ASIN: t, Quantity: parseInt(i) };
          o.push(r);
        });

        var s = [];
        $.each(orderDetails.orderProducts, function (n, t) {
          s.push({ ASIN: t.asin, Quantity: t.quantity });
        });

        if (JSON.stringify(o) == JSON.stringify(s)) {
          $("#sfPageMessage").html(language["1000040"][activeLanguage]);
        } else {
          var quantityError = false;

          $.each(orderDetails.orderProducts, function (n, t) {
            var product = o.find((x) => x.ASIN === t.asin);
            if (product) {
              var quantity = o.find((x) => x.ASIN === t.asin).Quantity;
              if (quantity > t.quantity) {
                quantityError = true;
              }
            }
          });

          if (quantityError) {
            if ($("#placeYourOrder").length) {
              $("#placeYourOrder").css("cursor", "not-allowed");
            }

            if ($("#submitOrderButtonId").length) {
              $("#submitOrderButtonId").css("cursor", "not-allowed");
            }

            if ($("#bottomSubmitOrderButtonId").length) {
              $("#bottomSubmitOrderButtonId").css("cursor", "not-allowed");
            }

            $('input[name="placeYourOrder1"]').css("cursor", "not-allowed");
            $("#sf-quantityErrorDiv").show();
          } else {
            if ($("#placeYourOrder").length) {
              $("#placeYourOrder").css("cursor", "pointer");
            }

            if ($("#submitOrderButtonId").length) {
              $("#submitOrderButtonId").css("cursor", "pointer");
            }

            if ($("#bottomSubmitOrderButtonId").length) {
              $("#bottomSubmitOrderButtonId").css("cursor", "pointer");
            }

            $('input[name="placeYourOrder1"]').css("cursor", "pointer");
            $("#sf-quantityErrorDiv").hide();
          }

          $("#sfPageMessage").html(
            "<div class='sf-alert' style='margin-top:0px;  margin-bottom: 5px;'>" +
              language["1000041"][activeLanguage] +
              "</div>"
          );
          $(".shipping-group").css("border", "2px solid red");
        }

        var addressFromApi = (
          orderDetails.purchaserInfo.addressLine1 +
          " " +
          (orderDetails.purchaserInfo.addressLine2 != null
            ? orderDetails.purchaserInfo.addressLine2
            : "") +
          " " +
          (orderDetails.purchaserInfo.addressLine3 != null
            ? orderDetails.purchaserInfo.addressLine3
            : "")
        )
          .replaceAll("  ", " ")
          .toLowerCase()
          .trim();
        var addressFromScreen = "";

        var nameFromApi = orderDetails.purchaserInfo.name.toLowerCase().trim();
        var nameFromScreen = "";

        if ($("#desktop-shipping-address-div").length) {
          addressFromScreen = (
            $(
              "#desktop-shipping-address-div .displayAddressAddressLine1"
            ).text() +
            " " +
            $(
              "#desktop-shipping-address-div .displayAddressAddressLine2"
            ).text() +
            " " +
            $(
              "#desktop-shipping-address-div .displayAddressAddressLine3"
            ).text()
          )
            .replaceAll("  ", " ")
            .trim()
            .toLowerCase();

          nameFromScreen = $(
            "#desktop-shipping-address-div .displayAddressFullName"
          )
            .text()
            .trim()
            .toLowerCase();
        } else {
          addressFromScreen = (
            $(".displayAddressUL .displayAddressAddressLine1").text() +
            " " +
            $(".displayAddressUL .displayAddressAddressLine2").text() +
            " " +
            $(".displayAddressUL .displayAddressAddressLine3").text()
          )
            .replaceAll("  ", " ")
            .trim()
            .toLowerCase();

          nameFromScreen = $(".displayAddressUL .displayAddressFullName")
            .text()
            .trim()
            .toLowerCase();
        }

        if (addressFromApi != addressFromScreen) {
          $("#sfPageMessage").html(
            $("#sfPageMessage").html() +
              "<div class='sf-alert' style='margin-top:0px; margin-bottom: 5px;'>" +
              language["1000042"][activeLanguage] +
              "</div>"
          );
          $("#desktop-shipping-address-div, #shipaddress").css(
            "border",
            "2px solid red"
          );
        }

        if (nameFromApi != nameFromScreen) {
          $("#sfPageMessage").html(
            $("#sfPageMessage").html() +
              "<div class='sf-alert' style='margin-top:0px;  margin-bottom: 5px;'>" +
              language["1000043"][activeLanguage] +
              "</div>"
          );
          $("#desktop-shipping-address-div, #shipaddress").css(
            "border",
            "2px solid red"
          );
        }

        var pp = $("input[name='purchaseTotal']").val();

        if (
          orderDetails.purchasePrice == undefined ||
          orderDetails.purchasePrice == null ||
          (pp > 0 && orderDetails.purchasePrice != pp)
        ) {
          orderDetails.purchasePrice = pp;
          chromeSaveOrderDetails(orderDetails);
        }
      }
    }, 1e3);
  }, 2e3);

  setTimeout(() => {
    $("#spinner-anchor").css("display", "none");
    $("#loading-spinner-blocker-doc").css("display", "none");
  }, 10e3);
}

function createOrderPageStep2Items() {
  localStorage.setItem("reloaded", 0);

  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(false);
  }

  setTimeout(() => {
    if (orderDetails.orderProducts.find((x) => x.isWareHouseOrder == true)) {
      $("#sc-buy-box-gift-checkbox").prop("checked", false);
      localStorage.setItem("giftMessageSelected", 1);
    } else {
      $("#sc-buy-box-gift-checkbox").prop("checked", true);
    }
  }, 500);

  // API CALL : GetOrderDetails
  $("#sfOrderDetails").html(
    language["1000044"][activeLanguage] +
      "<img src='" +
      chrome.runtime.getURL("img/loading.gif") +
      "' style='width: 60%; height: 60%;' />"
  );

  chromeGetOrderDetails();

  var priceOnPage1 = localStorage.getItem("SFOrderItemPrice");
  var price = $("#activeCartViewForm .sc-product-price")
    .text()
    .replaceAll("$", "")
    .trim();
  price = parseInt(price);
  if (priceOnPage1 > 0 && price > priceOnPage1) {
    localStorage.setItem(
      "sfOrderDetailsDealDiscount",
      "Bu üründe DEAL indirimi vardır."
    );
  } else {
    localStorage.removeItem("sfOrderDetailsDealDiscount");
  }

  if (
    $(
      "form#activeCartViewForm .prime-signup-ingress, div#sc-active-cart .prime-signup-ingress"
    ).length
  ) {
    localStorage.setItem(
      "sfOrderDetailsPrimeDiscount",
      "Bu üründe PRIME indirimi vardır."
    );
  } else {
    localStorage.removeItem("sfOrderDetailsPrimeDiscount");
  }

  setTimeout(function () {
    if (
      orderDetails == "" ||
      orderDetails == null ||
      orderDetails == undefined
    ) {
    } else {
      setOrderSummary(orderDetails);
    }

    if (
      $('input[name="quantityBox"]').length &&
      orderDetails.orderProducts[0].quantity > 10 &&
      $('input[name="quantityBox"]').val() !==
        orderDetails.orderProducts[0].quantity
    ) {
      $('input[name="quantityBox"]').val(
        orderDetails.orderProducts[0].quantity
      );
      $('input[name="quantityBox"]').focus();
      simulateClick($(".sc-update-link a")[0], 1);
    }

    if ($("#sc-active-cart a.sc-action-link").length) {
      simulateClick($("#sc-active-cart a.sc-action-link")[0], 1);
    }

    if (orderDetails.isAutoPilotOn) {
      setTimeout(() => {
        if ($("#gutterCartViewForm").length) {
          submitForm("gutterCartViewForm", 2);
        } else {
          triggerClick(
            "input[name='proceedToCheckout'], input[name='proceedToRetailCheckout']",
            2
          );
        }
      }, 2e3);
    }
  }, 1e3);

  $("#sfContinueButton").click(function () {
    if ($("#gutterCartViewForm").length) {
      submitForm("gutterCartViewForm", 2);
    } else {
      triggerClick(
        "input[name='proceedToCheckout'], input[name='proceedToRetailCheckout']",
        2
      );
    }
  });
}

async function createOrderPageStep1Items() {
  if (!location.href.includes("AssociateTag")) {
    location.replace(location.href + "&AssociateTag=1");
  }

  localStorage.setItem("addressSelected", 0);
  localStorage.setItem("giftMessageSelected", 0);
  localStorage.removeItem("sfOrderDetailsPrimeDiscount");
  localStorage.removeItem("sfOrderDetailsDealDiscount");

  if (!$("#sfContainer").length) {
    createOrderSummaryDiv(false);
  }

  var price = $("#activeCartViewForm .sc-product-price")
    .text()
    .replaceAll("$", "")
    .trim();
  price = parseInt(price);
  if (price > 0) {
    localStorage.setItem("SFOrderItemPrice", price);
  }

  // API CALL : GetOrderDetails
  $("#sfOrderDetails").html(
    language["1000044"][activeLanguage] +
      "<img src='" +
      chrome.runtime.getURL("img/loading.gif") +
      "' style='width: 60%; height: 60%;' />"
  );

  amazonOrderId = location.href.split("AmazonOrderId=").pop().split("send")[0];
  getOrderDetails().then(async (details) => {
    await changeAddress(
      details.purchaserInfo.countryCode,
      details.purchaserInfo.postalCode
    );

    setTimeout(async () => {
      var reloaded = localStorage.getItem("reloaded") * 1;
      if (
        ($(".itemq").length &&
          $(".itemq").html().includes("currently unavailable")) ||
        ($("#activeCartViewForm").length &&
          $("#activeCartViewForm").html().includes("currently unavailable")) ||
        ($(".a-cardui-body").length &&
          $(".a-cardui-body").html().includes("currently unavailable"))
      ) {
        if (!reloaded) {
          localStorage.setItem("reloaded", 1);
          location.reload();
        }
      }

      //POST ile sepete ekleme
      const searchParams = new URLSearchParams(location.search);
      const asins = Array.from(searchParams.entries()).filter(([k]) =>
        k.startsWith("ASIN.")
      );

      for (const asin of asins) {
        const id = asin[0].split(".").pop();
        const quantity = searchParams.get("Quantity." + id);

        await new Promise((resolve, reject) => {
          $.ajax({
            type: "GET",
            url: location.origin + "/dp/" + asin[1] + "?th=1&psc=1",
            success: function (response) {
              var el = $("<div></div>");
              el.html(response);

              const form = $("form#addToCart", el)[0];
              const formData = new FormData(form);
              formData.set("quantity", quantity);

              $.ajax({
                type: "POST",
                url:
                  location.origin +
                  "/gp/product/handle-buy-box/ref=dp_start-bbf_1_glance",
                data: formData,
                processData: false,
                contentType: false,
                success: async function () {
                  resolve();
                },
                failure: function () {
                  reject();
                },
                complete: function () {},
              });
            },
            failure: function () {},
            complete: function () {},
          });
        });
      }

      location.replace(
        "https://www.amazon.com/gp/cart/view.html?ref_=nav_cart"
      );

      if (details.isAutoPilotOn) {
        if ($('input[name="add"]').length) {
          triggerClick($('input[name="add"]'), 1);
        } else if ($('input[class="a-button-input"]').length) {
          triggerClick($('input[class="a-button-input"]'), 1);
        }
      }
    }, 2e3);
  });

  $("#sfContinueButton").click(function () {
    if ($('input[name="add"]').length) {
      triggerClick($('input[name="add"]'), 1);
    } else if ($('input[class="a-button-input"]').length) {
      triggerClick($('input[class="a-button-input"]'), 1);
    }
  });
}

function createOrderSummaryDiv(hideContinueButton) {
  var div = `
    <div id="sfContainer" class="sfContainer-bg2" style="width: 25%; height: 100%; z-index: 999998;">
            <div class="sfContainer-top">
                <div class="flex ai-c jc-sb" style="height:42px;padding: 0 15px;">
                    <div class="flex ai-c">
                        <i class="fas fa-user"></i>
                        <span class="ml-15">${user.name}</span>
                    </div>
                </div>
            </div>

            <div class="content" >
                <div class="bg mb-10">
                    <span id="sfPageMessage" />
                    <span id="sfOrderDetailsDealDiscount" />
                    <span id="sfOrderDetailsPrimeDiscount" />
                    <span id="sfOrderDetailsCouponDiscount" />
                    <span id="sfOrderDetails" />
                    <button id='sfCancelOrder' class="danger-button" style="width:100%;">  ${language["1000092"][activeLanguage]}</button>
                    </div>
                <div id="sfAutoPilotDiv" class="flex ai-c jc-sb">
                    <div>
                        <label for="sfAutoContinue"><input type="checkbox" style="width:25px;" id="sfAutoContinue" name="sfAutoContinue" value="${language["1000047"][activeLanguage]}"> ${language["1000047"][activeLanguage]} </label>
                    </div>
                    <div>
                        <button id='sfContinueButton' class="yellow-button">
                        ${language["1000048"][activeLanguage]}</button>
                    </div>
                </div>
            </div>
        </div>
    `;
  div += "</div>";

  $("body").css("width", "75%");

  $("body").append(div);

  if (hideContinueButton) $("#sfAutoPilotDiv").hide();

  $("#sfCancelOrder").click(function () {
    orderDetails = null;
    chromeSaveOrderDetails(null);
    localStorage.setItem("reloaded", 0);

    window.location.replace(location.origin);
  });

  $("#sfAutoContinue").change(function () {
    if (orderDetails != null && orderDetails.isAutoPilotOn != null) {
      if (this.checked && !orderDetails.isAutoPilotOn) {
        updateAutoPilotValue(true);
      } else if (!this.checked && orderDetails.isAutoPilotOn) {
        updateAutoPilotValue(false);
      }
    }
  });
}

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

function updateAutoPilotValue(newValue) {
  orderDetails.isAutoPilotOn = newValue;

  // $.ajax({
  //   type: "POST",
  //   url:
  //     user.apiSubdomain +
  //     "api/extension/updateAutoPilot?customerId=" +
  //     user.customerId +
  //     "&autoPilotStatus=" +
  //     newValue,
  //   contentType: "application/json; charset=utf-8",
  //   dataType: "json",
  //   headers: { Authorization: "Bearer " + user.token },
  //   success: function () {},
  //   failure: function () {},
  //   complete: function (data) {
  //     if (data.status == 200) {
  //       orderDetails.isAutoPilotOn = newValue;
  //       chromeSaveOrderDetails(orderDetails);
  //     }
  //   },
  // });
}

var amazonOrderId = "",
  sendType = "";
var orderDetails = "";

function getOrderDetails() {
  return new Promise((resolve, reject) => {
    if (
      amazonOrderId == undefined ||
      amazonOrderId == null ||
      amazonOrderId == ""
    ) {
      amazonOrderId = location.href
        .split("AmazonOrderId=")
        .pop()
        .split("&")[0]
        .replace("%2D", "-");
    }

    if (sendType == undefined || sendType == null || sendType == "") {
      sendType = location.href.split("sendType=").pop().split("&")[0];
    }
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // url:
    //   user.apiSubdomain +
    //   "api/sellerOrder/getSellerOrderDetailsForExtension?sellerAmazonOrderId=" +
    //   amazonOrderId +
    //   "&sendType=" +
    //   sendType,
    $.ajax({
      type: "GET",
      async: false,
      url: `${baseUrl}${endPoints.Order.byAmazonOrderId}?amazonOrderId=${amazonOrderId}`,
      headers: { Authorization: "Bearer " + user.token },
      success: function (response) {
        orderDetails = response;
        const sellerOrderDetails = response.sellerOrder.sellerOrderDetails;
        const orderProducts = sellerOrderDetails.map((detail) => ({
          quantity: detail.quantity,
          isWareHouseOrder: response.isWareHouseOrder,
          asin: detail.asin,
          productName: detail.productTitle,
          estimatedPurchasePrice: detail.productCostInUSD,
          hasCoupon: false,
          couponDiscountType: "$",
          couponDiscountValue: 0,
        }));

        const responseTemp = {
          amazonOrderId: response.sellerOrder.amazonOrderId,
          initialDate: response.sellerOrder.purchaseDate,
          deliveryEndDate: response.sellerOrder.latestShipDate,
          purchaserInfo: {
            name: response.sellerOrder.customerName,
            addressLine1: response.sellerOrder.customerAddressLine1,
            addressLine2: response.sellerOrder.customerAddressLine2,
            addressLine3: response.sellerOrder.customerAddressLine3,
            city: response.sellerOrder.customerCity,
            county: response.sellerOrder.customerCounty,
            district: response.sellerOrder.customerDistrict,
            stateOrRegion: response.sellerOrder.customerStateOrRegion,
            municipality: response.sellerOrder.customerMunicipality,
            postalCode: response.sellerOrder.customerPostalCode,
            countryCode: response.sellerOrder.customerCountryCode,
            phone: response.sellerOrder.customerPhone,
            email: response.sellerOrder.customerEmail,
            addressType: response.sellerOrder.customerAddressType,
            countryName: response.sellerOrder.customerCountryName,
          },
          myEarningUSD: response.earningInUSD,
          taxUSD: response.salesTaxAmountInUSD,
          wareHouseCostUSD: response.warehouseCostInUSD,
          isAddressFull: response.sellerOrder.addressCompleted,
          orderProducts: orderProducts,
          giftCardSender: response.giftCardSender,
          giftCardContent: response.giftCardContent,
          isAutoPilotOn: response.autoPilotOn,
          pauseAtCardStep: response.pauseAtCardStep,
          selectOriginalAddress: response.selectOriginalAddress,
        };
        chromeSaveOrderDetails(responseTemp);
        setOrderSummary(responseTemp);
        resolve(responseTemp);
      },
      failure: function (response) {
        $("#sfOrderDetails").html(language["1000049"][activeLanguage]);
        reject(response);
      },
      complete: function (data) {
        if (data.status == 400) {
          if (
            data.responseJSON != null &&
            data.responseJSON != undefined &&
            (data.responseJSON.Message == "NonPayingUser" ||
              data.responseJSON.Message == "CanceledSubscription")
          ) {
            $("#sfOrderDetails").html(language["1000141"][activeLanguage]);
            orderDetails.isAutoPilotOn = false;
            $("#sfAutoPilotDiv").hide();
          } else {
            $("#sfOrderDetails").html(language["1000049"][activeLanguage]);
            reject(response);
          }
        }
      },
    });
  });
}

function setOrderSummary(response) {
  var primeDiscount = localStorage.getItem("sfOrderDetailsPrimeDiscount");
  var dealDiscount = localStorage.getItem("sfOrderDetailsDealDiscount");

  setTimeout(() => {
    if (
      response == undefined ||
      response == "" ||
      response.purchaserInfo.name == null ||
      response.purchaserInfo.addressLine1 == null
    ) {
      $("#sfOrderDetails").html(language["1000050"][activeLanguage]);
      orderDetails.isAutoPilotOn = false;
      $("#sfAutoPilotDiv").hide();
    } else if (
      ($(".itemq").length &&
        $(".itemq").html().includes("currently unavailable")) ||
      ($("#activeCartViewForm").length &&
        $("#activeCartViewForm").html().includes("currently unavailable")) ||
      ($(".a-cardui-body").length &&
        $(".a-cardui-body").html().includes("currently unavailable"))
    ) {
      $("#sfOrderDetails").html(language["1000103"][activeLanguage]);
      orderDetails.isAutoPilotOn = false;
      $("#sfAutoPilotDiv").hide();
    } else {
      var hasCouponDiscount = false;
      $.each(response.orderProducts, function (index, item) {
        if (item.hasCoupon) {
          hasCouponDiscount = true;
        }
      });

      if (hasCouponDiscount) {
        $("#sfOrderDetailsCouponDiscount").html(
          "<div class='sf-info' style='margin-top:0px;  margin-bottom: 5px; font-weight: 600;'>" +
            language["1000144"][activeLanguage] +
            "</div>"
        );
        $("#sfOrderDetailsCouponDiscount").show();
      } else {
        $("#sfOrderDetailsCouponDiscount").html("");
        $("#sfOrderDetailsCouponDiscount").hide();
      }

      if (primeDiscount) {
        $("#sfOrderDetailsPrimeDiscount").html(
          "<div class='sf-info' style='margin-top:0px;  margin-bottom: 5px; font-weight: 600;'>" +
            language["1000142"][activeLanguage] +
            "</div>"
        );
        $("#sfOrderDetailsPrimeDiscount").show();
      } else {
        $("#sfOrderDetailsPrimeDiscount").html("");
        $("#sfOrderDetailsPrimeDiscount").hide();
      }
      if (dealDiscount) {
        $("#sfOrderDetailsDealDiscount").html(
          "<div class='sf-info' style='margin-top:0px;  margin-bottom: 5px; font-weight: 600;'>" +
            language["1000146"][activeLanguage] +
            "</div>"
        );
        $("#sfOrderDetailsDealDiscount").show();
      } else {
        $("#sfOrderDetailsDealDiscount").html("");
        $("#sfOrderDetailsDealDiscount").hide();
      }

      var shippingInfo = "";
      if (response.isExpedited) {
        shippingInfo = "EXP";
      } else {
        shippingInfo = "STD";
      }

      if (response.deliveryEndDate != null) {
        shippingInfo += " " + formatDate(response.deliveryEndDate);
      }

      var content = `
            <div class="order-number mb-10">${response.amazonOrderId}</div>
            <div class="order-owner-name mb-10">${
              response.purchaserInfo.name
            }</div>
            <div class="order-address mb-10">
                <strong>${language["1000106"][activeLanguage]} :</strong><br>
                ${
                  response.purchaserInfo.addressLine1
                    ? response.purchaserInfo.addressLine1 + "<br>"
                    : ""
                }
                ${
                  response.purchaserInfo.addressLine2
                    ? response.purchaserInfo.addressLine2 + "<br>"
                    : ""
                }
                ${
                  response.purchaserInfo.addressLine3
                    ? response.purchaserInfo.addressLine3 + "<br>"
                    : ""
                }
                ${
                  response.purchaserInfo.city
                    ? response.purchaserInfo.city + ","
                    : ""
                }
                ${
                  response.purchaserInfo.county
                    ? response.purchaserInfo.county + ","
                    : ""
                }
                ${
                  response.purchaserInfo.district
                    ? response.purchaserInfo.district + ","
                    : ""
                }
                ${
                  response.purchaserInfo.stateOrRegion
                    ? response.purchaserInfo.stateOrRegion + ","
                    : ""
                }
                ${
                  response.purchaserInfo.postalCode
                    ? response.purchaserInfo.postalCode
                    : ""
                }
            </div><hr />
            <div class="mb-10">
                <div>
                    <div class="subject" style="float: left; margin-right: 10px;">${
                      language["1000051"][activeLanguage]
                    }:</div>
                    <div class="ml-10">${formatDate(response.initialDate)}</div>
                </div><p style="display: inline-block;"> </p>
                <div>
                    <div class="subject" style="float: left; margin-right: 10px;">${
                      language["1000052"][activeLanguage]
                    }:</div>
                    <div class="ml-10">${response.purchaserInfo.phone}</div>
                </div><p style="display: inline-block;"> </p>
                <div>
                    <div class="subject" style="float: left; margin-right: 10px;">${
                      language["1000086"][activeLanguage]
                    }:</div>
                    <div class="ml-10">${shippingInfo}</div>
                </div>
            </div><hr />
            <strong>${language["1000053"][activeLanguage]} :</strong><br>
            `;
      $.each(response.orderProducts, function (index, item) {
        content +=
          (item.productName.length > 100
            ? item.productName.substring(0, 100) + "..."
            : item.productName) +
          " (" +
          item.quantity +
          ") <div style='display:inline-block; margin-top: 5px;'><span class='price' title='Ürün fiyatı'> <strong> $" +
          (item.quantity * item.estimatedPurchasePrice).toFixed(2) +
          " </strong></span> ";
        if (item.hasCoupon) {
          content +=
            " &nbsp;<span class='price' style='background-color:#00adff; margin-left:3px; border: 1px solid green; color: green; background-color: #ffffff;' title='Kupon indirimi'> <i class='fa fa-tag'></i> <strong>" +
            item.couponDiscountType +
            item.couponDiscountValue +
            " </strong></span> ";
        }
        content += "</div><br><br>";
      });

      var profit = 0;
      var profitUsd = 0;
      var profitText =
        '<span id="sfOrderProfit" class="price" style="display:inline-block; background-color:#00adff; margin-left:3px; border: 1px solid green; color: green; background-color: #ffffff;"> <strong> % ' +
        profit +
        " </strong></span>";
      var profitUsdText =
        '<span id="sfOrderProfitUsd" class="price" style="display:inline-block; background-color:#00adff; margin-left:5px; border: 1px solid green; color: green; background-color: #ffffff;"> <strong> ' +
        profitUsd +
        " $ </strong></span>";
      content += `<hr />
                <div id="sfOrderProfitDiv" style="display: none" class="mb-10">
                    <div>
                        <div class="subject" style="float: left; margin-right: 10px; margin-top: -1px;">${language["1000025"][activeLanguage]}:</div>
                        <div class="ml-10" style:"">${profitText} ${profitUsdText}</div>
                    </div><hr />
                </div>`;

      $("#sfOrderDetails").html(content);
      $("#sfAutoContinue").prop(
        "checked",
        response.isAutoPilotOn ? "checked" : ""
      );
    }
  }, 1e3);
}

function getFilters(customerMarketplaceId) {
  $.ajax({
    type: "GET",
    url:
      user.apiSubdomain +
      "api/CustomerMarketplaceFilters/GetCustomerMarketplaceFilters?customerMarketplaceId=" +
      customerMarketplaceId,
    headers: { Authorization: "Bearer " + user.token },
    success: function (response) {
      var divFilters = "";

      response.sort(function (a, b) {
        return a.filterId - b.filterId;
      });

      $.each(response, function (index, value) {
        divFilters += `<hr>
                <div class="flex ai-c jc-sb mb-10">
                    <div>
                        ${value.filterId}-${value.filterName}
                    </div>
                    <div>
                        <select name="sfFilter-${value.id}-${
          value.filterName
        }" id="sfFilter-${value.filterId}">
                        <option value="0" ${
                          value.filterStatus == 0 ? "selected" : ""
                        }>${language["1000057"][activeLanguage]}</option>
                        <option value="1" ${
                          value.filterStatus == 1 ? "selected" : ""
                        }>${language["1000058"][activeLanguage]}</option>
                        <option value="2" ${
                          value.filterStatus == 2 ? "selected" : ""
                        }>${language["1000059"][activeLanguage]}</option>
                        </select>
                    </div>
                </div> `;

        if (value.filterValue > 0) {
          divFilters += `<div class="flex jc-end "><input type="text" name="sfFilterInput-${value.filterName}" id="sfFilterInput-${value.filterId}" value="${value.filterValue}" style="margin-bottom: 15px;"></div> `;
        }
      });

      $("#sfFilters").html(divFilters);
    },
    failure: function () {
      $("#sfFilters").html(language["1000060"][activeLanguage]);
    },
  });
}

function getMarketPlaces() {
  $.ajax({
    type: "GET",
    url: `${baseUrl}${endPoints.Store.stores}`,
    headers: { Authorization: "Bearer " + user.token },
    success: function (response) {
      var divMarketPlaces = `<select name="sfMarketPlace" id="sfMarketPlace" style="width:210px;">`;

      $.each(response, function (index, value) {
        divMarketPlaces += `<option value="${value.id}">${value.name} (${value.country})</option>`;
      });

      divMarketPlaces += "</select>";

      $("#sfMarketPlaces").html(divMarketPlaces);

      $("#sfMarketPlace").on("change", function () {
        if (this.value == undefined) {
          $("#sfMarketPlaces").selectedIndex = 0;
        }
      });

      $("#sfMarketPlaces").selectedIndex = 0;
      $("#sfMarketPlace").trigger("change");
    },
    failure: function (response) {
      console.log("Marketplace bilgileri alınamadı!", response);
    },
  });
}

function getMarketPlacesForBuyer() {
  $.ajax({
    type: "GET",
    url: `${baseUrl}${endPoints.Store.stores}`,
    headers: { Authorization: "Bearer " + user.token },
    success: function (response) {
      var divMarketPlaces = `<select name="sfMarketPlace" id="sfMarketPlace" style="width:210px;">`;

      $.each(response, function (index, value) {
        divMarketPlaces += `<option value="${value.id}">${value.name} (${value.country})</option>`;
      });

      divMarketPlaces += "</select>";

      $("#stores-for-buyer").html(divMarketPlaces);

      $("#stores-for-buyer").on("change", function () {
        if (this.value == undefined) {
          $("#stores-for-buyer").selectedIndex = 0;
        }
      });

      $("#stores-for-buyer").selectedIndex = 0;
      $("#stores-for-buyer").trigger("change");
    },
    failure: function (response) {
      console.log("Marketplace bilgileri alınamadı!", response);
    },
  });
}

var stopAsinSearch = false;
var fullAsinList = [];

var totalAsinCount = 0;
var totalPageCount = 0;

function createSearchPageItems() {
  getMarketPlaces();

  var sfButton = `
    <button id="sfButton" style="z-index: 999999; position: fixed; width:70px; height: 70px; bottom: 10px; right: 10px;
    background: none; border: none;  display: inline-block">
        <img src=${chrome.runtime.getURL(
          "img/sf_extension.svg"
        )} style="width: 90px;">
    </button>`;
  $("body").prepend(sfButton);

  var maxPageLimit = 400;
  var maxPageLimitDesc = language["1000062"][activeLanguage];
  if (location.href.includes("?me=") || location.href.includes("&me=")) {
    maxPageLimit = 170;
    maxPageLimitDesc = maxPageLimitDesc.replaceAll("400", "170");
  }

  var div = `
    <div id="sfContainer" class="sfContainer-bg" style="display: none;">
        <div class="sfContainer-top">
            <div class="flex ai-c jc-sb" style="height:42px;padding: 0 0 0 15px;">
                <div class="flex ai-c">
                    <i class="fas fa-user"></i>
                    <span class="ml-15">${user.name}</span>
                </div>
                <div>
                    <button class="yellow-button" id="sf-hide" style="width:30px; font-weight:bold;">${language["1000070"][activeLanguage]}</button>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="title">${language["1000061"][activeLanguage]}</div>
            <div class="flex ai-c jc-sb mb-10">
                <div>
                    ${language["1000128"][activeLanguage]}<br>
                    <span class="soft">${maxPageLimitDesc}</span>
                </div>
                <div class="flex ai-c jc-end">
                    <input type="text" id="sfPageCountMin" value="1" />
                    <input type="text" id="sfPageCountMax" value=" ${maxPageLimit}"/>
                </div>
            </div>
            <div class="flex">
                <label for="sfSponsored"><input type="checkbox" style="width:15px; margin-top:-10px" id="sfSponsored" name="sfSponsored" value="${language["1000104"][activeLanguage]}"> ${language["1000104"][activeLanguage]} </label><br>
            </div>
            <div id="sfCouponDiscountDiv" class="flex">
                <label for="sfCouponDiscount"><input type="checkbox" style="width:15px; margin-top:-10px" id="sfCouponDiscount" name="sfCouponDiscount" value="${language["1000143"][activeLanguage]}"> ${language["1000143"][activeLanguage]} </label><br>
            </div>
            <div class="flex ai-c jc-sb mb-10">
                <div>
                    ${language["1000129"][activeLanguage]}
                </div>
                <div class="flex ai-c jc-end">
                    <input type="text" id="sfPriceMin" placeholder="${language["1000132"][activeLanguage]}" maxLength="8" class="sfDecimal" />
                    <input type="text" id="sfPriceMax" placeholder="${language["1000133"][activeLanguage]}" maxLength="8"  class="sfDecimal" />
                </div>
            </div>
            <div class="flex ai-c jc-sb mb-10">
                <div>
                    ${language["1000130"][activeLanguage]}<br>
                    <span class="soft">${language["1000138"][activeLanguage]}</span>
                </div>
                <div class="flex ai-c jc-end">
                    <input type="text" id="sfStarsMin" placeholder="${language["1000134"][activeLanguage]}" maxLength="3" class="sfDecimal" value="3.5" />
                    <input type="text" id="sfStarsMax" placeholder="${language["1000135"][activeLanguage]}" maxLength="3" class="sfDecimal"/>
                </div>
            </div>

            <div class="flex ai-c jc-sb mb-10">
                <button class="red-button small-button" id='sfClearFilters' style="width:100%;border-raidus:9px;margin:2px;">
                ${language["1000139"][activeLanguage]}</button>
            </div>

            <div class="flex ai-c jc-sb mb-10">
                <button class="light-blue-button small-button" id='sfSaveFilters' style="width:100%;border-raidus:9px;margin:2px;height: 34px;
                font-size: 12px;">
                ${language["1000175"][activeLanguage]}</button>
            </div>

            <div class="flex ai-c jc-sb mb-10">
                <div style="width: 100px;
                margin-left: 6px;">
                ${language["1000174"][activeLanguage]}
                </div>
                <div id="sfFilterSelect" style="margin-right: 60px;">
                </div>
                <div>
                  <button
                  id='sfDeleteFilterButton'
                  title="${language["1000177"][activeLanguage]}"
                  style="
                  background-color: white;
                  border-color: #d51f31;
                  border-radius: 4px;
                  color: #d51f31;
                  ">
                    ${language["1000176"][activeLanguage]}
                  </button>
                </div>
            </div>

            <div class="description">
                    <p>
                    ${language["1000064"][activeLanguage]}
                    </p>
            </div>
            <div class="nested-content" style="margin-top: 10px;">
                <div class="flex ai-c jc-sb mb-10">
                    <div>
                    ${language["1000065"][activeLanguage]}
                    </div>
                    <div>
                        <input type="text" id="sfPrefix" value="" placeholder="SF" maxLength="20"  />
                    </div>
                </div>
                <div class="flex ai-c jc-sb mb-10">
                    <div>
                    ${language["1000063"][activeLanguage]}:
                    </div>
                    <div id='sfMarketPlaces'>  </div>
                </div>
                <div id='sfFilters'>  </div>
            </div>
            <div class="nested-content" style="margin-top: 10px;">
                <div class="flex">
                    <button class="yellow-button" id='sfStartSearch' style="width:50%;border-raidus:9px;margin-right:2px;">
                    ${language["1000066"][activeLanguage]}</button>

                    <button class="red-button" id='sfStopSearch' style="width:50%;border-raidus:9px;margin-left:2px;">
                    ${language["1000067"][activeLanguage]}</button>
                    <br>
                </div>
                <div id="sfSavingInfo" style="color: #fff;">
                </div>
                <div class="flex">
                    <button class="blue-button" id='sfSaveASINsButton' style="width:100%;margin-top:4px;" disabled>
                    ${language["1000068"][activeLanguage]} </button>
                </div>
            </div>
            <div id="sfSaveAsinDescription" class="description" style="display: none; margin-top:10px;">
                <p>
                    <i class="fas fa-check"></i> ${language["1000105"][activeLanguage]}
                </p>
            </div>
        </div>

    </div> `;

  $("body").append(div);

  if (location.href.includes("?me=") || location.href.includes("&me=")) {
    $("#sfCouponDiscountDiv").hide();
  }

  $("#sfButton").click(function () {
    $("#sfContainer").show();
    $("#sfButton").hide();
  });
  $("#sf-hide").click(function () {
    $("#sfContainer").hide();
    $("#sfButton").show();
  });

  $("#sfPrefix").bind("keyup", function () {
    $("#sfPrefix").val(
      $("#sfPrefix")
        .val()
        .replace(/[^a-z0-9]/gi, "")
    );
  });

  $("#sfPageCountMin").bind("keyup", function () {
    $("#sfPageCountMin").val(
      $("#sfPageCountMin")
        .val()
        .replace(/[^.0-9]/gi, "")
    );
  });
  $("#sfPageCountMax").bind("keyup", function () {
    $("#sfPageCountMax").val(
      $("#sfPageCountMax")
        .val()
        .replace(/[^0-9]/gi, "")
    );
  });
  $("#sfPriceMin").bind("keyup", function () {
    $("#sfPriceMin").val(
      $("#sfPriceMin")
        .val()
        .replace(/[^.0-9]/gi, "")
    );
  });
  $("#sfPriceMax").bind("keyup", function () {
    $("#sfPriceMax").val(
      $("#sfPriceMax")
        .val()
        .replace(/[^.0-9]/gi, "")
    );
  });
  $("#sfStarsMin").bind("keyup", function () {
    $("#sfStarsMin").val(
      $("#sfStarsMin")
        .val()
        .replace(/[^.0-9]/gi, "")
    );

    if ($("#sfStarsMin").val()) {
      var v = $("#sfStarsMin").val() * 1.0;
      if (v > 5) {
        $("#sfStarsMin").val("5.0");
      } else if (v < 1) {
        $("#sfStarsMin").val("1.0");
      }
    }
  });
  $("#sfStarsMax").bind("keyup", function () {
    $("#sfStarsMax").val(
      $("#sfStarsMax")
        .val()
        .replace(/[^.0-9]/gi, "")
    );

    if ($("#sfStarsMax").val()) {
      var v = $("#sfStarsMax").val() * 1.0;
      if (v > 5) {
        $("#sfStarsMax").val("5.0");
      } else if (v < 1) {
        $("#sfStarsMax").val("1.0");
      }
    }
  });

  $("#sfClearFilters").click(function () {
    $("#sfPriceMin").val("");
    $("#sfPriceMax").val("");
    $("#sfStarsMin").val("");
    $("#sfStarsMax").val("");
  });

  $("#sfDeleteFilterButton").click(async function () {
    const selectedFilterSettingId = parseInt($("#sfFilterOptions")[0].value);

    const filterName = confirm(language["1000167"][activeLanguage]);
    if (!filterName) return;

    let postModel = {
      buySponsoredProducts: $("#sfSponsored").is(":checked"),
      buyCouponDiscountProducts: $("#sfCouponDiscount").is(":checked"),
      minPrice: parseFloat($("#sfPriceMin").val()),
      maxPrice: parseFloat($("#sfPriceMax").val()),
      minStar: parseFloat($("#sfStarsMin").val()),
      maxStar: parseFloat($("#sfStarsMax").val()),
      minReviewCount: 0,
      maxReviewCount: 0,
      extensionFilterSettingId: selectedFilterSettingId,
      filterName: "delete",
      isActive: false,
    };

    let fetchHeaders = new Headers();
    fetchHeaders.append("Content-Type", "application/json");
    fetchHeaders.append("Accept", "application/json, text/plain, */*");
    fetchHeaders.append("Authorization", `Bearer ${user.token}`);

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(postModel),
      headers: fetchHeaders,
    };

    const result = await fetch(
      user.apiSubdomain + "api/extensionfiltersetting/createorupdate",
      fetchOptions
    );

    let resultText = "";
    let colorCode = "";

    if (result.status === 200) {
      resultText = language["1000178"][activeLanguage];
      colorCode = "#98efad";
      getFilterSettingAsync();
    } else {
      resultText = language["1000162"][activeLanguage];
      colorCode = "#e54949";
    }

    var snackbar = $("#snackbar")[0];
    // Add the "show" class to DIV

    snackbar.className = "show";
    snackbar.textContent = resultText;
    snackbar.style.backgroundColor = colorCode;
    snackbar.style.color = "black";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
  });

  $("#sfSaveFilters").click(async function () {
    const selectedFilterSettingId = parseInt($("#sfFilterOptions")[0].value);

    let tempFilterName = "update";

    if (selectedFilterSettingId === 0) {
      const filterName = prompt(language["1000173"][activeLanguage]);
      if (!filterName) return;

      tempFilterName = filterName;
    }

    let postModel = {
      buySponsoredProducts: $("#sfSponsored").is(":checked"),
      buyCouponDiscountProducts: $("#sfCouponDiscount").is(":checked"),
      minPrice: parseFloat($("#sfPriceMin").val()),
      maxPrice: parseFloat($("#sfPriceMax").val()),
      minStar: parseFloat($("#sfStarsMin").val()),
      maxStar: parseFloat($("#sfStarsMax").val()),
      minReviewCount: 0,
      maxReviewCount: 0,
      extensionFilterSettingId: selectedFilterSettingId,
      filterName: tempFilterName,
      isActive: true,
    };

    let fetchHeaders = new Headers();
    fetchHeaders.append("Content-Type", "application/json");
    fetchHeaders.append("Accept", "application/json, text/plain, */*");
    fetchHeaders.append("Authorization", `Bearer ${user.token}`);

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(postModel),
      headers: fetchHeaders,
    };

    const result = await fetch(
      user.apiSubdomain + "api/extensionfiltersetting/createorupdate",
      fetchOptions
    );

    let resultText = "";
    let colorCode = "";

    if (result.status === 200) {
      resultText = language["1000171"][activeLanguage];
      colorCode = "#98efad";
      getFilterSettingAsync();
    } else {
      resultText = language["1000162"][activeLanguage];
      colorCode = "#e54949";
    }

    var snackbar = $("#snackbar")[0];
    snackbar.className = "show";
    snackbar.textContent = resultText;
    snackbar.style.backgroundColor = colorCode;
    snackbar.style.color = "black";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
  });

  $("#sfStartSearch").click(function () {
    $("#sfStartSearch").prop("disabled", true);
    $("#sfStartSearch").text(language["1000007"][activeLanguage]);
    $("#sfSaveASINsButton").prop("disabled", true);
    $("#sfSaveASINsButton").text(language["1000007"][activeLanguage]);
    $("#sfSaveAsinDescription").hide();

    fullAsinList = [];
    stopAsinSearch = false;
    totalAsinCount = 0;
    totalPageCount = 0;
    // Get all ASINs in given number of pages and send them to api
    var pageCountMin = $("#sfPageCountMin").val() * 1;
    var pageCountMax = $("#sfPageCountMax").val() * 1;

    $("#sfSavingInfo").css({
      background: "green",
      margin: "10px 0",
      padding: "10px",
    });
    $("#sfSavingInfo").html(language["1000007"][activeLanguage]);

    if (pageCountMax < pageCountMin) {
      $("#sfSavingInfo").html(language["1000069"][activeLanguage]);
      $("#sfSavingInfo").css({
        background: "red",
        margin: "10px 0",
        padding: "10px",
      });

      triggerClick("#sfStopSearch");
      return;
    }

    getASINsFromPage(location.href + "&page=" + pageCountMin);
  });

  $("#sfStopSearch").click(function () {
    stopAsinSearch = true;
    $("#sfStartSearch").prop("disabled", false);
    $("#sfStartSearch").text(language["1000066"][activeLanguage]);

    $("#sfSaveASINsButton").prop("disabled", false);
    $("#sfSaveASINsButton").text(language["1000068"][activeLanguage]);

    $("#sfSaveAsinDescription").hide();
  });

  $("#sfSaveASINsButton").click(function () {
    $("#sfSaveASINsButton").prop("disabled", true);
    $("#sfSaveASINsButton").text(language["1000007"][activeLanguage]);
    $("#sfSaveAsinDescription").hide();

    var pageCountMin = $("#sfPageCountMin").val();
    var pageCountMax = $("#sfPageCountMax").val();

    var prefix = $("#sfPrefix").val();
    var selectedStoreId = $("#sfMarketPlace").val();

    saveProductSearchInfo(pageCountMin * 1, pageCountMax * 1);
    $("#sfSavingInfo").text(language["1000071"][activeLanguage]);
    $("#sfSavingInfo").css({
      background: "cornflowerblue",
      margin: "10px 0",
      padding: "10px",
    });

    saveAsinList(prefix, fullAsinList, selectedStoreId);
  });
}

function getASINsFromPage(pageUrl) {
  $.ajax({
    type: "GET",
    url: pageUrl,
    success: function (data) {
      if (stopAsinSearch) {
        return;
      }
      var content = $(data);
      if (content.find("form[action='/errors/validateCaptcha']").length) {
        return;
      }
      var asinList = [];

      $("div.s-main-slot.s-result-list.s-search-results.sg-row", data)
        .children("div")
        .each(function () {
          // API CALL : SaveASIN
          var asin = $(this).attr("data-asin");
          if (asin != undefined && asin.length) {
            var ratingDiv = $(this).find(
              "div.a-spacing-base div.a-row.a-size-small:not(.a-color-secondary)"
            );
            if (ratingDiv) {
              ratingDiv = $(this).find(
                "div.a-section.a-spacing-none.a-spacing-top-micro"
              );
            }
            var stars = ratingDiv
              .find(".a-icon.a-icon-star-small")
              .text()
              .split(" ")[0];
            var price =
              $(this).find("span.a-price-whole").text().replace(/\D/g, "") +
              "." +
              $(this).find("span.a-price-fraction").text().replace(/\D/g, "");
            price = price * 1.0;

            if ($("input#sfCouponDiscount").is(":checked")) {
              var couponDiscount = $(this).find("span[class^='s-coupon-']");
              if (!couponDiscount.length) {
                return;
              }
            }

            if ($("#sfPriceMin").val()) {
              var minPrice = $("#sfPriceMin").val() * 1.0;
              if (!price || price < minPrice) {
                return;
              }
            }
            if ($("#sfPriceMax").val()) {
              var maxPrice = $("#sfPriceMax").val() * 1.0;
              if (!price || price > maxPrice) {
                return;
              }
            }

            if ($("#sfStarsMin").val()) {
              var minStar = $("#sfStarsMin").val() * 1.0;
              if (!stars || stars < minStar) {
                return;
              }
            }
            if ($("#sfStarsMax").val()) {
              var maxStar = $("#sfStarsMax").val() * 1.0;
              if (!stars || stars > maxStar) {
                return;
              }
            }

            if ($("input#sfSponsored").is(":checked")) {
              asinList.push(asin);
            } else {
              if ($(this).find(".s-sponsored-label-info-icon").length) {
              } else if (
                $(this).text().includes("Sponsored") ||
                $(this).text().includes("Patrocinado")
              ) {
              } else {
                asinList.push(asin);
              }
            }
          }
        });

      asinList = $.distinct(asinList);

      if (!stopAsinSearch) {
        fullAsinList = $.merge(fullAsinList, asinList);
        fullAsinList = $.distinct(fullAsinList);

        totalPageCount = totalPageCount + 1;
        totalAsinCount = fullAsinList.length;

        $("#sfSavingInfo").text(
          totalPageCount +
            language["1000072"][activeLanguage] +
            totalAsinCount +
            language["1000073"][activeLanguage]
        );

        var curPageNo = parseInt(
          content.find(".s-pagination-strip .s-pagination-selected").text()
        );

        var max = $("#sfPageCountMax").val();

        var maxPageLimit = 400;
        if (location.href.includes("?me=") || location.href.includes("&me=")) {
          maxPageLimit = 170;
        }

        if (max > maxPageLimit) {
          $("#sfPageCountMax").val(maxPageLimit);
          max = maxPageLimit;
        }
        if (curPageNo < max) {
          if (content.find("a.s-pagination-next.s-pagination-button").length) {
            getASINsFromPage(
              content
                .find("a.s-pagination-next.s-pagination-button")
                .attr("href")
            );
          } else {
            $("#sfStartSearch").prop("disabled", false);
            $("#sfStartSearch").text(language["1000066"][activeLanguage]);

            $("#sfSaveASINsButton").prop("disabled", false);
            $("#sfSaveASINsButton").text(language["1000068"][activeLanguage]);
          }
        } else {
          $("#sfStartSearch").prop("disabled", false);
          $("#sfStartSearch").text(language["1000066"][activeLanguage]);

          $("#sfSaveASINsButton").prop("disabled", false);
          $("#sfSaveASINsButton").text(language["1000068"][activeLanguage]);
        }
      }
    },
    complete: async function (data) {
      if (data.status == 503) {
        await delay(1000);
        getASINsFromPage(pageUrl);
      }
    },
  });
}

function saveAsinList(prefix, asinList, storeId) {
  $.ajax({
    type: "POST",
    url: `${baseUrl}${endPoints.StoreProduct.storeProducts}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
      sku: prefix,
      asinList: asinList,
      storeId: storeId,
    }),
    headers: { Authorization: "Bearer " + user.token },
    success: function (response) {
      if (response.addInventoryItemResult == 0) {
        // Added
        $("#sfSavingInfo").text(language["1000074"][activeLanguage]);
        $("#sfSavingInfo").css({
          background: "green",
          margin: "10px 0",
          padding: "10px",
        });
        $("#sfSaveAsinDescription").show();
      } else if (response.addInventoryItemResult == 1) {
        // NotAdded
        $("#sfSavingInfo").text(language["1000121"][activeLanguage]);
        $("#sfSavingInfo").css({
          background: "red",
          margin: "10px 0",
          padding: "10px",
        });
      } else if (response.addInventoryItemResult == 2) {
        // PartiallyAdded
        $("#sfSavingInfo").html(
          language["1000122"][activeLanguage] +
            "<br>" +
            language["1000124"][activeLanguage] +
            response.differenceCount
        );
        $("#sfSavingInfo").css({
          background: "orange",
          margin: "10px 0",
          padding: "10px",
        });
        $("#sfSaveAsinDescription").show();
      } else if (response.addInventoryItemResult == 3) {
        // InsertLimitExceeded
        $("#sfSavingInfo").text(language["1000123"][activeLanguage]);
        $("#sfSavingInfo").css({
          background: "red",
          margin: "10px 0",
          padding: "10px",
        });
      }

      $("#sfSaveASINsButton").prop("disabled", false);
      $("#sfSaveASINsButton").text(language["1000068"][activeLanguage]);
    },
    failure: function () {
      $("#sfSavingInfo").text(language["1000075"][activeLanguage]);
      $("#sfSaveASINsButton").text(language["1000068"][activeLanguage]);
      $("#sfSaveASINsButton").prop("disabled", false);
    },
    complete: function (data) {
      if (data.status == 200) {
        // Added
        $("#sfSavingInfo").text(language["1000074"][activeLanguage]);
        $("#sfSavingInfo").css({
          background: "green",
          margin: "10px 0",
          padding: "10px",
        });
        $("#sfSaveAsinDescription").show();
      } else {
        $("#sfSavingInfo").text(language["1000075"][activeLanguage]);
        $("#sfSavingInfo").css({
          background: "red",
          margin: "10px 0",
          padding: "10px",
        });
        $("#sfSaveASINsButton").text(language["1000068"][activeLanguage]);
        $("#sfSaveASINsButton").prop("disabled", false);
      }
      $("#sfSaveASINsButton").prop("disabled", false);
      $("#sfSaveASINsButton").text(language["1000068"][activeLanguage]);
    },
  });
}

function saveProductSearchInfo(fromPage, toPage) {
  var customerMarketPlaceId = $("#sfMarketPlace")[0].value * 1;

  var datetime = getDateTime();

  var searchWord = location.href.split("k=").pop().split("&")[0];

  $.ajax({
    type: "POST",
    url: user.apiSubdomain + "api/ProductSearchInfo/AddProductSearchInfo",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
      customerMarketPlaceId: customerMarketPlaceId,
      searchURL: location.href,
      searchWord: searchWord,
      fromPage: fromPage,
      toPage: toPage,
      createDate: datetime,
    }),
    headers: { Authorization: "Bearer " + user.token },
    success: function () {
      console.log("Product Search Info Saved!");
    },
    failure: function (response) {
      console.log("Product Search Info can not be saved", response);
    },
  });
}

function getShortDateTime(addedDays) {
  var now = new Date();
  now.setDate(now.getDate() + addedDays);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();

  if (month.toString().length == 1) {
    month = "0" + month;
  }
  if (day.toString().length == 1) {
    day = "0" + day;
  }
  var dateTime = year + "-" + month + "-" + day;
  return dateTime;
}

function createSellerFlashMenu(loggedIn) {
  var divMenu = "";
  var panelLink = "https://x-test.sellerfull.com/";

  if (loggedIn) {
    var msg = "";
    if (
      location.hostname.includes("amazon") ||
      location.hostname.includes("sellerfull")
    ) {
      msg = language["1000055"][activeLanguage];
    } else {
      msg = language["1000056"][activeLanguage];
    }

    divMenu = `
            <div id="sfMenu" class="sfMenu-bg" style="display: none;">
                <div class="flex ai-c jc-sa" style="margin-top:15px;">
                    <img src=${chrome.runtime.getURL("img/logo_new.svg")}>
                    <span>+</span>
                    <img src=${chrome.runtime.getURL("img/chrome.svg")}>
                </div>
                <p id="demo"></p>
                <div class="flex ai-c jc-center">
                    <button class="yellow-button"><a href='${panelLink}'>${
      language["1000076"][activeLanguage]
    }</a></button>
                </div>
                <div class="list-title">${
                  language["1000078"][activeLanguage]
                };</div>
                <ul class="list">
                    <li>${language["1000079"][activeLanguage]}</li>
                    <li>${language["1000080"][activeLanguage]}</li>
                    <li>${language["1000081"][activeLanguage]}</li>
                    <li>${language["1000082"][activeLanguage]}</li>
                    <li>${language["1000083"][activeLanguage]}</li>
                </ul>
                <div class="bottom-area">

                    <div class="flex ai-c jc-sb" style="height:42px;padding: 0 15px;">
                        <div class="flex ai-c">
                            <i class="fas fa-cog"></i>
                            <a href="${panelLink}/storeSettings" class="ml-10" target="_blank" style="color:black">${
      language["1000045"][activeLanguage]
    }</a>
                        </div>
                    </div>
                    <div class="flex ai-c jc-sb" style="height:42px;padding: 0 15px;">
                    <div class="flex ai-c">
                        <i class="fas fa-user"></i>
                        <span class="ml-10">${user.name}</span>
                    </div>
                    <div>
                        <img id="sf-languangeButton" src="${chrome.runtime.getURL(
                          "img/" + `${activeLanguage}` + ".png"
                        )}" style="width: 24px;cursor: pointer;" />
                        <button id="sf-logout" title="${
                          language["1000054"][activeLanguage]
                        }" class="logout-button" style="margin-left: 5px;display: inline-block;">
                            <i class="fas fa-power-off"></i>
                        </button>

                    </div>
                </div>
                </div>
                <div>

            </div> `;
  } else {
    divMenu = `
            <div id="sfMenu" class="sfMenu-bg" style="display: none; height:240px;">
                <div class="flex ai-c jc-sa" style="margin-top:15px;">
                    <img src=${chrome.runtime.getURL("img/logo_new.svg")}>
                    <span>+</span>
                    <img src=${chrome.runtime.getURL("img/chrome.svg")}>
                </div>

                <div class="list-title" style="margin-top:50px">  ${
                  language["1000084"][activeLanguage]
                } <a href='${panelLink}'>${
      language["1000085"][activeLanguage]
    }</a>. </div>

                <div class="bottom-area" style="height:42px;padding: 0 10px;">
                    <div class="flex ai-c jc-end" style="height: 100%;">
                        <img id="sf-languangeButton" src="${chrome.runtime.getURL(
                          "img/" + `${activeLanguage}` + ".png"
                        )}" style="width: 24px;cursor: pointer;" />
                    </div>
                </div>
                <div>

            </div> `;
  }

  $("body").append(divMenu);
  $("#btnSfWebsite").click(function seeOnSfClicked() {
    window.open(panelLink);
  });
  $("#sf-languangeButton").click(function () {
    changeLanguage();
  });
}

function changeLanguage() {
  if (activeLanguage == "TR") {
    activeLanguage = "EN";
  } else {
    activeLanguage = "TR";
  }

  activeLanguage = localStorage.setItem("activeLanguage", activeLanguage);
  location.reload();
}

chrome.extension.onMessage.addListener(function (msg) {
  if (msg.action == "popup-click") {
    $("#sfMenu").toggle();
  } else if (msg.action == "checkOrderId") {
    checkOrderIdAttempt = checkOrderIdAttempt + 1;

    var purchaseId = msg.purchaseId;
    var email = msg.email
      .replaceAll("Message and Data rates may apply.", "")
      .trim();
    var el = $("<div></div>");
    el.html(msg.content);

    if ($("#ordersContainer", el).length) {
      if ($("#ordersContainer", el).text().includes("No results found")) {
        //Not yet
      } else {
        chromeGetOrderDetails();

        var f = $(el).find("#ordersContainer .js-order-card").first(),
          buyerOrderId = f.find(".actions.a-col-right .value").text().trim();

        if (orderDetails == null || orderDetails == undefined) {
          return;
        }

        var buyerPrice = orderDetails.purchasePrice;

        if (buyerPrice == null || buyerPrice == undefined || buyerPrice == "") {
          buyerPrice = f.find(".a-col-left .a-span2 .value").text().trim();
        }

        if (buyerPrice == null || buyerPrice == undefined || buyerPrice == "") {
          buyerPrice = "0";
        }

        var asinList = [];
        f.find(".a-box-inner")
          .find(".a-link-normal")
          .each(function () {
            var asin = $(this)
              .attr("href")
              .split("/gp/product/")
              .pop()
              .split("/")[0];
            if (
              asin != undefined &&
              asin != null &&
              asin != "" &&
              !asinList.includes(asin)
            ) {
              asinList.push(asin);
            }
          });

        if (asinList.length <= 0) {
          var links = f.html().split("/gp/product/");
          for (let index = 0; index < links.length; index++) {
            var asin = links[index].split("/")[0];
            if (
              asin != undefined &&
              asin != null &&
              asin != "" &&
              !asinList.includes(asin)
            ) {
              asinList.push(asin);
            }
          }
        }

        if (buyerOrderId.length <= 0) {
          buyerOrderId = f
            .html()
            .split('<bdi dir="ltr">')
            .pop()
            .split("</bdi>")[0];
        }

        tmpBuyerOrderId = buyerOrderId;

        var sellerOrderId = orderDetails.amazonOrderId;
        tmpSellerOrderId = sellerOrderId;

        buyerOrderId = buyerOrderId
          .replaceAll(orderDetails.amazonOrderId, "")
          .trim();
        buyerPrice = buyerPrice.replaceAll("CDN", "").trim();

        var data = JSON.stringify({
          sellerAmazonOrderId: sellerOrderId,
          buyerAmazonOrderId: buyerOrderId,
          purchasePrice: buyerPrice,
          buyerEmail: email,
          // purchasedAsinList: asinList,
        });
        // - update as purchased
        $.ajax({
          url: `${baseUrl}${endPoints.Order.updateAsPurchased}`,
          type: "PUT",
          data: data,
          contentType: "application/json;charset=utf-8",
          headers: { Authorization: "Bearer " + user.token },
          success: function () {
            localStorage.removeItem("orderDetails");
            localStorage.removeItem("sfOrderDetailsPrimeDiscount");
            localStorage.removeItem("sfOrderDetailsDealDiscount");
          },
          complete: function (data) {
            console.log("complete", data);
          },
        });

        localStorage.setItem("checkOrderIdInterval", purchaseId);
      }
    }
  } else if (msg.action == "checkEmptyOrderAdress") {
    if (!msg.succeed) {
      setTimeout(() => {
        var domain = "https://sellercentral.amazon.com";
        if (msg.countryCode == "JP")
          domain = "https://sellercentral.amazon.co.jp";
        else if (msg.countryCode == "SA")
          domain = "https://sellercentral.amazon.sa";
        else if (msg.countryCode == "CA")
          domain = "https://sellercentral.amazon.ca";
        else if (msg.countryCode == "DE")
          domain = "https://sellercentral.amazon.de";
        else if (msg.countryCode == "ES")
          domain = "https://sellercentral.amazon.es";
        else if (msg.countryCode == "FR")
          domain = "https://sellercentral.amazon.fr";
        else if (msg.countryCode == "UK")
          domain = "https://sellercentral.amazon.co.uk";
        else if (msg.countryCode == "AE")
          domain = "https://sellercentral.amazon.ae";
        else if (msg.countryCode == "MX")
          domain = "https://sellercentral.amazon.com.mx";
        else if (msg.countryCode == "IT")
          domain = "https://sellercentral-europe.amazon.com";
        else if (msg.countryCode == "NL")
          domain = "https://sellercentral.amazon.nl";
        else if (msg.countryCode == "PL")
          domain = "https://sellercentral.amazon.pl";
        else if (msg.countryCode == "SE")
          domain = "https://sellercentral.amazon.se";
        else if (msg.countryCode == "SG")
          domain = "https://sellercentral.amazon.sg";
        else if (msg.countryCode == "AU")
          domain = "https://sellercentral.amazon.com.au";
        else if (msg.countryCode == "US")
          domain = "https://sellercentral.amazon.com";
        else if (msg.countryCode == "IN")
          domain = "https://sellercentral.amazon.in";
        else if (msg.countryCode == "EG")
          domain = "https://sellercentral.amazon.eg";
        else if (msg.countryCode == "TR")
          domain = "https://sellercentral.amazon.com.tr";

        $("#sfMessage").html(
          language["1000009"][activeLanguage] +
            ": " +
            msg.countryCode +
            " (" +
            msg.orderId +
            ") <br>" +
            language["1000115"][activeLanguage] +
            "<a href='" +
            domain +
            "'>" +
            language["1000085"][activeLanguage] +
            "</a>"
        );

        $("#sfCheckAddresses").prop("disabled", false);
      }, 2000);
    } else {
      setTimeout(() => {
        $("#sfMessage").text(language["1000091"][activeLanguage]);
        $("#sfCheckAddresses").prop("disabled", false);
      }, 2000);
    }
  } else if (msg.action == "newCheckOrderId") {
    checkOrderIdAttempt = checkOrderIdAttempt + 1;
    chromeGetOrderDetails();
    var email = msg.email
      .replaceAll("Message and Data rates may apply.", "")
      .trim();
    var purchaseId = msg.purchaseId;
    var el = $("<div></div>");
    el.html(msg.content);

    var o = el;
    (h = $(el).find(
      "#ordersContainer .js-order-card, .your-orders-content-container .js-order-card"
    )),
      (u = []);
    var w;
    var buyerOrderId, buyerPrice;

    $(h).each(function () {
      var s, e, i, h;
      try {
        var r = $(this),
          c = r
            .find(
              ".actions.a-col-right .value, .a-fixed-right-grid-col.a-col-right .a-color-secondary"
            )
            .last()
            .text()
            .trim(),
          t = r
            .find(".recipient .a-size-base span.a-declarative")
            .data("a-popover"),
          n = "";

        p = orderDetails.purchasePrice;

        if (p == null || p == undefined || p == "") {
          p = r
            .find(".a-col-left .a-span2 .value")
            .text()
            .trim()
            .replaceAll("$", "");
        }

        if (p == null || p == undefined || p == "") {
          p = "0";
        }

        if (t == undefined) {
          var l = r
              .find("div[id^='shipToInsertionNode-shippingAddress']")
              .first()
              .attr("id")
              .replace("shipToInsertionNode-shippingAddress-", ""),
            a = o
              .find("#shipToData-shippingAddress-" + l)
              .first()
              .text(),
            f = document.createElement("div");
          f.className = "recipient";
          f.innerHTML = a;
          t = $(f).find("span.a-declarative").data("a-popover");
          n =
            t != undefined && t.inlineContent
              ? $(t.inlineContent).text().trim()
              : $(f).find(".a-popover-preload").text().trim();
        } else t.inlineContent ? (n = $(t.inlineContent).text().trim()) : ((s = $(".recipient .a-size-base div.a-popover-preload")), (n = s.text().trim()));
        n.indexOf("Phone") > -1 && (w = !0);
        n = n.replaceAll("<br>", " ");
        n = n.replaceAll("\n", " ");
        n = n.replaceAll(",", " ");
        n = n.replaceAll("Phone:", " ");
        n = n.replace(/\s+/g, " ");
        e = r.find('a[href*="/gp/product/"], a[href*="/dp/"]').attr("href");
        i = e.match(new RegExp("/gp/product/(.*)/ref"));
        i == null && ((i = ""), (i = e.match(new RegExp("/dp/(.*)/?psc"))));
        n = n + " " + i[1].replace("?", "");
        h = {
          orderId: c,
          recipient: n,
          asin: i[1].replace("?", ""),
          price: p,
        };
        u.push(h);
      } catch (v) {
        console.log(v);
      }
    });

    e = countriesAll.find(
      (i) => i.countryCode == orderDetails.purchaserInfo.countryCode
    );

    r =
      orderDetails.purchaserInfo.name +
      " " +
      orderDetails.purchaserInfo.addressLine1 +
      " ";
    orderDetails.purchaserInfo.addressLine2 &&
      (r += orderDetails.purchaserInfo.addressLine2 + " ");
    orderDetails.purchaserInfo.countryCode != "SA" &&
      orderDetails.purchaserInfo.countryCode != "AE" &&
      orderDetails.purchaserInfo.city &&
      (r += orderDetails.purchaserInfo.city + " ");
    orderDetails.purchaserInfo.countryCode != "SA" &&
      orderDetails.purchaserInfo.countryCode != "AE" &&
      orderDetails.purchaserInfo.countryCode != "SG" &&
      orderDetails.purchaserInfo.stateOrRegion &&
      (r += orderDetails.purchaserInfo.stateOrRegion + " ");
    orderDetails.purchaserInfo.countryCode != "SA" &&
      orderDetails.purchaserInfo.countryCode != "AE" &&
      orderDetails.purchaserInfo.countryCode != "SG" &&
      orderDetails.purchaserInfo.postalCode &&
      (r += orderDetails.purchaserInfo.postalCode + " ");

    e.country && (r += e.country + " ");
    orderDetails.purchaserInfo.countryCode != "SA" &&
      w &&
      orderDetails.purchaserInfo.phone &&
      (r += orderDetails.purchaserInfo.phone + " ");
    orderDetails.orderProducts[0].asin &&
      (r += orderDetails.orderProducts[0].asin);

    r = r.replaceAll(",", " ");

    for (let index = 0; index < u.length; index++) {
      var similarityScore = similarity(u[index].recipient, r);
      u[index].similarityScore = similarityScore;
    }

    console.log("orderlar alındı", u);

    console.log("Similarity-API: ", r);

    for (let index = 0; index < u.length; index++) {
      if (u[index].similarityScore > 0.7) {
        buyerOrderId = u[index].orderId;
        buyerPrice = u[index].price;
        console.log(
          "Similarity-AMZ: ",
          u[index].recipient + " (%" + u[index].similarityScore * 100 + ")"
        );
        break;
      }
    }

    if (buyerOrderId) {
      buyerOrderId = buyerOrderId
        .replaceAll(orderDetails.amazonOrderId, "")
        .trim();
      buyerPrice = buyerPrice.replaceAll("CDN", "").trim();

      console.log("buyerOrderId", buyerOrderId);
      console.log("buyerPrice", buyerPrice);

      var asinList = [];

      for (let index = 0; index < orderDetails.orderProducts.length; index++) {
        var asin = orderDetails.orderProducts[index].asin;
        asinList.push(asin);
      }

      tmpBuyerOrderId = buyerOrderId;

      var sellerOrderId = orderDetails.amazonOrderId;
      tmpSellerOrderId = sellerOrderId;

      var data = JSON.stringify({
        sellerOrderId: sellerOrderId,
        buyerOrderId: buyerOrderId,
        purchasePrice: buyerPrice,
        buyerEmail: email,
        // purchasedAsinList: asinList,
      });

      $.ajax({
        url: `${baseUrl}${endPoints.Order.updateAsPurchased}`,
        type: "PUT",
        data: data,
        contentType: "application/json;charset=utf-8",
        headers: { Authorization: "Bearer " + user.token },
        success: function () {
          localStorage.removeItem("orderDetails");
          localStorage.removeItem("sfOrderDetailsPrimeDiscount");
          localStorage.removeItem("sfOrderDetailsDealDiscount");
        },
        complete: function (data) {
          console.log("complete", data);
        },
      });

      localStorage.setItem("checkOrderIdInterval", purchaseId);
    }
  }
});

function triggerClick(n, t) {
  setTimeout(function () {
    $(n).trigger("click");
  }, t * 1e3);
}

function submitForm(n, t) {
  setTimeout(function () {
    var el = document.getElementById(n);
    if (!el) {
      el = document.getElementsByName(n)[0];
    }
    el.submit();
  }, t * 1e3);
}

function simulateClick(n, t) {
  setTimeout(function () {
    var t = document.createEvent("MouseEvents");
    t.initMouseEvent("click", !0, !0);
    n.dispatchEvent(t);
  }, t * 1e3);
}

function similarity(n, t) {
  var r = n,
    u = t,
    i;
  return (n.length < t.length && ((r = t), (u = n)), (i = r.length), i == 0)
    ? 1
    : (i - editDistance(r, u)) / parseFloat(i);
}

function editDistance(n, t) {
  var r, u, f, i, e;
  for (
    n = n.toLowerCase(), t = t.toLowerCase(), r = [], u = 0;
    u <= n.length;
    u++
  ) {
    for (f = u, i = 0; i <= t.length; i++)
      u == 0
        ? (r[i] = i)
        : i > 0 &&
          ((e = r[i - 1]),
          n.charAt(u - 1) != t.charAt(i - 1) &&
            (e = Math.min(Math.min(e, f), r[i]) + 1),
          (r[i - 1] = f),
          (f = e));
    u > 0 && (r[t.length] = f);
  }
  return r[t.length];
}

function simulateEvents(n, t, i) {
  setTimeout(function () {
    var i = document.createEvent("MouseEvents");
    i.initEvent(t, !0, !0);
    if (n != undefined || n != null) {
      n.dispatchEvent(i);
    }
  }, i * 1e3);
}

function simulateInput(n, t) {
  var i = new Event("input");
  t != undefined && (n.value = t);
  n.dispatchEvent(i);
}

function getMarketplaceByPage() {
  var n = $(
    "#sc-mkt-picker-switcher-select option[selected], div.sc-mkt-switcher-form span.sc-mkt-picker-switcher-txt"
  )
    .text()
    .trim();
  return (
    (n == null || n == "") &&
      (n = $("#partner-switcher").data("marketplace_selection").trim()),
    getMarketplaceItemByDomain(n)
  );
}

function getMarketplaceItemByDomain(n) {
  var t = {
    AmazonMarketplaceId: "",
    MarketplaceId: 0,
  };
  return (
    n == "www.amazon.com" || n == "ATVPDKIKX0DER"
      ? ((t.AmazonMarketplaceId = "ATVPDKIKX0DER"), (t.MarketplaceId = 1))
      : n == "www.amazon.ca" || n == "A2EUQ1WTGCTBG2"
      ? ((t.AmazonMarketplaceId = "A2EUQ1WTGCTBG2"), (t.MarketplaceId = 2))
      : n == "www.amazon.com.mx" || n == "A1AM78C64UM0Y8"
      ? ((t.AmazonMarketplaceId = "A1AM78C64UM0Y8"), (t.MarketplaceId = 3))
      : n == "www.amazon.co.uk" || n == "A1F83G8C2ARO7P"
      ? ((t.AmazonMarketplaceId = "A1F83G8C2ARO7P"), (t.MarketplaceId = 4))
      : n == "www.amazon.de" || n == "A1PA6795UKMFR9"
      ? ((t.AmazonMarketplaceId = "A1PA6795UKMFR9"), (t.MarketplaceId = 5))
      : n == "www.amazon.fr" || n == "A13V1IB3VIYZZH"
      ? ((t.AmazonMarketplaceId = "A13V1IB3VIYZZH"), (t.MarketplaceId = 6))
      : n == "www.amazon.it" || n == "APJ6JRA9NG5V4"
      ? ((t.AmazonMarketplaceId = "APJ6JRA9NG5V4"), (t.MarketplaceId = 7))
      : n == "www.amazon.es" || n == "A1RKKUPIHCS9HS"
      ? ((t.AmazonMarketplaceId = "A1RKKUPIHCS9HS"), (t.MarketplaceId = 8))
      : n == "www.amazon.ae" || n == "A2VIGQ35RCS4UG"
      ? ((t.AmazonMarketplaceId = "A2VIGQ35RCS4UG"), (t.MarketplaceId = 9))
      : n == "www.amazon.com.au" || n == "A39IBJ37TRP1C6"
      ? ((t.AmazonMarketplaceId = "A39IBJ37TRP1C6"), (t.MarketplaceId = 10))
      : n == "www.amazon.co.jp" || n == "www.amazon.jp" || n == "A1VC38T7YXB528"
      ? ((t.AmazonMarketplaceId = "A1VC38T7YXB528"), (t.MarketplaceId = 11))
      : n == "www.amazon.sg" || n == "A19VAU5U5O7RUS"
      ? ((t.AmazonMarketplaceId = "A19VAU5U5O7RUS"), (t.MarketplaceId = 12))
      : n == "www.amazon.sa" || n == "A17E79C6D8DWNP"
      ? ((t.AmazonMarketplaceId = "A17E79C6D8DWNP"), (t.MarketplaceId = 13))
      : n == "www.amazon.eg" || n == "ARBP9OOSHTCHU"
      ? ((t.AmazonMarketplaceId = "ARBP9OOSHTCHU"), (t.MarketplaceId = 14))
      : n == "www.amazon.pl" || n == "A1C3SOZRARQ6R3"
      ? ((t.AmazonMarketplaceId = "A1C3SOZRARQ6R3"), (t.MarketplaceId = 15))
      : n == "www.amazon.be" || n == "AMEN7PMS3EDWL"
      ? ((t.AmazonMarketplaceId = "AMEN7PMS3EDWL"), (t.MarketplaceId = 16))
      : n == "www.amazon.se" || n == "A2NODRKZP88ZB9"
      ? ((t.AmazonMarketplaceId = "A2NODRKZP88ZB9"), (t.MarketplaceId = 17))
      : (n == "www.amazon.nl" || n == "A1805IZSGTT6HS") &&
        ((t.AmazonMarketplaceId = "A1805IZSGTT6HS"), (t.MarketplaceId = 18)),
    t
  );
}

function formatDate(date) {
  var formattedDate = new Date(date);
  var d = formattedDate.getDate();
  if (d < 10) {
    d = "0" + d;
  }
  var m = formattedDate.getMonth();
  m += 1; // JavaScript months are 0-11
  if (m < 10) {
    m = "0" + m;
  }
  var y = formattedDate.getFullYear();
  return d + "." + m + "." + y;
}

function getDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var milisecond = now.getMilliseconds();
  if (month.toString().length == 1) {
    month = "0" + month;
  }
  if (day.toString().length == 1) {
    day = "0" + day;
  }
  if (hour.toString().length == 1) {
    hour = "0" + hour;
  }
  if (minute.toString().length == 1) {
    minute = "0" + minute;
  }
  if (second.toString().length == 1) {
    second = "0" + second;
  }
  var dateTime =
    year +
    "-" +
    month +
    "-" +
    day +
    "T" +
    hour +
    ":" +
    minute +
    ":" +
    second +
    "." +
    milisecond;
  return dateTime;
}

function chromeSaveOrderDetails(orderDetails) {
  console.log(orderDetails);
  localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
  return true;
}

function chromeGetOrderDetails() {
  orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
  return true;
}

$.extend({
  distinct: function (anArray) {
    var result = [];
    $.each(anArray, function (i, v) {
      if ($.inArray(v, result) == -1) result.push(v);
    });
    return result;
  },
});

async function changeAddress(countryCode, postalCode) {
  var currentCountry = document
    .querySelector("#glow-ingress-line2")
    .textContent.trim();

  if (currentCountry == countriesMap[countryCode]) {
    return;
  }

  if (
    countryCode == "US" &&
    $("#glow-ingress-line2").text().indexOf("60018") > -1
  ) {
    return;
  }

  var gotNav = $("#nav-global-location-data-modal-action");
  if (!gotNav.length) {
    gotNav = $("#nav-global-location-slot span");
  }
  const aYearFromNow = new Date();
  aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
  if (gotNav.length) {
    const dataModal = gotNav.attr("data-a-modal");
    if (dataModal) {
      let tokenJSON = JSON.parse(dataModal);
      var csrfToken = tokenJSON.ajaxHeaders["anti-csrftoken-a2z"];
      var url = tokenJSON.url;

      const csrf = await new Promise((resolve, reject) => {
        $.ajax({
          url: "https://" + document.domain + url,
          type: "GET",
          headers: {
            accept: "*/*",
            "anti-csrftoken-a2z": csrfToken,
          },
          success: function (response) {
            let rg = new RegExp(/CSRF_TOKEN\s*:\s*"([^"]+)"/g);
            let rgArray = rg.exec(response);

            if (!rgArray) {
              return null;
            }
            resolve(rgArray[1]);
          },
          error: function (message) {
            reject(message);
          },
        });
      });

      if (location.host == "www.amazon.ca") {
        url = "https://www.amazon.ca/gp/delivery/ajax/address-change.html";
      } else if (location.host == "www.amazon.co.uk") {
        url = "https://www.amazon.co.uk/gp/delivery/ajax/address-change.html";
      } else {
        url = "https://www.amazon.com/gp/delivery/ajax/address-change.html";
      }

      const newForm = {
        locationType: "COUNTRY",
        district: countryCode,
        countryCode: countryCode,
        storeContext: "generic",
        pageType: "Gateway",
        actionSource: "glow",
        almBrandId: "undefined",
      };
      if (countryCode === "US") {
        // eğer amerika ise Illinois e göre çalış (Depo orda olduğu içün)
        newForm.locationType = "LOCATION_INPUT";
        delete newForm.district;
        delete newForm.countryCode;
        newForm.zipCode = postalCode;
      }

      const formData = new URLSearchParams(newForm);

      await $.ajax({
        headers: {
          accept: "*/*",
          "content-type": "application/x-www-form-urlencoded",
          "anti-csrftoken-a2z": csrf,
        },
        type: "POST",
        url: url,
        data: formData.toString(), // serializes the form's elements.
        success: function () {},
      });
    }
  }
}

async function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 0-indexed
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

var countriesAll = [
  {
    country: "Afghanistan",
    countryCode: "AF",
  },
  {
    country: "Albania",
    countryCode: "AL",
  },
  {
    country: "Algeria",
    countryCode: "DZ",
  },
  {
    country: "American Samoa",
    countryCode: "AS",
  },
  {
    country: "Andorra",
    countryCode: "AD",
  },
  {
    country: "Angola",
    countryCode: "AO",
  },
  {
    country: "Anguilla",
    countryCode: "AI",
  },
  {
    country: "Antigua and Barbuda",
    countryCode: "AG",
  },
  {
    country: "Argentina",
    countryCode: "AR",
  },
  {
    country: "Armenia",
    countryCode: "AM",
  },
  {
    country: "Aruba",
    countryCode: "AW",
  },
  {
    country: "Australia",
    countryCode: "AU",
  },
  {
    country: "Austria",
    countryCode: "AT",
  },
  {
    country: "Azerbaijan",
    countryCode: "AZ",
  },
  {
    country: "The Bahamas",
    countryCode: "BS",
  },
  {
    country: "Bahrain",
    countryCode: "BH",
  },
  {
    country: "Bangladesh",
    countryCode: "BD",
  },
  {
    country: "Barbados",
    countryCode: "BB",
  },
  {
    country: "Belarus",
    countryCode: "BY",
  },
  {
    country: "Belgium",
    countryCode: "BE",
  },
  {
    country: "Belize",
    countryCode: "BZ",
  },
  {
    country: "Benin",
    countryCode: "BJ",
  },
  {
    country: "Bermuda",
    countryCode: "BM",
  },
  {
    country: "Bhutan",
    countryCode: "BT",
  },
  {
    country: "Bolivia",
    countryCode: "BO",
  },
  {
    country: "Bosnia and Herzegovina",
    countryCode: "BA",
  },
  {
    country: "Botswana",
    countryCode: "BW",
  },
  {
    country: "Brazil",
    countryCode: "BR",
  },
  {
    country: "British Virgin Islands",
    countryCode: "VG",
  },
  {
    country: "Brunei",
    countryCode: "BN",
  },
  {
    country: "Bulgaria",
    countryCode: "BG",
  },
  {
    country: "Burkina Faso",
    countryCode: "BF",
  },
  {
    country: "Burundi",
    countryCode: "BI",
  },
  {
    country: "Cambodia",
    countryCode: "KH",
  },
  {
    country: "Cameroon",
    countryCode: "CM",
  },
  {
    country: "Canada",
    countryCode: "CA",
  },
  {
    country: "Cape Verde",
    countryCode: "CV",
  },
  {
    country: "Cayman Islands",
    countryCode: "KY",
  },
  {
    country: "Central African Republic",
    countryCode: "CF",
  },
  {
    country: "Chad",
    countryCode: "TD",
  },
  {
    country: "Chile",
    countryCode: "CL",
  },
  {
    country: "China",
    countryCode: "CN",
  },
  {
    country: "Christmas Island",
    countryCode: "CX",
  },
  {
    country: "Cocos (Keeling) Islands",
    countryCode: "CC",
  },
  {
    country: "Colombia",
    countryCode: "CO",
  },
  {
    country: "Comoros",
    countryCode: "KM",
  },
  {
    country: "Republic of the Congo",
    countryCode: "CG",
  },
  {
    country: "Cook Islands",
    countryCode: "CK",
  },
  {
    country: "Costa Rica",
    countryCode: "CR",
  },
  {
    country: "Cote d'Ivoire",
    countryCode: "CI",
  },
  {
    country: "Croatia",
    countryCode: "HR",
  },
  {
    country: "Cuba",
    countryCode: "CU",
  },
  {
    country: "Cyprus",
    countryCode: "CY",
  },
  {
    country: "Czech Republic",
    countryCode: "CZ",
  },
  {
    country: "Denmark",
    countryCode: "DK",
  },
  {
    country: "Djibouti",
    countryCode: "DJ",
  },
  {
    country: "Dominica",
    countryCode: "DM",
  },
  {
    country: "Dominican Republic",
    countryCode: "DO",
  },
  {
    country: "Ecuador",
    countryCode: "EC",
  },
  {
    country: "Egypt",
    countryCode: "EG",
  },
  {
    country: "El Salvador",
    countryCode: "SV",
  },
  {
    country: "Equatorial Guinea",
    countryCode: "GQ",
  },
  {
    country: "Eritrea",
    countryCode: "ER",
  },
  {
    country: "Estonia",
    countryCode: "EE",
  },
  {
    country: "Ethiopia",
    countryCode: "ET",
  },
  {
    country: "Falkland Islands (Islas Malvinas)",
    countryCode: "FK",
  },
  {
    country: "Faroe Islands",
    countryCode: "FO",
  },
  {
    country: "Fiji",
    countryCode: "FJ",
  },
  {
    country: "Finland",
    countryCode: "FI",
  },
  {
    country: "France",
    countryCode: "FR",
  },
  {
    country: "French Guiana",
    countryCode: "GF",
  },
  {
    country: "French Polynesia",
    countryCode: "PF",
  },
  {
    country: "Gabon",
    countryCode: "GA",
  },
  {
    country: "The Gambia",
    countryCode: "GM",
  },
  {
    country: "Georgia",
    countryCode: "GE",
  },
  {
    country: "Germany",
    countryCode: "DE",
  },
  {
    country: "Ghana",
    countryCode: "GH",
  },
  {
    country: "Gibraltar",
    countryCode: "GI",
  },
  {
    country: "Greece",
    countryCode: "GR",
  },
  {
    country: "Greenland",
    countryCode: "GL",
  },
  {
    country: "Grenada",
    countryCode: "GD",
  },
  {
    country: "Guadeloupe",
    countryCode: "GP",
  },
  {
    country: "Guam",
    countryCode: "GU",
  },
  {
    country: "Guatemala",
    countryCode: "GT",
  },
  {
    country: "Guinea",
    countryCode: "GN",
  },
  {
    country: "Guinea-Bissau",
    countryCode: "GW",
  },
  {
    country: "Guyana",
    countryCode: "GY",
  },
  {
    country: "Haiti",
    countryCode: "HT",
  },
  {
    country: "Holy See (Vatican City)",
    countryCode: "VA",
  },
  {
    country: "Honduras",
    countryCode: "HN",
  },
  {
    country: "Hungary",
    countryCode: "HU",
  },
  {
    country: "Iceland",
    countryCode: "IS",
  },
  {
    country: "India",
    countryCode: "IN",
  },
  {
    country: "Indonesia",
    countryCode: "ID",
  },
  {
    country: "Iran",
    countryCode: "IR",
  },
  {
    country: "Iraq",
    countryCode: "IQ",
  },
  {
    country: "Ireland",
    countryCode: "IE",
  },
  {
    country: "Israel",
    countryCode: "IL",
  },
  {
    country: "Italy",
    countryCode: "IT",
  },
  {
    country: "Jamaica",
    countryCode: "JM",
  },
  {
    country: "Japan",
    countryCode: "JP",
  },
  {
    country: "Jordan",
    countryCode: "JO",
  },
  {
    country: "Kazakhstan",
    countryCode: "KZ",
  },
  {
    country: "Kenya",
    countryCode: "KE",
  },
  {
    country: "Kiribati",
    countryCode: "KI",
  },
  {
    country: "North Korea",
    countryCode: "KP",
  },
  {
    country: "South Korea",
    countryCode: "KR",
  },
  {
    country: "Kuwait",
    countryCode: "KW",
  },
  {
    country: "Kyrgyzstan",
    countryCode: "KG",
  },
  {
    country: "Laos",
    countryCode: "LA",
  },
  {
    country: "Latvia",
    countryCode: "LV",
  },
  {
    country: "Lebanon",
    countryCode: "LB",
  },
  {
    country: "Lesotho",
    countryCode: "LS",
  },
  {
    country: "Liberia",
    countryCode: "LR",
  },
  {
    country: "Libya",
    countryCode: "LY",
  },
  {
    country: "Liechtenstein",
    countryCode: "LI",
  },
  {
    country: "Lithuania",
    countryCode: "LT",
  },
  {
    country: "Luxembourg",
    countryCode: "LU",
  },
  {
    country: "North Macedonia",
    countryCode: "MK",
  },
  {
    country: "Madagascar",
    countryCode: "MG",
  },
  {
    country: "Malawi",
    countryCode: "MW",
  },
  {
    country: "Malaysia",
    countryCode: "MY",
  },
  {
    country: "Maldives",
    countryCode: "MV",
  },
  {
    country: "Mali",
    countryCode: "ML",
  },
  {
    country: "Malta",
    countryCode: "MT",
  },
  {
    country: "Isle of Man",
    countryCode: "IM",
  },
  {
    country: "Marshall Islands",
    countryCode: "MH",
  },
  {
    country: "Martinique",
    countryCode: "MQ",
  },
  {
    country: "Mauritania",
    countryCode: "MR",
  },
  {
    country: "Mauritius",
    countryCode: "MU",
  },
  {
    country: "Mayotte",
    countryCode: "YT",
  },
  {
    country: "Mexico",
    countryCode: "MX",
  },
  {
    country: "Federated States of Micronesia",
    countryCode: "FM",
  },
  {
    country: "Moldova",
    countryCode: "MD",
  },
  {
    country: "Monaco",
    countryCode: "MC",
  },
  {
    country: "Mongolia",
    countryCode: "MN",
  },
  {
    country: "Montserrat",
    countryCode: "MS",
  },
  {
    country: "Morocco",
    countryCode: "MA",
  },
  {
    country: "Mozambique",
    countryCode: "MZ",
  },
  {
    country: "Myanmar (Burma)",
    countryCode: "MM",
  },
  {
    country: "Namibia",
    countryCode: "NA",
  },
  {
    country: "Nauru",
    countryCode: "NR",
  },
  {
    country: "Nepal",
    countryCode: "NP",
  },
  {
    country: "Netherlands",
    countryCode: "NL",
  },
  {
    country: "Netherlands Antilles",
    countryCode: "AN",
  },
  {
    country: "New Caledonia",
    countryCode: "NC",
  },
  {
    country: "New Zealand",
    countryCode: "NZ",
  },
  {
    country: "Nicaragua",
    countryCode: "NI",
  },
  {
    country: "Niger",
    countryCode: "NE",
  },
  {
    country: "Nigeria",
    countryCode: "NG",
  },
  {
    country: "Niue",
    countryCode: "NU",
  },
  {
    country: "Norfolk Island",
    countryCode: "NF",
  },
  {
    country: "Northern Mariana Islands",
    countryCode: "MP",
  },
  {
    country: "Norway",
    countryCode: "NO",
  },
  {
    country: "Oman",
    countryCode: "OM",
  },
  {
    country: "Pakistan",
    countryCode: "PK",
  },
  {
    country: "Palau",
    countryCode: "PW",
  },
  {
    country: "Palestinian Territory",
    countryCode: "PS",
  },
  {
    country: "Panama",
    countryCode: "PA",
  },
  {
    country: "Papua New Guinea",
    countryCode: "PG",
  },
  {
    country: "Paraguay",
    countryCode: "PY",
  },
  {
    country: "Peru",
    countryCode: "PE",
  },
  {
    country: "Philippines",
    countryCode: "PH",
  },
  {
    country: "Pitcairn Islands",
    countryCode: "PN",
  },
  {
    country: "Poland",
    countryCode: "PL",
  },
  {
    country: "Portugal",
    countryCode: "PT",
  },
  {
    country: "Puerto Rico",
    countryCode: "PR",
  },
  {
    country: "Qatar",
    countryCode: "QA",
  },
  {
    country: "Reunion",
    countryCode: "RE",
  },
  {
    country: "Romania",
    countryCode: "RO",
  },
  {
    country: "Russia",
    countryCode: "RU",
  },
  {
    country: "Rwanda",
    countryCode: "RW",
  },
  {
    country: "Saint Kitts and Nevis",
    countryCode: "KN",
  },
  {
    country: "Saint Lucia",
    countryCode: "LC",
  },
  {
    country: "Saint Pierre and Miquelon",
    countryCode: "PM",
  },
  {
    country: "Saint Vincent and the Grenadines",
    countryCode: "VC",
  },
  {
    country: "San Marino",
    countryCode: "SM",
  },
  {
    country: "Sao Tome and Principe",
    countryCode: "ST",
  },
  {
    country: "Saudi Arabia",
    countryCode: "SA",
  },
  {
    country: "Senegal",
    countryCode: "SN",
  },
  {
    country: "Seychelles",
    countryCode: "SC",
  },
  {
    country: "Sierra Leone",
    countryCode: "SL",
  },
  {
    country: "Singapore",
    countryCode: "SG",
  },
  {
    country: "Slovakia",
    countryCode: "SK",
  },
  {
    country: "Slovenia",
    countryCode: "SI",
  },
  {
    country: "Solomon Islands",
    countryCode: "SB",
  },
  {
    country: "Somalia",
    countryCode: "SO",
  },
  {
    country: "South Africa",
    countryCode: "ZA",
  },
  {
    country: "Spain",
    countryCode: "ES",
  },
  {
    country: "Sri Lanka",
    countryCode: "LK",
  },
  {
    country: "Sudan",
    countryCode: "SD",
  },
  {
    country: "Suriname",
    countryCode: "SR",
  },
  {
    country: "Svalbard",
    countryCode: "SJ",
  },
  {
    country: "Eswatini",
    countryCode: "SZ",
  },
  {
    country: "Sweden",
    countryCode: "SE",
  },
  {
    country: "Switzerland",
    countryCode: "CH",
  },
  {
    country: "Syria",
    countryCode: "SY",
  },
  {
    country: "Taiwan",
    countryCode: "TW",
  },
  {
    country: "Tajikistan",
    countryCode: "TJ",
  },
  {
    country: "Tanzania",
    countryCode: "TZ",
  },
  {
    country: "Thailand",
    countryCode: "TH",
  },
  {
    country: "Togo",
    countryCode: "TG",
  },
  {
    country: "Tokelau",
    countryCode: "TK",
  },
  {
    country: "Tonga",
    countryCode: "TO",
  },
  {
    country: "Trinidad and Tobago",
    countryCode: "TT",
  },
  {
    country: "Tunisia",
    countryCode: "TN",
  },
  {
    country: "Turkey",
    countryCode: "TR",
  },
  {
    country: "Turkmenistan",
    countryCode: "TM",
  },
  {
    country: "Turks and Caicos Islands",
    countryCode: "TC",
  },
  {
    country: "Tuvalu",
    countryCode: "TV",
  },
  {
    country: "Uganda",
    countryCode: "UG",
  },
  {
    country: "Ukraine",
    countryCode: "UA",
  },
  {
    country: "United Arab Emirates",
    countryCode: "AE",
  },
  {
    country: "United Kingdom",
    countryCode: "UK",
  },
  {
    country: "United States",
    countryCode: "US",
  },
  {
    country: "United States Minor Outlying Islands",
    countryCode: "UM",
  },
  {
    country: "Uruguay",
    countryCode: "UY",
  },
  {
    country: "Uzbekistan",
    countryCode: "UZ",
  },
  {
    country: "Vanuatu",
    countryCode: "VU",
  },
  {
    country: "Venezuela",
    countryCode: "VE",
  },
  {
    country: "Vietnam",
    countryCode: "VN",
  },
  {
    country: "Virgin Islands",
    countryCode: "VI",
  },
  {
    country: "Wallis and Futuna",
    countryCode: "WF",
  },
  {
    country: "Western Sahara",
    countryCode: "EH",
  },
  {
    country: "Western Samoa",
    countryCode: "WS",
  },
  {
    country: "Yemen",
    countryCode: "YE",
  },
  {
    country: "Democratic Republic of the Congo",
    countryCode: "CD",
  },
  {
    country: "Zambia",
    countryCode: "ZM",
  },
  {
    country: "Zimbabwe",
    countryCode: "ZW",
  },
  {
    country: "Hong Kong",
    countryCode: "HK",
  },
  {
    country: "Macau",
    countryCode: "MO",
  },
  {
    country: "Antarctica",
    countryCode: "AQ",
  },
  {
    country: "Bouvet Island",
    countryCode: "BV",
  },
  {
    country: "British Indian Ocean Territory",
    countryCode: "IO",
  },
  {
    country: "French Southern and Antarctic Lands",
    countryCode: "TF",
  },
  {
    country: "Heard Island and McDonald Islands",
    countryCode: "HM",
  },
  {
    country: "Saint Helena",
    countryCode: "SH",
  },
  {
    country: "South Georgia and the South Sandwich Islands",
    countryCode: "GS",
  },
  {
    country: "Guernsey",
    countryCode: "GG",
  },
  {
    country: "Serbia",
    countryCode: "RS",
  },
  {
    country: "Saint Barthélemy",
    countryCode: "BL",
  },
  {
    country: "Montenegro",
    countryCode: "ME",
  },
  {
    country: "Jersey",
    countryCode: "JE",
  },
  {
    country: "Curaçao",
    countryCode: "CW",
  },
  {
    country: "Saint Martin",
    countryCode: "MF",
  },
  {
    country: "Sint Maarten",
    countryCode: "SX",
  },
  {
    country: "Timor-Leste",
    countryCode: "TL",
  },
  {
    country: "South Sudan",
    countryCode: "SS",
  },
  {
    country: "Åland Islands",
    countryCode: "AX",
  },
  {
    country: "Bonaire",
    countryCode: "BQ",
  },
  {
    country: "Republic of Kosovo",
    countryCode: "XK",
  },
];

const countriesMap = {};
countriesAll.forEach(
  ({ countryCode, country }) => (countriesMap[countryCode] = country)
);

var countryJson = [
  {
    country: "Australia",
    countryCode: "AU",
    mwsCode: "A39IBJ37TRP1C6",
  },
  {
    country: "Belgium",
    countryCode: "BE",
    mwsCode: "AMEN7PMS3EDWL",
  },
  {
    country: "Brazil",
    countryCode: "BR",
    mwsCode: "A2Q3Y263D00KWC",
  },
  {
    country: "Canada",
    countryCode: "CA",
    mwsCode: "A2EUQ1WTGCTBG2",
  },
  {
    country: "Egypt",
    countryCode: "EG",
    mwsCode: "ARBP9OOSHTCHU",
  },
  {
    country: "France",
    countryCode: "FR",
    mwsCode: "A13V1IB3VIYZZH",
  },
  {
    country: "Germany",
    countryCode: "DE",
    mwsCode: "A1PA6795UKMFR9",
  },
  {
    country: "India",
    countryCode: "IN",
    mwsCode: "A21TJRUUN4KGV",
  },
  {
    country: "Italy",
    countryCode: "IT",
    mwsCode: "APJ6JRA9NG5V4",
  },
  {
    country: "Japan",
    countryCode: "JP",
    mwsCode: "A1VC38T7YXB528",
  },
  {
    country: "Mexico",
    countryCode: "MX",
    mwsCode: "A1AM78C64UM0Y8",
  },
  {
    country: "Netherlands",
    countryCode: "NL",
    mwsCode: "A1805IZSGTT6HS",
  },
  {
    country: "Poland",
    countryCode: "PL",
    mwsCode: "A1C3SOZRARQ6R3",
  },
  {
    country: "Saudi Arabia",
    countryCode: "SA",
    mwsCode: "A17E79C6D8DWNP",
  },
  {
    country: "Singapore",
    countryCode: "SG",
    mwsCode: "A19VAU5U5O7RUS",
  },
  {
    country: "Spain",
    countryCode: "ES",
    mwsCode: "A1RKKUPIHCS9HS",
  },
  {
    country: "Sweden",
    countryCode: "SE",
    mwsCode: "A2NODRKZP88ZB9",
  },
  {
    country: "Turkey",
    countryCode: "TR",
    mwsCode: "A33AVAJ2PDY3EV",
  },
  {
    country: "UK",
    countryCode: "UK",
    mwsCode: "A1F83G8C2ARO7P",
  },
  {
    country: "United Arab Emirates (U.A.E.)",
    countryCode: "AE",
    mwsCode: "A2VIGQ35RCS4UG",
  },
  {
    country: "United States",
    countryCode: "US",
    mwsCode: "ATVPDKIKX0DER",
  },
];
