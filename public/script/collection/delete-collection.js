document.addEventListener("DOMContentLoaded", function () {
  const deleteCollectionBtn = document.getElementById("deleteCollectionBtn");

  // Add event listener to the button
  deleteCollectionBtn.addEventListener("click", deleteCollection);

  /**
   * Delete a collection
   */
  function deleteCollection() {
    if (
      confirm(
        "Are you sure you want to delete this collection? All its images will be deleted too.",
      )
    ) {
    }
    const collectionId = deleteCollectionBtn.dataset.collectionId;

    // Send DELETE request to delete collection
    fetch(`/collection/${collectionId}`, {
      method: "DELETE",
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
      window.location.href = "/collection";
    } else {
      alert("Failed to delete the collection. Please try again later.");
    }
  }

  /**
   * Handle errors, either from fetch or the server.
   * @param {Error} error
   */
  function handleError(error) {
    console.error("Error:", error);
    alert("Failed to delete the collection. Please try again later.");
  }
});
