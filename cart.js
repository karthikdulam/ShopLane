var cartData = JSON.parse(localStorage.getItem("cartdata")) || [];
var cartCount = localStorage.getItem("cartcount") || 0;
$("#cartCount").text(cartCount);
var totalPrice = 0;
var arr = [];
var itemArr = [];
var valChanged = false;
for (var i = 0; i < cartData.length; i++) {
  if (itemArr.length >= 1) {
    for (var j = 0; j < itemArr.length; j++) {
      if (cartData[i].preview == itemArr[j].preview) {
        arr[j] = arr[j] + 1;
        valChanged = true;
        break;
      } else if (j == itemArr.length - 1 && valChanged == false) {
        itemArr[j + 1] = cartData[i];
        arr[j + 1] = 1;
      }
    }
    valChanged = false;
  } else {
    itemArr[0] = cartData[0];
    arr[0] = 1;
  }
  totalPrice = totalPrice + cartData[i].price;
}

$("#cartPage").append(
  $("<h1>").text("Checkout"),
  $("<p>").html("Total Items: <span id='totalItems'></span>"),
  $("<div>")
    .attr("id", "cartContainer")
    .append(
      $("<div>").attr("id", "left"),
      $("<div>")
        .attr("id", "right")
        .append(
          $("<div>").append(
            $("<h2>").text("Total Amount"),
            $("<p>").html('Total Amount: Rs <span id="finalPrice"></span>'),
            $("<button>").attr("id", "placeOrder").text("Place Order")
          )
        )
    )
);
var productName = [];
var productImage = [];
for (var i = 0; i < itemArr.length; i++) {
  if (i == 0) {
    itemCreation(itemArr[i], arr[i]);
    productName.push(itemArr[i].name + `=>${arr[i]}`);
    productImage.push(itemArr[i].preview);
  } else {
    itemCreation(itemArr[i], arr[i] - 1);
    productName.push(itemArr[i].name + `=>${arr[i] - 1}`);
    productImage.push(itemArr[i].preview);
  }
}

function currentTime() {
  var day = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var hours = new Date().getHours();
  var minutes = new Date().getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return day + "-" + month + "-" + year + " " + hours + ":" + minutes + ampm;
}

$("#placeOrder").click(() => {
  var givenName = prompt("Please Enter your Name");
  givenName = givenName.replace(/\s+/g, " ").trim();
  if (givenName != null && givenName != "") {
    var givenNameUpper = givenName.toUpperCase();
    var dataObj = {
      createdTime: currentTime(),
      customerName: givenNameUpper,
      Amount: totalPrice,
      productNames: productName,
      productImages: productImage,
    };
    if (cartCount > 0) {
      $.post(
        "https://5fc0748dfd14be0016749cfe.mockapi.io/karthik/trail",
        dataObj,
        function () {
          window.location.assign(`./placeOrder.html?cName=${givenName}`);
          cartCount = 0;
          window.localStorage.setItem("cartcount", cartCount);
          $("#cartCount").text(cartCount);
          window.localStorage.removeItem("cartdata");
        }
      ).fail(() => {
        alert("Something went wrong. Please try again later!!");
      });
    } else {
      window.location.assign(`./placeOrder.html?cName=${givenName}`);
    }
  }
});
function itemCreation(data, count) {
  $("#totalItems").text(cartCount);
  $("#finalPrice").text(totalPrice);
  $("#left").append(
    `<div class="inCartDiv"><img src="${data.preview}" alt="${
      data.id
    }"/><div><h4>${data.name}</h4><p>x${count}</p><p>Amount: <span>${
      data.price * count
    }</span></p></div></div>`
  );
}
