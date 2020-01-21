window.addEventListener("load", () => {
  document.getElementById("car-edit-button").onclick = function() {
    //console.log("pushed the Button");

    let updateCarDetailsButton = document.getElementById("update-car-details");
    let updateCarImage = document.getElementById("autobild");
    let updateCarImageButton = document.getElementById("update-car-picture");
    

    //console.log(updateCarDetailsButton.style.display);
    //console.log(updateCarImage.style.display);

    if (
      updateCarDetailsButton.style.display === "none" &&
      updateCarImage.style.display === "none" &&
      updateCarImageButton.style.display
    ) {
      updateCarDetailsButton.style.display = "";
      updateCarImage.style.display = "";
      updateCarImageButton.style.display = "";
    } else {
      updateCarDetailsButton.style.display = "none";
      updateCarImage.style.display = "none";
      updateCarImageButton.style.display = "none";
    }

    const carEditFieldset = document.getElementById("car-edit-fieldset");
    carEditFieldset.disabled = !carEditFieldset.disabled;
  };
});
