let currentStep = 0;
const steps = [
  {
    "id": "plate_or_vin",
    "question": "What is your License Plate or VIN?",
    "type": "text",
    "required": true
  },
  {
    "id": "vehicle_info",
    "question": "What is your vehicle's Year, Make, and Model?",
    "type": "text",
    "required": true
  },
  {
    "id": "full_name",
    "question": "Please enter your Full Name.",
    "type": "text",
    "required": true,
    "validation": "name"
  },
  {
    "id": "phone",
    "question": "What's your Mobile Number?",
    "type": "phone",
    "required": true,
    "validation": "phone"
  },
  {
    "id": "email",
    "question": "And your Email Address?",
    "type": "email",
    "required": true,
    "validation": "email"
  },
  {
    "id": "running",
    "question": "Is your car currently running?",
    "type": "choice",
    "options": [
      "Yes",
      "No"
    ],
    "required": true
  },
  {
    "id": "title_type",
    "question": "What type of title do you have? (Clean, Salvage, None)",
    "type": "choice",
    "options": [
      "Clean",
      "Salvage",
      "None"
    ],
    "required": true
  },
  {
    "id": "keys",
    "question": "Do you have all the keys for the vehicle?",
    "type": "choice",
    "options": [
      "Yes",
      "No"
    ],
    "required": true
  },
  {
    "id": "tires",
    "question": "What is the condition of the tires?",
    "type": "choice",
    "options": [
      "All Good",
      "Some Flat",
      "All Flat",
      "Missing"
    ],
    "required": true
  },
  {
    "id": "damage",
    "question": "Is there any visible damage to the car?",
    "type": "choice",
    "options": [
      "Yes",
      "No"
    ],
    "required": true
  },
  {
    "id": "damage_photo",
    "question": "Please upload a photo of the damaged area.",
    "type": "file",
    "required_if": {
      "damage": "Yes"
    }
  },
  {
    "id": "photos",
    "question": "Please upload the following photos: Front, Rear, Right Side, Left Side, Engine, Dashboard.",
    "type": "file",
    "required": true,
    "multiple": true
  },
  {
    "id": "pickup_bonus_optin",
    "question": "Would you like same-day pickup to receive a $100 bonus on top of your AiA offer?",
    "type": "choice",
    "options": [
      "Yes \u2014 Pick Up Today!",
      "No \u2014 Schedule Later"
    ],
    "required": true
  }
];

document.addEventListener("DOMContentLoaded", () => {
  renderFormSteps();
  showStep(currentStep);

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
      input.type = step.type === "file" ? "file" : step.type === "email" ? "email" : step.type === "phone" ? "tel" : "text";
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