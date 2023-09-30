document.addEventListener("DOMContentLoaded", function () {
  const toggleVisibilityBtn = document.getElementById("toggleVisibilityBtn");

  // Add event listener to the button
  toggleVisibilityBtn.addEventListener("click", toggleCollectionVisibility);

  /**
   * Toggle the visibility of a collection
   */
  function toggleCollectionVisibility() {
    const collectionId = toggleVisibilityBtn.dataset.collectionId;
    const isPublicStatus = toggleVisibilityBtn.dataset.isPublic === "true";
    const newStatus = !isPublicStatus;

    // Construct the request payload
    const payload = {
      isPublic: newStatus,
    };

    // Send POST request to toggle visibility status
    fetch(`/collection/${collectionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(handleSuccess)
      .catch(handleError);
  }

  /**
   * Handle a successful response from the server.
   * @param {Object} data
   */
  function handleSuccess(response) {
    if (response.status === 200) {
      location.reload();
    } else {
      alert("Failed to toggle visibility. Please try again later.");
    }
  }

  /**
   * Handle errors, either from fetch or the server.
   * @param {Error} error
   */
  function handleError(error) {
    console.error("Error:", error);
    alert("Failed to toggle visibility. Please try again later.");
  }
});
