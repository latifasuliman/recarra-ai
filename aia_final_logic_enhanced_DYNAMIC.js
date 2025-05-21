
let formData = {};
let currentStep = 0;
let questions = [];

function loadQuestionsAndStart() {
  fetch('aia_question_flow_with_bonus.json')
    .then(res => res.json())
    .then(data => {
      questions = data.questions || [];
      injectSteps(questions);
      renderNextQuestion();
    })
    .catch(err => {
      console.error("Failed to load questions:", err);
      document.getElementById('chatMessages').innerHTML = "<p style='color:red;'>Failed to load form. Please try again.</p>";
    });
}

function injectSteps(questions) {
  const container = document.getElementById('chatForm');
  if (!container) return;
  questions.forEach((q, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "form-step";
    wrapper.style.display = "none";

    const label = document.createElement("label");
    label.innerHTML = q.label || "Question " + (index + 1);
    label.style.display = "block";
    label.style.fontWeight = "bold";

    let input;
    if (q.type === "file") {
      input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.required = q.required || false;
    } else if (q.type === "select" && q.options) {
      input = document.createElement("select");
      q.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.type = q.type || "text";
      input.placeholder = q.placeholder || "";
      input.required = q.required || false;
    }

    input.name = q.name || "step" + index;
    input.id = input.name;

    const btn = document.createElement("button");
    btn.textContent = "Next";
    btn.type = "button";
    btn.onclick = () => {
      const val = input.value.trim();
      if (q.type === "file") {
        if (!input.files.length && q.required) {
          input.classList.add("error");
          return;
        } else {
          formData[input.name] = input.files[0];
        }
      } else if (val === "" && q.required) {
        input.classList.add("error");
        return;
      } else {
        formData[input.name] = val;
      }
      currentStep++;
      renderNextQuestion();
    };

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
  });
}

function renderNextQuestion() {
  const steps = document.querySelectorAll(".form-step");
  steps.forEach((step, index) => {
    step.style.display = index === currentStep ? "block" : "none";
  });

  const progress = document.getElementById("formProgressBar");
  if (progress && steps.length) {
    progress.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
  }
}

window.addEventListener("DOMContentLoaded", loadQuestionsAndStart);
