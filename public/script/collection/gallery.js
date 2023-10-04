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
  let count = 0;
  const checkComplete = setInterval(function () {
    if (item.complete) {
      clearInterval(checkComplete);
      const altura = getVal(gallery, "grid-auto-rows");
      const gap = getVal(gallery, "grid-row-gap");
      const gitem = item.parentElement.parentElement;
      gitem.style.gridRowEnd =
        "span " + Math.ceil((getHeight(gitem) + gap) / (altura + gap));
      item.classList.remove("byebye");
    } else if (count >= 6) {
      clearInterval(checkComplete);
      console.log(`Failed to load ${item.src} after 6 attempts`);
    }
    count++;
  }, 300);
});
window.addEventListener("resize", resizeAll);
gallery.querySelectorAll(".gallery-item").forEach(function (item) {
  item.addEventListener("click", function (event) {
    if (
      !event.target.classList.contains("btn-download") &&
      !event.target.classList.contains("btn-prompt") &&
      !event.target.classList.contains("btn-favourite") &&
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

  // Add event listener for prompt
  const promptButtons = document.querySelectorAll(".btn-prompt");
  promptButtons.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      alert(btn.dataset.prompt);
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
        const imageId = imageUrl.split("/").pop().split(".")[0]; // Extracting image ID from the URL

        try {
          const response = await fetch(`/image/${imageId}`, {
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
            "Failed to delete the image. Please check your connection and try again.",
          );
        }
      }
    });
  });

  // Add event listener for favourite
  const favouriteButtons = document.querySelectorAll(".btn-favourite");
  favouriteButtons.forEach((btn) => {
    btn.addEventListener("click", async function (event) {
      const imageUrl = event.target
        .closest(".content")
        .querySelector("img").src;
      const imageId = imageUrl.split("/").pop().split(".")[0]; // Extracting image ID from the URL
      const newStatus = btn.dataset.isFavourite !== "true";

      try {
        const response = await fetch(`/image/${imageId}/favourite`, {
          method: newStatus ? "POST" : "DELETE",
        });

        if (response.status === 200) {
          // Successfully deleted from server, now remove from the DOM
          btn.innerHTML = newStatus
            ? "Remove from Favour"
            : "Add to Favourites";
          btn.dataset.isFavourite = newStatus;
        } else {
          alert("Error adding the image to favourites. Please try again.");
        }
      } catch (error) {
        console.error("Error sending DELETE request:", error);
        alert("Error adding the image to favourites. Please try again.");
      }
    });
  });
});
