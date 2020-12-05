var cartData = JSON.parse(localStorage.getItem("cartdata")) || [];
var cartCount = localStorage.getItem("cartcount") || 0;
$("#cartCount").text(cartCount);

const postListPromise = new Promise((resolve, reject) => {
  $.get(
    `https://5fc0748dfd14be0016749cfe.mockapi.io/karthik/shoplane/${
      window.location.search.split("=")[1]
    }`,
    (data) => {
      resolve(data);
    }
  ).fail((err) => {
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
    dataMaking(productList);
  })
  .catch((error) => {
    console.log(`Catch Error => `, error);
  });
function dataMaking(data) {
  $("#cardInfo").append(
    $("<div>")
      .attr("id", "main_img")
      .append(
        $("<img>").attr({
          id: data.id,
          src: data.preview,
          alt: data.id,
        }),
        $("<div>")
          .attr("id", "floatingImgDiv")
          .append(
            $("<img>").attr({
              id: "floatingImg",
              src: data.preview,
              alt: data.id,
            })
          )
      ),
    $("<div>")
      .attr("class", "content")
      .append(
        $("<h1>").attr("id", "name").text(data.name),
        $("<p>").attr("id", "brand").text(data.brand),
        $("<p>").html(`Price: Rs <span id="price">${data.price}</span></p>`),
        $("<p>").text("Description"),
        $("<p>").attr("id", "description").text(data.description),
        $("<p>").text("Product Preview"),
        $("<div>").attr("id", "images"),
        $("<div>")
          .attr("class", "btn")
          .append($("<button>").attr("id", "add-to-cart").text("Add to Cart"))
      )
  );

  for (var i = 0; i < data.photos.length; i++) {
    $("#images").append(
      $("<img>").attr({
        class: "photos",
        id: `photo${i}`,
        src: data.photos[i],
      })
    );
  }
  console.log($("#images")[0]);
  $("#photo0").addClass("active");
  $(".photos").click(function (e) {
    $(".photos").removeClass("active");
    $(`#${e.target.id}`).addClass("active");
    $(`#${data.id}`).attr("src", e.target.src);
    $(`#floatingImg`).attr("src", e.target.src);
  });

  $("#add-to-cart").click(() => {
    var currentWidth = window.innerWidth;
    if (currentWidth > 768) {
      $(window).scrollTop(0);
      cartCount++;
      window.localStorage.setItem("cartcount", cartCount);
      cartData.push(data);
      window.localStorage.setItem("cartdata", JSON.stringify(cartData));
      delayfun(data);
    } else {
      $(window).scrollTop(0);
      cartCount++;
      window.localStorage.setItem("cartcount", cartCount);
      cartData.push(data);
      window.localStorage.setItem("cartdata", JSON.stringify(cartData));
      setTimeout(function () {
        delayfun(data);
      }, 500);
    }
  });
}
function delayfun(data) {
  $("#floatingImgDiv").attr(
    "style",
    "height:50%; width: 50%; display:block; animation: imgTravel 2s"
  );
  setTimeout(function () {
    $("#floatingImgDiv").attr(
      "style",
      "height:50%; width: 50%; display:none; animation: none"
    );
  }, 2000);
  setTimeout(function () {
    $("#cartCount").text(cartCount);
  }, 1500);
}
