function borrarTodaLaBD() {
  if (!confirm("⚠️ ¿Estás seguro de que quieres borrar todos los pedidos? Esta acción no se puede deshacer.")) {
    return;
  }

  const API_URL = "https://api.baserow.io/api/database/rows/table/654509/?user_field_names=true";
  const API_TOKEN = "WqAoSylN4aSzpMwR4iQx4Bk0yw9bPOq5";

  // Paso 1: obtener todos los registros
  fetch(API_URL, {
    method: "GET",
    headers: {
      "Authorization": `Token ${API_TOKEN}`
    }
  })
  .then(res => res.json())
  .then(data => {
    const registros = data.results;
    if (registros.length === 0) {
      alert("La base de datos ya está vacía.");
      return;
    }

    // Paso 2: borrar cada registro por su ID
    registros.forEach(registro => {
      fetch(`https://api.baserow.io/api/database/rows/table/654509/${registro.id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Token ${API_TOKEN}`
        }
      })
      .then(() => {
        console.log(`🗑️ Registro ${registro.id} borrado`);
      })
      .catch(err => {
        console.error(`❌ Error al borrar el registro ${registro.id}:`, err);
      });
    });

    alert("Todos los pedidos han sido borrados.");
    pedidos = [];
    renderPedidos();
  })
  .catch(err => {
    console.error("❌ Error al obtener registros:", err);
    alert("No se pudo acceder a la base de datos.");
  });
}
