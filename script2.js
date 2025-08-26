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
