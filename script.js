// 🔧 Referencias a elementos del DOM
const scanBtn = document.getElementById("scan-btn");
const readerDiv = document.getElementById("reader");
const resultP = document.getElementById("result");

let html5QrCode;       // Instancia del escáner QR
let pedidoGlobal;      // Pedido escaneado que se usará para enviar

// 📷 Escaneo de código QR al hacer clic en el botón
scanBtn.addEventListener("click", () => {
  readerDiv.classList.remove("hidden");
  scanBtn.disabled = true;

  html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" }, // Usa la cámara trasera
    { fps: 10, qrbox: 250 },       // Configuración del escáner
    (decodedText) => {
      resultP.innerText = `Código escaneado: ${decodedText}`;
      html5QrCode.stop();         // Detiene el escaneo
      readerDiv.classList.add("hidden");
      scanBtn.disabled = false;

      mostrarResumen(decodedText); // Muestra el resumen del pedido
    },
    (errorMessage) => {
      console.warn("Error de escaneo:", errorMessage);
    }
  );
});

// 📋 Muestra el resumen del pedido escaneado antes de enviarlo
function mostrarResumen(decodedText) {
  try {
    const pedido = JSON.parse(decodedText);
    pedidoGlobal = pedido;

    document.getElementById("resumenMesa").textContent = pedido.mesa || pedido.cliente || "Sin mesa";
    document.getElementById("resumenNotas").textContent = pedido.notas || "Sin notas";

    const lista = document.getElementById("resumenProductos");
    lista.innerHTML = "";
    pedido.pedido.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.producto} (${item.tipo})`;
      lista.appendChild(li);
    });

    document.getElementById("resumenPedido").style.display = "block";
  } catch (err) {
    alert("El código QR escaneado no contiene datos válidos.");
    console.error("Error al interpretar el QR:", err);
  }
}

// 📤 Envía el pedido escaneado a Baserow al confirmar
function confirmarEnvio() {
  const API_URL = "https://api.baserow.io/api/database/rows/table/654509/?user_field_names=true";
  const API_TOKEN = "WqAoSylN4aSzpMwR4iQx4Bk0yw9bPOq5";

  if (!pedidoGlobal || !pedidoGlobal.pedido) {
    alert("No hay pedido para enviar.");
    return;
  }

  pedidoGlobal.pedido.forEach(item => {
    const rowData = {
      Mesa: pedidoGlobal.mesa || pedidoGlobal.cliente || "Sin mesa",
      Producto: item.producto,
      Área: item.tipo,
      Notas: pedidoGlobal.notas || "",
      Hora: new Date().toLocaleString()
    };

    console.log("Enviando a Baserow:", rowData);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rowData)
    })
    .then(res => res.json())
    .then(data => console.log("✅ Pedido enviado:", data))
    .catch(err => console.error("❌ Error al enviar:", err));
  });

  alert("Pedido enviado correctamente");
  document.getElementById("resumenPedido").style.display = "none";
}

// ➕ Agrega un nuevo producto al formulario de generación de QR
function agregarProducto() {
  const div = document.createElement("div");
  div.className = "producto";
  div.innerHTML = `
    <input type="text" class="nombre" placeholder="Producto">
    <select class="area">
      <option value="Barra">Barra</option>
      <option value="Cocina 1">Cocina 1</option>
      <option value="Cocina 2">Cocina 2</option>
    </select>
  `;
  document.getElementById("productos").appendChild(div);
}

// 🧾 Genera un código QR con los datos del formulario
function generarQR() {
  const cliente = document.getElementById("mesa").value;
  const notas = document.getElementById("notas").value;
  const productos = [];

  document.querySelectorAll(".producto").forEach(p => {
    const nombre = p.querySelector(".nombre").value;
    const area = p.querySelector(".area").value;
    if (nombre) {
      productos.push({ producto: nombre, tipo: area });
    }
  });

  const pedido = {
    cliente,
    pedido: productos,
    notas
  };

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: JSON.stringify(pedido),
    width: 250,
    height: 250
  });
}
