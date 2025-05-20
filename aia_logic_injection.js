function renderNextQuestion() {
  const chat = document.getElementById("chatMessages");
  const question = document.createElement("div");
  question.textContent = "What is your License Plate or VIN?";
  question.style.padding = "1rem";
  question.style.border = "1px solid #ccc";
  question.style.borderRadius = "8px";
  question.style.marginTop = "1rem";
  chat.appendChild(question);
}