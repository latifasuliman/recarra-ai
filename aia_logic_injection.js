
document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".form-step");
  const progressBar = document.getElementById("formProgressBar");
  const stepCounter = document.createElement("div");

  stepCounter.id = "stepCounter";
  stepCounter.style.textAlign = "center";
  stepCounter.style.fontSize = "0.9rem";
  stepCounter.style.marginBottom = "0.5rem";
  progressBar.parentElement.insertAdjacentElement("beforebegin", stepCounter);

  let currentStep = 0;

  function updateProgress() {
    const percent = Math.round(((currentStep + 1) / steps.length) * 100);
    progressBar.style.width = percent + "%";
    stepCounter.textContent = "Step " + (currentStep + 1) + " of " + steps.length;
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.remove("active");
      step.style.display = "none";
    });
    steps[index].classList.add("active");
    steps[index].style.display = "block";
    updateProgress();
  }

  function validateStep() {
    const input = steps[currentStep].querySelector("input, select");
    if (!input) return true;
    if (input.type === "file") {
      if (input.files.length > 0) return true;
      const skipReason = prompt("No photo uploaded. Enter a reason to skip or click Cancel:");
      if (skipReason && skipReason.length > 2) {
        input.setAttribute("data-skip-reason", skipReason);
        return true;
      } else {
        return false;
      }
    }
    return input.value.trim() !== "";
  }

  function goToNextStep() {
    if (!validateStep()) {
      const input = steps[currentStep].querySelector("input, select");
      if (input) {
        input.classList.add("error");
        setTimeout(() => input.classList.remove("error"), 300);
      }
      return;
    }

    currentStep++;
    if (currentStep < steps.length) {
      showStep(currentStep);
    }
  }

  document.querySelectorAll("button").forEach((btn) => {
    if (btn.textContent.trim().toLowerCase() === "next") {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        goToNextStep();
      });
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      goToNextStep();
    }
  });

  showStep(currentStep);
});
