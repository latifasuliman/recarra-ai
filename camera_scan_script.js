function openCameraModal() {
  const modal = document.getElementById("cameraModal");
  const video = document.getElementById("videoStream");
  modal.style.display = "flex";

  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
  }).catch(err => {
    alert("Camera access denied or unavailable.");
    modal.style.display = "none";
  });
}

function capturePhoto() {
  const canvas = document.getElementById("canvasCapture");
  const video = document.getElementById("videoStream");
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const base64Image = canvas.toDataURL("image/jpeg");

  fetch('/api/scan-vin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: base64Image })
  })
  .then(res => res.json())
  .then(data => {
    if (data.vin) {
      document.getElementById("chatInput").value = data.vin;
      fetchDecodedInfo(data.vin);
      closeCameraModal();
    } else {
      alert("Could not detect a VIN. Please try again.");
    }
  })
  .catch(() => {
    alert("Scan failed. Please try again.");
  });
}

function closeCameraModal() {
  const modal = document.getElementById("cameraModal");
  modal.style.display = "none";
  const video = document.getElementById("videoStream");
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
}