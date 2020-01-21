window.addEventListener("load", () => {
  document.getElementById("car-edit-button").onclick = function() {
    //console.log("pushed the Button");

    let updateCarDetailsButton = document.getElementById("update-car-details");
    let updateCarImage = document.getElementById("autobild");

    //console.log(updateCarDetailsButton.style.display);
    //console.log(updateCarImage.style.display);

    if (
      updateCarDetailsButton.style.display === "none" &&
      updateCarImage.style.display === "none"
    ) {
      updateCarDetailsButton.style.display = "";
      updateCarImage.style.display = "";
    } else {
      updateCarDetailsButton.style.display = "none";
      updateCarImage.style.display = "none";
    }

    const carEditFieldset = document.getElementById("car-edit-fieldset");
    carEditFieldset.disabled = !carEditFieldset.disabled;
  };
});
