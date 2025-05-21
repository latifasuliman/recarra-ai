let currentStep = 0;
let steps = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("aia_form_structure.json")
    .then(res => res.json())
    .then(data => {
      steps = data;
      renderFormSteps();
      showStep(currentStep);
    });

  document.getElementById("nextBtn").addEventListener("click", nextStep);
  document.getElementById("prevBtn").addEventListener("click", prevStep);
  document.getElementById("aiaForm").addEventListener("submit", submitForm);
});

function renderFormSteps() {
  const container = document.getElementById("formStepsWrapper");
  steps.forEach((step, index) => {
    const stepDiv = document.createElement("div");
    stepDiv.className = "form-step";
    stepDiv.dataset.step = index;

    const label = document.createElement("label");
    label.htmlFor = step.id;
    label.textContent = step.question;

    let input;
    if (step.type === "choice") {
      input = document.createElement("select");
      input.id = step.id;
      input.name = step.id;
      step.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.id = step.id;
      input.name = step.id;
      input.type = step.type === "file" ? "file" : "text";
      if (step.multiple) input.multiple = true;
    }

    if (step.required) input.required = true;

    stepDiv.appendChild(label);
    stepDiv.appendChild(input);
    container.appendChild(stepDiv);
  });
}

function showStep(index) {
  const allSteps = document.querySelectorAll(".form-step");
  allSteps.forEach(step => step.classList.remove("active"));
  if (allSteps[index]) allSteps[index].classList.add("active");

  document.getElementById("prevBtn").style.display = index > 0 ? "inline-block" : "none";
  document.getElementById("nextBtn").style.display = index < steps.length - 1 ? "inline-block" : "none";
  document.getElementById("submitBtn").style.display = index === steps.length - 1 ? "inline-block" : "none";
}

function nextStep() {
  const currentField = document.querySelector(`.form-step[data-step='${currentStep}'] input, .form-step[data-step='${currentStep}'] select`);
  if (currentField && !currentField.checkValidity()) {
    currentField.classList.add("error");
    setTimeout(() => currentField.classList.remove("error"), 1000);
    return;
  }
  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  currentStep--;
  showStep(currentStep);
}

function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const output = {};
  for (let [key, value] of formData.entries()) {
    output[key] = value;
  }

  console.log("Form submitted:", output);
  form.style.display = "none";
  document.getElementById("confirmation").style.display = "block";
}