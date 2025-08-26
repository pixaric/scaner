const scanBtn = document.getElementById("scan-btn");
const readerDiv = document.getElementById("reader");
const resultP = document.getElementById("result");

let html5QrCode;

scanBtn.addEventListener("click", () => {
  readerDiv.classList.remove("hidden");
  scanBtn.disabled = true;

  html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      resultP.innerText = `Código escaneado: ${decodedText}`;
      html5QrCode.stop();
      readerDiv.classList.add("hidden");
      scanBtn.disabled = false;

      // Simulación de envío a base de datos
      fetch("https://tu-api.com/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: decodedText })
      })
      .then(res => res.json())
      .then(data => console.log("Datos guardados:", data))
      .catch(err => console.error("Error al guardar:", err));
    },
    (errorMessage) => {
      console.warn("Error de escaneo:", errorMessage);
    }
  );
});
