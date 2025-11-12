const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRkYQSze9Nh_7NyZAkxHnYn1050vDHvsVcfsg4H_BP_USjtJHV7V7EKuxifFMmonE0adxmx3HIZaVz/pub?gid=0&single=true&output=csv";

async function obtenerDatos() {
    const res = await fetch(sheetUrl);
    const texto = await res.text();

    const filas = texto.trim().split("\n").map(f => f.split(","));
    const headers = filas.shift();
    const datos = filas.map(f => ({
        nombre: f[0],
        puntos: Number(f[1]),
        killsTotales: Number(f[2]),
        danoTotal: Number(f[3])
    }));

    datos.sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.killsTotales !== a.killsTotales) return b.killsTotales - a.killsTotales;
        return b.danoTotal - a.danoTotal;
    });

    renderTabla(datos);
}

function renderTabla(datos) {
    const tbody = document.querySelector("#ranking tbody");
    tbody.innerHTML = "";
    datos.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${d.nombre}</td>
      <td>${d.puntos}</td>
      <td>${d.killsTotales}</td>
      <td>${d.danoTotal}</td>
    `;
        tbody.appendChild(tr);
    });

    const ganador = document.getElementById("ganador");
    ganador.innerText = `🎖️ Ganador: ${datos[0].nombre}`;
}

obtenerDatos();
