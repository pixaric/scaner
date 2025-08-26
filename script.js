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

      sendToSeaTable(decodedText);
    },
    (errorMessage) => {
      console.warn("Error de escaneo:", errorMessage);
    }
  );
});

function sendToSeaTable(decodedText) {
  let pedido;

  try {
    pedido = JSON.parse(decodedText);
    console.log("JSON válido:", pedido);
  } catch (err) {
    console.error("QR no contiene JSON válido:", err);
    alert("El código QR escaneado no contiene datos válidos.");
    return;
  }

  const API_URL = "https://cloud.seatable.io/api/v2.1/dtables/a167a9d0-fd5b-4ca0-a209-4f0c5ffe95c0/rows/";
  const API_TOKEN = "14d285b809b2f3a9e775a3a46bb2c13818c6a0f4";
  const TABLE_NAME = "Pedidos";

  pedido.pedido.forEach((item) => {
    const rowData = {
      table_name: TABLE_NAME,
      row: {
        Mesa: pedido.cliente,
        Cliente: pedido.cliente,
        Producto: item.producto,
        Área: item.tipo,
        Notas: pedido.notas || "",
        Hora: new Date().toLocaleString()
      }
    };

    console.log("Enviando a SeaTable:", rowData);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rowData)
    })
    .then(res => {
      console.log("Código de respuesta:", res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      console.log("Pedido enviado:", data);
      alert("Pedido enviado correctamente");
    })
    .catch(err => {
      console.error("Error al enviar:", err);
      alert("Error al enviar el pedido: " + err.message);
    });
  });
}
