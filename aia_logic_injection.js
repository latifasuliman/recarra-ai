const aiaQuestions = [];
let currentStep = 0;
const answers = {};

// Define the question flow dynamically
aiaQuestions.push({"id": "plate_or_vin", "question": "What is your License Plate or VIN?", "type": "text", "required": true});
aiaQuestions.push({"id": "vehicle_info", "question": "What is your vehicle's Year, Make, and Model?", "type": "text", "required": true});
aiaQuestions.push({"id": "full_name", "question": "Please enter your Full Name.", "type": "text", "required": true, "validation": "name"});
aiaQuestions.push({"id": "phone", "question": "What's your Mobile Number?", "type": "phone", "required": true, "validation": "phone"});
aiaQuestions.push({"id": "email", "question": "And your Email Address?", "type": "email", "required": true, "validation": "email"});
aiaQuestions.push({"id": "running", "question": "Is your car currently running?", "type": "choice", "options": ["Yes", "No"], "required": true});
aiaQuestions.push({"id": "title_type", "question": "What type of title do you have? (Clean, Salvage, None)", "type": "choice", "options": ["Clean", "Salvage", "None"], "required": true});
aiaQuestions.push({"id": "keys", "question": "Do you have all the keys for the vehicle?", "type": "choice", "options": ["Yes", "No"], "required": true});
aiaQuestions.push({"id": "tires", "question": "What is the condition of the tires?", "type": "choice", "options": ["All Good", "Some Flat", "All Flat", "Missing"], "required": true});
aiaQuestions.push({"id": "damage", "question": "Is there any visible damage to the car?", "type": "choice", "options": ["Yes", "No"], "required": true});
aiaQuestions.push({"id": "damage_photo", "question": "Please upload a photo of the damaged area.", "type": "file", "required_if": {"damage": "Yes"}});
aiaQuestions.push({"id": "photos", "question": "Please upload the following photos: Front, Rear, Right Side, Left Side, Engine, Dashboard.", "type": "file", "required": true, "multiple": true});

function renderNextQuestion() {
  const container = document.getElementById('chatMessages');
  const inputSection = document.getElementById('chatInputSection');
  inputSection.innerHTML = ''; // Clear old inputs

  if (currentStep >= aiaQuestions.length) {
    showFinalStep();
    return;
  }

  const q = aiaQuestions[currentStep];
  const aiMsg = document.createElement('div');
  aiMsg.style.margin = '1rem 0';
  aiMsg.innerHTML = `<strong>AiA:</strong> ${q.question}`;
  container.appendChild(aiMsg);

  let inputElem;

  if (q.type === 'choice') {
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(q.id, opt);
      inputSection.appendChild(btn);
    });
  } else if (q.type === 'file') {
    inputElem = document.createElement('input');
    inputElem.type = 'file';
    if (q.multiple) inputElem.multiple = true;
    inputElem.onchange = () => handleAnswer(q.id, inputElem.files);
    inputSection.appendChild(inputElem);
  } else {
    inputElem = document.createElement('input');
    inputElem.type = 'text';
    inputElem.placeholder = 'Type your answer...';
    inputElem.onkeydown = (e) => { if (e.key === 'Enter') handleAnswer(q.id, inputElem.value.trim()); };
    inputSection.appendChild(inputElem);
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.onclick = () => handleAnswer(q.id, inputElem.value.trim());
    inputSection.appendChild(nextBtn);
  }

  container.scrollTop = container.scrollHeight;
}

function handleAnswer(id, value) {
  const q = aiaQuestions[currentStep];

  if (q.required && (!value || (value.length === 0))) {
    alert('This question is required.');
    return;
  }

  if (q.validation === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    alert('Enter a valid email.');
    return;
  }
  if (q.validation === 'phone' && !/^\d{10}$/.test(value.replace(/\D/g, ''))) {
    alert('Enter a valid 10-digit mobile number.');
    return;
  }

  answers[id] = value;

  const msg = document.createElement('div');
  msg.style.margin = '1rem 0';
  msg.innerHTML = `<strong>You:</strong> ${typeof value === 'string' ? value : '[Photo Uploaded]'}`;
  document.getElementById('chatMessages').appendChild(msg);

  // Conditional logic check
  if (q.id === 'damage' && value === 'No') {
    // Skip damage photo step
    const damageIndex = aiaQuestions.findIndex(x => x.id === 'damage_photo');
    if (damageIndex > -1 && damageIndex > currentStep) {
      aiaQuestions.splice(damageIndex, 1);
    }
  }

  currentStep++;
  renderNextQuestion();
}


function showFinalStep() {
  const container = document.getElementById('chatMessages');
  const inputSection = document.getElementById('chatInputSection');
  inputSection.style.display = 'none';

  const crunch = document.createElement('div');
  crunch.style.margin = '1rem 0';
  crunch.innerHTML = '<strong>AiA:</strong> Crunching numbers... please wait.';
  container.appendChild(crunch);

  setTimeout(() => {
    const offerValue = 400 + Math.floor(Math.random() * 500 + 300);
    const offer = '$' + offerValue;
    const offerId = 'RC' + Math.floor(Math.random() * 9000 + 1000);

    const summary = document.createElement('div');
    summary.style.margin = '1rem 0';
    summary.innerHTML = `
      <strong>AiA:</strong><br/>
      <div style="margin-top: 1rem; font-size: 1.1rem;">
        <strong>Your AI Offer Amount:</strong> 
        <span style="font-size: 1.5rem; color: green; font-weight: bold;">${offer}</span><br/><br/>
        <strong>Confirmation Code:</strong> 
        <span id="offerCode" style="font-weight: bold; font-size: 1.2rem;">#${offerId}</span><br/><br/>
        <button onclick="copyOfferCode('${offerId}')" style="padding: 0.5rem 1rem; border-radius: 10px; background: #0074D9; color: white; border: none; font-weight: bold;">Copy Confirmation Code</button>
        <p style="margin-top: 1rem; font-size: 0.95rem; color: #444;">
          Save this code to check your payment status or confirm your deal.
        </p>
      </div>
      <div style="margin-top: 1rem;">
        <button onclick="acceptOffer()">Accept</button>
        <button onclick="rejectOffer()">Reject</button>
        <button onclick="saveOffer()">Save for Later</button>
      </div>`;
    container.appendChild(summary);
    launchConfetti();

    const audio = new Audio('recarra_offer_voice.mp3');
    audio.play();

    setTimeout(stopConfetti, 3000);
  }, 3000);
}

function copyOfferCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    alert("Confirmation code copied to clipboard!");
  });
}

function stopConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
}


window.onload = () => {
  document.getElementById('chatMessages').innerHTML = '';
  renderNextQuestion();
};
