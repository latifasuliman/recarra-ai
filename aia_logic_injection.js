let step = 0;
const answers = {};
const totalSteps = 7;

function renderNextQuestion() {
  const chat = document.getElementById("chatMessages");
  const question = document.createElement("div");
  question.style.padding = "1rem";
  question.style.border = "1px solid #ccc";
  question.style.borderRadius = "8px";
  question.style.marginTop = "1rem";

  const progress = document.createElement("div");
  progress.style.marginBottom = "0.5rem";
  progress.style.fontSize = "0.9rem";
  progress.style.color = "gray";
  progress.textContent = `Step ${Math.min(step + 1, totalSteps)} of ${totalSteps}`;
  chat.appendChild(progress);

  if (step === 0) {
    const countdown = document.createElement("div");
    countdown.id = "countdown";
    countdown.style.color = "red";
    countdown.style.marginBottom = "0.5rem";
    chat.appendChild(countdown);
    startCountdown(120);
  }

  if (step === 0) {
    question.textContent = "AiA: What is your License Plate or VIN?";
  } else if (step === 1) {
    question.textContent = "AiA: What year is your car?";
  } else if (step === 2) {
    question.textContent = "AiA: What make and model?";
  } else if (step === 3) {
    question.textContent = "AiA: Is the engine running?";
  } else if (step === 4) {
    question.textContent = "AiA: Please upload the front, back, engine and dashboard photos:";
    chat.appendChild(question);
    renderPhotoUpload(chat);
    return;
  } else if (step === 5) {
    question.textContent = "AiA: Do you have the title in hand?";
  } else if (step === 6) {
    question.textContent = "AiA: Please enter your contact details to receive your offer:";

    const formDiv = document.createElement("div");
    formDiv.innerHTML = `
      <label>Full Name:<br><input type="text" id="fullName" required></label><br><br>
      <label>Mobile Number:<br><input type="tel" id="mobileNumber" required></label><br><br>
      <label>Email (optional):<br><input type="email" id="emailAddress"></label><br><br>
      <label><input type="checkbox" id="consentBox" required> I agree to receive my offer via SMS or email.</label><br><br>
      <button onclick="submitContactInfo()">Submit Contact Info</button>
    `;
    formDiv.style.padding = "1rem";
    formDiv.style.border = "1px solid #ccc";
    formDiv.style.borderRadius = "8px";
    formDiv.style.marginTop = "1rem";
    chat.appendChild(question);
    chat.appendChild(formDiv);
    return;
  } else {
    question.innerHTML = `<strong>Calculating your offer...</strong>`;
    chat.appendChild(question);
    setTimeout(showOffer, 2000);
    return;
  }

  chat.appendChild(question);
}

function handleAnswer(userInput) {
  answers[`q${step}`] = userInput;
  step++;
  renderNextQuestion();
}

function renderPhotoUpload(container) {
  const uploadDiv = document.createElement("div");
  uploadDiv.innerHTML = `
    <label>Front Photo: <input type="file" id="photoFront" required></label><br>
    <label>Back Photo: <input type="file" id="photoBack" required></label><br>
    <label>Engine Photo: <input type="file" id="photoEngine" required></label><br>
    <label>Dashboard Photo: <input type="file" id="photoDash" required></label><br>
    <button onclick="submitPhotos()" style="margin-top: 10px;">Submit Photos</button>
  `;
  uploadDiv.style.padding = "1rem";
  uploadDiv.style.border = "1px dashed #aaa";
  uploadDiv.style.marginTop = "1rem";
  container.appendChild(uploadDiv);
}

function submitPhotos() {
  const front = document.getElementById("photoFront").files[0];
  const back = document.getElementById("photoBack").files[0];
  const engine = document.getElementById("photoEngine").files[0];
  const dash = document.getElementById("photoDash").files[0];

  if (!front || !back || !engine || !dash) {
    alert("Please upload all required photos.");
    return;
  }

  answers.photos = { front, back, engine, dash };
  step++;
  renderNextQuestion();
}

function submitContactInfo() {
  const name = document.getElementById("fullName").value.trim();
  const mobile = document.getElementById("mobileNumber").value.trim();
  const email = document.getElementById("emailAddress").value.trim();
  const consent = document.getElementById("consentBox").checked;

  if (!name || !mobile || !consent) {
    alert("Name, mobile number, and consent are required.");
    return;
  }

  answers.contact = { name, mobile, email };
  step++;
  renderNextQuestion();
}

function showOffer() {
  const chat = document.getElementById("chatMessages");
  const offerID = "RC" + Math.floor(1000 + Math.random() * 9000);
  triggerConfetti();

  const result = document.createElement("div");
  result.innerHTML = `
    <h3>AiA: Your instant cash offer is ready.</h3>
    <p>Offer ID: <code id="offerID">${offerID}</code> <button onclick="copyOfferID()">Copy</button></p>
    <p>This offer is valid for 24 hours. Call or text now to lock it in!</p>
  `;
  result.style.marginTop = "20px";
  result.style.padding = "1rem";
  result.style.border = "2px solid green";
  result.style.borderRadius = "10px";
  result.style.background = "#eaffea";
  chat.appendChild(result);
}

function copyOfferID() {
  const id = document.getElementById("offerID").innerText;
  navigator.clipboard.writeText(id);
  alert("Offer ID copied: " + id);
}

function startCountdown(seconds) {
  const countdown = document.getElementById("countdown");
  const timer = setInterval(() => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    countdown.textContent = `⏳ Submit within ${min}:${sec < 10 ? "0" + sec : sec} to claim $100 bonus!`;
    seconds--;
    if (seconds < 0) clearInterval(timer);
  }, 1000);
}

function triggerConfetti() {
  const confetti = document.createElement("div");
  confetti.textContent = "🎉";
  confetti.style.fontSize = "3rem";
  confetti.style.position = "fixed";
  confetti.style.top = "20%";
  confetti.style.left = "50%";
  confetti.style.transform = "translateX(-50%)";
  confetti.style.animation = "fall 3s ease-out";
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 3000);
}
