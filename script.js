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
  const pedido = JSON.parse(decodedText);
  const API_URL = "https://cloud.seatable.io/dtable-server/api/v1/rows/";
  const API_TOKEN = "14d285b809b23a9e775a346bb2c138186ca0f4";
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
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta de SeaTable:", data);
      alert("Pedido enviado correctamente");
    })
    .catch(err => {
      console.error("Error al enviar:", err);
      alert("Error al enviar el pedido");
    });
  });
}
