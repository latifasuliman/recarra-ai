let fakeVIN = "1HGCM82633A123456";
let fakePlate = "ABC1234";

function openCameraModal() {
  const modal = document.getElementById("cameraModal");
  if (modal) {
    modal.style.display = "flex";
    startCamera();
  }
}

function closeCameraModal() {
  const modal = document.getElementById("cameraModal");
  if (modal) {
    modal.style.display = "none";
    stopCamera();
  }
}

function startCamera() {
  const video = document.getElementById("videoStream");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Camera not supported");
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Error accessing camera: " + err.message);
    });
}

function stopCamera() {
  const video = document.getElementById("videoStream");
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
}

function capturePhoto() {
  closeCameraModal();
  alert("Simulated scan complete. VIN or Plate will be inserted.");
}