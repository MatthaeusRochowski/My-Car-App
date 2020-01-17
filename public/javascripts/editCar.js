window.addEventListener("load", () => {
  document
    .getElementById("car-edit-button").onclick = function () {
      console.log("pushed the Button");
      const carEditFieldset = document.getElementById('car-edit-fieldset');
      carEditFieldset.disabled = !carEditFieldset.disabled;
    };
});
