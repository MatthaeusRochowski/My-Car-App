window.addEventListener("load", () => {
  document
    .getElementById("car-edit-button").onclick = function () {
      //console.log("pushed the Button");
      
      let updateCarDetailsButton = document.getElementById('update-car-details');
      console.log(updateCarDetailsButton.style.display);
      if (updateCarDetailsButton.style.display === "none") {
        updateCarDetailsButton.style.display = "";
      }
      else updateCarDetailsButton.style.display = "none";

      const carEditFieldset = document.getElementById('car-edit-fieldset');
      carEditFieldset.disabled = !carEditFieldset.disabled;
    };
});
