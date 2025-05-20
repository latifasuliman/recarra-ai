
document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".form-step");
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.remove("active");
      step.style.display = "none";
    });
    steps[index].classList.add("active");
    steps[index].style.display = "block";

    const progressBar = document.getElementById("formProgressBar");
    if (progressBar) {
      const percent = Math.floor(((index + 1) / steps.length) * 100);
      progressBar.style.width = percent + "%";
    }
  }

  function goToNextStep() {
    const currentField = steps[currentStep].querySelector("input, select");
    if (currentField && currentField.value.trim() !== "") {
      currentStep++;
      if (currentStep < steps.length) {
        showStep(currentStep);
      }
    } else if (currentField) {
      currentField.classList.add("error");
      setTimeout(() => currentField.classList.remove("error"), 300);
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      goToNextStep();
    }
  });

  const nextBtns = document.querySelectorAll("button");
  nextBtns.forEach(btn => {
    if (btn.textContent === "Next") {
      btn.addEventListener("click", e => {
        e.preventDefault();
        goToNextStep();
      });
    }
  });

  showStep(currentStep);

  // VIN and License Plate scan simulation (placeholder backend connection)
  document.getElementById("scanVinBtn")?.addEventListener("click", () => {
    const input = document.getElementById("licenseInput");
    if (input) input.value = "1HGCM82633A004352"; // Example VIN
  });

  document.getElementById("scanPlateBtn")?.addEventListener("click", () => {
    const input = document.getElementById("licenseInput");
    if (input) input.value = "TX-PLT-9921"; // Example plate
  });

  // Image previews
  const photoInputs = document.querySelectorAll("input[type='file']");
  photoInputs.forEach(input => {
    input.addEventListener("change", function () {
      const previewId = input.id + "_preview";
      let preview = document.getElementById(previewId);
      if (!preview) {
        preview = document.createElement("img");
        preview.id = previewId;
        preview.style.maxWidth = "200px";
        preview.style.display = "block";
        preview.style.margin = "10px auto";
        input.insertAdjacentElement("afterend", preview);
      }

      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  });
});
