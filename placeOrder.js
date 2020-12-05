var cartCount = localStorage.getItem("cartcount") || 0;
$("#cartCount").text(cartCount);
var currUname = window.location.search.split("=")[1];
currUname = currUname.replace(/%20/g, " ");
var givenNameUpper = currUname.toUpperCase();
var end;
var currentIds = [];
var counter = 0;
$("#sampleMain").show();

$("#confirmDiv").hide();
$("#previousOrdersMain").hide();
$("#buttonsDiv").hide();
$("#listDisplay").hide();

$("#clearConfirmMain").hide();

$("#confirmPage").css("style", "margin: 10vh 0");

$("#sampleMain").append(
  $("<div>")
    .attr("id", "sample")
    .append(
      $("<h1>").attr("id", "text1").text(`Hii ${currUname}!`),
      $("<h1>")
        .attr({
          id: "text2",
          class: "hiding",
        })
        .text("Thanks for Ordering"),
      $("<h3>")
        .attr({
          id: "text3",
          class: "hiding",
        })
        .html("For Order history Please check</br> <i>PREVIOUS ORDERS</i>")
    )
);
setTimeout(function () {
  $("#text1").addClass("goRight");
  setTimeout(function () {
    $("#text2").show();
    $("#text2").addClass("startRight");
    setTimeout(function () {
      $("#text2").removeClass("startRight");
      $("#text2").addClass("goRight");
      setTimeout(function () {
        $("#text3").show();
        $("#text3").addClass("startRight");
        setTimeout(function () {
          $("#text3").removeClass("startRight");
          $("#text3").addClass("goRight");
        }, 2500);
      }, 500);
    }, 2000);
  }, 100);
}, 2000);

setTimeout(function () {
  $("#sample").show();
  setTimeout(function () {
    $("#sample").css("animation", "1s exit forwards");
    setTimeout(function () {
      $("#sample").css("background-color", "transparent");
      $("#sample > h1").css("color", "transparent");
      setTimeout(function () {
        $("#sampleMain").hide();
        $("#confirmDiv").show();
        $("#previousOrdersMain").show();
        $("#confirmPage").css("style", "margin: 10vh 0");
      }, 100);
    }, 500);
  }, 7500);
}, 0);

const postListPromise = new Promise((resolve, reject) => {
  $.get("https://5fc0748dfd14be0016749cfe.mockapi.io/karthik/trail", (data) => {
    resolve(data);
  }).fail((err) => {
    reject(
      new Error(
        `Call failed for GET POST List Request with status ${err.status}`
      )
    );
  });
});
postListPromise
  .then((data) => {
    var productList = data;
    for (var i = productList.length - 1; i >= 0; i--) {
      if (productList[i].customerName == givenNameUpper) {
        counter++;
        currentIds[counter - 1] = productList[i].id;
        productList[i]["productNames"] = productList[i]["productNames[]"];
        delete productList[i]["productNames[]"];
        productList[i]["productImages"] = productList[i]["productImages[]"];
        delete productList[i]["productImages[]"];
        dataFetching(productList[i], counter);
      }
      if (i == 0) {
        end = counter;
      }
    }
  })
  .catch((error) => {
    console.log(`Catch Error => `, error);
  });
function dataFetching(data, pos) {
  $("#listDisplay").append(
    $("<div>")
      .attr({
        class: "mainListDiv",
        id: `mainListDivId${pos}`,
      })
      .append(
        $("<div>")
          .attr("class", "dataDiv")
          .append(
            $("<h3>").text(data.createdTime.split(" ")[0]),
            $("<p>").text(data.createdTime.split(" ")[1])
          ),
        $("<div>")
          .attr("class", "thumbnailDiv")
          .append(
            $("<div>").attr({
              class: "scrollDiv",
              id: `scrollDivId${pos}`,
            }),
            $("<div>")
              .attr({
                class: "gradientDiv",
                id: `gradientDivId${pos}`,
              })
              .append(
                $("<h2>")
                  .attr({
                    id: `priceText${pos}`,
                    class: "hide",
                  })
                  .text(`RS: ${data.Amount}`)
              ),
            $("<div>")
              .attr({
                class: "dragArrow",
                id: `dragArrowId${pos}`,
              })
              .append(
                $("<img>").attr({
                  class: "arrowListImg1L rightMove1",
                  id: `arrowOneId${pos}`,
                  src: "./images/left-arrow.png",
                  alt: "left-arrow",
                }),
                $("<img>").attr({
                  class: "arrowListImg2R rightMove2",
                  id: `arrowTwoId${pos}`,
                  src: "./images/left-arrow.png",
                  alt: "right-arrow",
                })
              )
          )
      )
  );

  if (data.productNames.length > 10) {
    var itemReapeat = data.productNames.split("=>")[1];
    $(`#scrollDivId${pos}`).append(
      $("<div>")
        .attr("class", "imgDiv")
        .append(
          $("<img>").attr({
            src: data.productImages,
            alt: `img${i}`,
          }),
          $("<p>").attr("class", `itemCount${pos}`).text(`x${itemReapeat}`)
        )
    );
  } else {
    for (var i = 0; i < data.productImages.length; i++) {
      var itemReapeat = data.productNames[i].split("=>")[1];
      $(`#scrollDivId${pos}`).append(
        $("<div>")
          .attr("class", "imgDiv")
          .append(
            $("<img>").attr({
              src: data.productImages[i],
              alt: `img${i}`,
            }),
            $("<p>").attr("class", `itemCount${pos}`).text(`x${itemReapeat}`)
          )
      );
    }
  }

  var scroller = 0;
  $(`#dragArrowId${pos}`).click(function () {
    if (scroller == 0) {
      $(`#mainListDivId${pos}`).removeClass("listUp");
      $(`#mainListDivId${pos}`).addClass("listDown");
      $(`#scrollDivId${pos}`).removeClass("listScrollLeft");
      var temp = $(window).width;
      if (temp > 550 && temp <= 600) {
        $(`#mainListDivId${end}`).css("margin-bottom", "150px");
      }
      setTimeout(function () {
        $(`#priceText${pos}`).removeClass("hide");
        $(`#priceText${pos}`).addClass("show");
        if ($(window).width() > 700) {
          if (data.productNames.length > 10) {
            $(`#scrollDivId${pos}`).css({
              width: `10vw`,
            });
          } else {
            $(`#scrollDivId${pos}`).css({
              width: `${(data.productImages.length * 100) / 10}vw`,
            });
          }
        }
        if ($(window).width() < 700) {
          if (data.productNames.length > 10) {
            $(`#scrollDivId${pos}`).css({
              width: `20vw`,
            });
          }
        }

        $(`#scrollDivId${pos}`).css({
          height: "auto",
          padding: "10px 0 0 0",
        });
        $(`#scrollDivId${pos}`).addClass("scrollerWidth");
        $(`.itemCount${pos}`).css("display", "block");
      }, 1000);
      $(`#scrollDivId${pos}`).addClass("listScrollRight");
      $(`#arrowOneId${pos}`).removeClass("rightMove1");
      $(`#arrowOneId${pos}`).addClass("leftMove1");
      $(`#arrowTwoId${pos}`).removeClass("rightMove2");
      $(`#arrowTwoId${pos}`).addClass("leftMove2");
      scroller = 1;
    } else {
      $(`#mainListDivId${pos}`).removeClass("listDown");
      $(`#mainListDivId${pos}`).addClass("listUp");
      $(`#scrollDivId${pos}`).removeClass("listScrollRight");
      $(`#scrollDivId${pos}`).addClass("listScrollLeft");
      setTimeout(function () {
        $(`#priceText${pos}`).removeClass("show");
        $(`#priceText${pos}`).addClass("hide");
        $(`#scrollDivId${pos}`).css({
          width: "100%",
          height: "100%",
          padding: "0",
        });
        $(`.itemCount${pos}`).css("display", "none");
      }, 500);
      $(`#arrowOneId${pos}`).addClass("rightMove1");
      $(`#arrowOneId${pos}`).removeClass("leftMove1");
      $(`#arrowTwoId${pos}`).addClass("rightMove2");
      $(`#arrowTwoId${pos}`).removeClass("leftMove2");
      scroller = 0;
    }
  });
}

$("#previousOrdersMain").click(function () {
  $("#buttonsDiv").show();
  if ($(window).width() <= 600) {
    $("#confirmPage").css("margin-bottom", "150px");
  }
  $("#confirmDiv").hide();
  $("#previousOrdersMain").hide();
  $("#confirmPage").addClass("mainMargin");
  $("#listDisplay").show();
});
var deleted = false;
$("#backBtn").click(() => {
  $("#listDisplay").hide();
  $("#buttonsDiv").hide();
  $("#confirmDiv").show();
  $("#previousOrdersMain").show();
  $("#confirmPage").removeClass("mainMargin");
});
$("#historyBtn").click(() => {
  $(window).scrollTop(0);
  setTimeout(function () {
    if (deleted == false) {
      for (var i = 0; i < counter; i++) {
        $.ajax({
          url: `https://5fc0748dfd14be0016749cfe.mockapi.io/karthik/trail/${currentIds[i]}`,
          type: "DELETE",
        });
      }
      deleted = true;
    }
    $("#listDisplay").hide();
    $("#buttonsDiv").hide();
    $("#clearConfirmMain").show();
    $("#confirmPage").css("min-height", "calc(100vh - 18.5vh - 180px)");
    $("#clearConfirmId").addClass("clearConfirm");
    $("#confirmPage").removeClass("mainMargin");
    $("#listDisplay").html("");
  }, 500);
});
