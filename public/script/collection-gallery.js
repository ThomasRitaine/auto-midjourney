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
  item.addEventListener("click", function (event) {
    if (
      !event.target.classList.contains("btn-download") &&
      !event.target.classList.contains("btn-delete")
    ) {
      item.classList.toggle("full");
    }
  });
});

// Action Buttons
document.addEventListener("DOMContentLoaded", function () {
  // Add event listener for download
  const downloadButtons = document.querySelectorAll(".btn-download");
  downloadButtons.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      const imageUrl = event.target
        .closest(".content")
        .querySelector("img").src;
      const anchor = document.createElement("a");
      anchor.href = imageUrl;
      anchor.download = "";
      anchor.click();
    });
  });

  // Add event listener for delete
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async function (event) {
      if (confirm("Are you sure you want to delete this image?")) {
        const imageUrl = event.target
          .closest(".content")
          .querySelector("img").src;
        const imageID = imageUrl.split("/").pop().split(".")[0]; // Extracting image ID from the URL

        try {
          const response = await fetch(`/image/${imageID}`, {
            method: "DELETE",
          });

          if (response.status === 200) {
            // Successfully deleted from server, now remove from the DOM
            event.target.closest(".gallery-item").remove();
          } else {
            alert("Error deleting the image. Please try again.");
          }
        } catch (error) {
          console.error("Error sending DELETE request:", error);
          alert(
            "Failed to delete the image. Please check your connection and try again."
          );
        }
      }
    });
  });
});
