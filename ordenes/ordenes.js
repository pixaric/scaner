const API_URL = "https://api.baserow.io/api/database/rows/table/654509/?user_field_names=true";
const API_TOKEN = "WqAoSylN4aSzpMwR4iQx4Bk0yw9bPOq5";

let pedidos = [];

// 🧠 Carga los pedidos desde Baserow
function cargarPedidos() {
  fetch(API_URL, {
    method: "GET",
    headers: {
      "Authorization": `Token ${API_TOKEN}`
    }
  })
  .then(res => res.json())
  .then(data => {
    pedidos = data.results.map(p => ({
      mesa: p.Mesa,
      producto: p.Producto,
      area: p.Área,
      notas: p.Notas,
      hora: p.Hora,
      listo: false // Estado local, no guardado en Baserow
    }));
    renderPedidos(document.getElementById("filtro").value);
  })
  .catch(err => {
    console.error("❌ Error al cargar pedidos:", err);
    alert("No se pudieron cargar los pedidos.");
  });
}

// 🧾 Renderiza la lista de pedidos con filtro
function renderPedidos(filtrado = "Todos") {
  const lista = document.getElementById("listaPedidos");
  lista.innerHTML = "";

  const pedidosFiltrados = pedidos
    .filter(p => filtrado === "Todos" || p.area === filtrado)
    .slice().reverse(); // Mostrar los más recientes arriba

  pedidosFiltrados.forEach((p, index) => {
    const li = document.createElement("li");
    if (p.listo) li.classList.add("listo");

    li.innerHTML = `
      <strong>${p.mesa}</strong> — ${p.producto} (${p.area})<br>
      <em>${p.notas || "Sin notas"}</em> — <span>${p.hora}</span>
      <label style="float:right">
        <input type="checkbox" onchange="marcarListo(${index})" ${p.listo ? "checked" : ""}>
        Listo
      </label>
    `;
    lista.appendChild(li);
  });
}

// 🎯 Filtro por área
function filtrarPedidos() {
  const filtro = document.getElementById("filtro").value;
  renderPedidos(filtro);
}

// ✅ Marca un pedido como listo y actualiza visualmente
function marcarListo(index) {
  const filtro = document.getElementById("filtro").value;
  const pedidosFiltrados = pedidos
    .filter(p => filtro === "Todos" || p.area === filtro)
    .slice().reverse();

  const pedidoOriginal = pedidos.find(p =>
    p.mesa === pedidosFiltrados[index].mesa &&
    p.producto === pedidosFiltrados[index].producto &&
    p.hora === pedidosFiltrados[index].hora
  );

  if (pedidoOriginal) {
    pedidoOriginal.listo = true;
    renderPedidos(filtro);
  }
}

// 🚀 Inicializa la carga
cargarPedidos();
