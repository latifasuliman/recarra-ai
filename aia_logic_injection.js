
let currentStep = 0;
let questions = [];
let formData = {};

async function fetchQuestions() {
  try {
    const response = await fetch('aia_question_flow.json');
    questions = await response.json();
    renderNextQuestion();
  } catch (error) {
    document.getElementById('chatMessages').innerText = 'Error loading form.';
    console.error('Failed to load questions:', error);
  }
}

function renderNextQuestion() {
  const chat = document.getElementById('chatMessages');
  chat.innerHTML = '';
  if (currentStep >= questions.length) {
    document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
    document.getElementById('formProgressBar').style.width = '100%';
    document.getElementById('finalOfferAmount').innerText = 'Crunching your AiA Offer...';
    document.getElementById('finalOfferAmount').style.display = 'block';
    submitToBackend();
    return;
  }

  const q = questions[currentStep];
  const label = document.createElement('label');
  label.textContent = q.question;
  label.setAttribute('for', 'chatInput');
  chat.appendChild(label);

  const input = document.createElement('input');
  input.type = q.type === 'file' ? 'file' : 'text';
  input.id = 'chatInput';
  input.name = q.id;
  if (q.type === 'file' && q.multiple) input.multiple = true;
  input.required = q.required || false;
  input.style.marginTop = '10px';
  chat.appendChild(input);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.type = 'button';
  nextBtn.style.marginTop = '1rem';
  nextBtn.onclick = handleAnswer;
  chat.appendChild(nextBtn);

  const progress = Math.floor((currentStep / questions.length) * 100);
  document.getElementById('formProgressBar').style.width = progress + '%';
}

function handleAnswer() {
  const input = document.getElementById('chatInput');
  const value = input.type === 'file' ? input.files : input.value.trim();
  if ((input.type !== 'file' && value === '') || (input.type === 'file' && value.length === 0)) {
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 300);
    return;
  }

  const q = questions[currentStep];
  formData[q.id] = value;
  currentStep++;
  renderNextQuestion();
}

function submitToBackend() {
  fetch('/api/submit-offer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('finalOfferAmount').innerHTML = `Your AiA Offer: $${data.offer}`;
    document.getElementById('finalOfferAmount').style.display = 'block';
    if (window.confetti) confetti(); // Optional
    if (data.offerId) {
      document.getElementById('offerId').innerText = data.offerId;
      document.getElementById('thankYouScreen').style.display = 'block';
    }
  })
  .catch(error => {
    document.getElementById('finalOfferAmount').innerHTML = "Error generating offer. Please try again.";
    document.getElementById('finalOfferAmount').style.color = "#cc0000";
    document.getElementById('finalOfferAmount').style.display = 'block';
  });
}

window.addEventListener('DOMContentLoaded', fetchQuestions);
