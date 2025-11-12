const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRkYQSze9Nh_7NyZAkxHnYn1050vDHvsVcfsg4H_BP_USjtJHV7V7EKuxifFMmonE0adxmx3HIZaVz/pub?gid=0&single=true&output=csv";


async function obtenerDatos() {
    try {
        const res = await fetch(sheetUrl);
        const texto = await res.text();

        const filas = texto.trim().split("\n").map(f => f.split(","));
        filas.shift();

        const datos = filas.map(f => ({
            nombre: f[0],
            puntos: Number(f[1]),
            partidasJugadas: Number(f[2]),
            partidasGanadas: Number(f[3]),
            killsTotales: Number(f[4]),
            pentakills: Number(f[5]),
            danoTotal: Number(f[6])
        }));

        datos.sort((a, b) =>
            b.puntos - a.puntos ||
            b.killsTotales - a.killsTotales ||
            b.danoTotal - a.danoTotal
        );

        renderTabla(datos);
        mostrarGanadorSiCorresponde(datos);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        document.querySelector("#ranking tbody").innerHTML =
            "<tr><td colspan='8'>⚠️ Error al cargar datos</td></tr>";
    }
}

function renderTabla(datos) {
    const tbody = document.querySelector("#ranking tbody");
    tbody.innerHTML = "";

    datos.forEach((d, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${index + 1}°</td>
      <td>${d.nombre}</td>
      <td>${d.puntos}</td>
      <td>${d.partidasJugadas}</td>
      <td>${d.partidasGanadas}</td>
      <td>${d.killsTotales}</td>
      <td>${d.pentakills}</td>
      <td>${d.danoTotal}</td>
    `;
        tbody.appendChild(tr);
    });
}

function mostrarGanadorSiCorresponde(datos) {
    const ganadorDiv = document.getElementById("ganador");
    const todosJugaronTres = datos.every(j => j.partidasJugadas === 3);

    if (todosJugaronTres) {
        const ganador = datos[0].nombre;
        ganadorDiv.innerHTML = `
      <div class="ganador-final">
        <img src="/victory.jpeg" alt="Ganador" class="img-ganador">
        <span>${ganador}</span>
       <p>¡Campeón Torneo ARAM – ¿Quién mata más?</p>
      </div>
    `;
    } else {
        ganadorDiv.innerHTML = "";
    }
}

obtenerDatos();
