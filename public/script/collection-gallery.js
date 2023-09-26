const gallery = document.querySelector("#gallery");
const getVal = (elem, style) => {
  return parseInt(window.getComputedStyle(elem).getPropertyValue(style));
};
const getHeight = function (item) {
  return item.querySelector(".content").getBoundingClientRect().height;
};
const resizeAll = function () {
  const altura = getVal(gallery, "grid-auto-rows");
  const gap = getVal(gallery, "grid-row-gap");
  gallery.querySelectorAll(".gallery-item").forEach(function (item) {
    const el = item;
    el.style.gridRowEnd =
      "span " + Math.ceil((getHeight(item) + gap) / (altura + gap));
  });
};
gallery.querySelectorAll("img").forEach(function (item) {
  item.classList.add("byebye");
  if (item.complete) {
    console.log(item.src);
  } else {
    item.addEventListener("load", function () {
      const altura = getVal(gallery, "grid-auto-rows");
      const gap = getVal(gallery, "grid-row-gap");
      const gitem = item.parentElement.parentElement;
      gitem.style.gridRowEnd =
        "span " + Math.ceil((getHeight(gitem) + gap) / (altura + gap));
      item.classList.remove("byebye");
    });
  }
});
window.addEventListener("resize", resizeAll);
gallery.querySelectorAll(".gallery-item").forEach(function (item) {
  item.addEventListener("click", function () {
    item.classList.toggle("full");
  });
});
