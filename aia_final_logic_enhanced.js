
document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".form-step");
  const progressBar = document.getElementById("formProgressBar");
  const stepCounter = document.createElement("div");

  stepCounter.id = "stepCounter";
  stepCounter.style.textAlign = "center";
  stepCounter.style.fontSize = "0.9rem";
  stepCounter.style.marginBottom = "0.5rem";
  if (progressBar && progressBar.parentElement) {
    progressBar.parentElement.insertAdjacentElement("beforebegin", stepCounter);
  }

  let currentStep = 0;

  function updateProgress() {
    if (!progressBar || steps.length === 0) return;
    const percent = Math.round(((currentStep + 1) / steps.length) * 100);
    progressBar.style.width = percent + "%";
    stepCounter.textContent = "Step " + (currentStep + 1) + " of " + steps.length;
  }

  function showStep(index) {
    steps.forEach((step) => step.style.display = "none");
    if (steps[index]) {
      steps[index].style.display = "block";
      updateProgress();
    }
  }

  function validateStep() {
    const input = steps[currentStep].querySelector("input, select");
    if (!input) return true;
    if (input.type === "file") {
      if (input.files.length > 0) return true;
      const reason = prompt("No photo uploaded. Please explain why:");
      if (reason && reason.trim().length > 3) {
        input.setAttribute("data-skip-reason", reason.trim());
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
    const label = btn.textContent.trim().toLowerCase();
    if (label === "next") {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        goToNextStep();
      });
    }
    if (label.includes("submit")) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        submitOfferToBackend();
      });
    }
  });

  // Initialize
  showStep(currentStep);
});

// Final submit simulation
function submitOfferToBackend() {
  const offerAmountEl = document.getElementById('finalOfferAmount');
  const offerIdEl = document.getElementById('offerId');
  const thankYouEl = document.getElementById('thankYouScreen');
  const crunchingMsg = document.getElementById('crunchingMsg');

  if (offerAmountEl) offerAmountEl.style.display = 'none';
  if (thankYouEl) thankYouEl.style.display = 'none';
  if (crunchingMsg) crunchingMsg.style.display = 'block';

  setTimeout(() => {
    if (crunchingMsg) crunchingMsg.style.display = 'none';
    if (offerAmountEl) {
      offerAmountEl.innerHTML = "Your AiA Offer: $785";
      offerAmountEl.style.display = 'block';
    }
    if (offerIdEl) {
      const generatedId = "RC" + Math.floor(1000 + Math.random() * 9000);
      offerIdEl.innerText = generatedId;
    }
    if (thankYouEl) thankYouEl.style.display = 'block';
    if (typeof confetti === "function") confetti();
  }, 2500);
}
