const formulario = document.getElementById("form-tarea");
const entrada = document.getElementById("nueva-tarea");
const lista = document.getElementById("lista-tareas");
const mensajeVacio = document.getElementById("mensaje-vacio");

const totalTareas = document.getElementById("total-tareas");
const pendientes = document.getElementById("pendientes");
const completadas = document.getElementById("completadas");
const botonesFiltro = document.querySelectorAll(".filtro");

const API_URL = "/api/tareas";

let tareas = [];
let filtroActual = "todas";

async function cargarTareas() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al consultar las tareas");
        }

        tareas = await respuesta.json();
        mostrarTareas();
    } catch (error) {
        console.error(error);
        mensajeVacio.textContent = "No se pudieron cargar las tareas.";
        mensajeVacio.style.display = "block";
    }
}

function actualizarEstadisticas() {
    totalTareas.textContent = tareas.length;

    pendientes.textContent = tareas.filter(
        tarea => !tarea.completada
    ).length;

    completadas.textContent = tareas.filter(
        tarea => Boolean(tarea.completada)
    ).length;
}

function mostrarTareas() {
    lista.innerHTML = "";

    const filtradas = tareas.filter(tarea => {
        if (filtroActual === "pendientes") {
            return !tarea.completada;
        }

        if (filtroActual === "completadas") {
            return Boolean(tarea.completada);
        }

        return true;
    });

    mensajeVacio.textContent = "Todavía no hay tareas para mostrar.";
    mensajeVacio.style.display =
        filtradas.length === 0 ? "block" : "none";

    filtradas.forEach(tarea => {
        const elemento = document.createElement("li");
        elemento.className = "tarea";

        if (tarea.completada) {
            elemento.classList.add("completada");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = Boolean(tarea.completada);
        checkbox.setAttribute(
            "aria-label",
            "Marcar tarea como completada"
        );

        checkbox.addEventListener("change", async () => {
            checkbox.disabled = true;

            try {
                const respuesta = await fetch(
                    `${API_URL}/${tarea.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            completada: checkbox.checked
                        })
                    }
                );

                if (!respuesta.ok) {
                    throw new Error("Error al actualizar la tarea");
                }

                await cargarTareas();
            } catch (error) {
                console.error(error);
                checkbox.checked = !checkbox.checked;
                checkbox.disabled = false;
                alert("No se pudo actualizar la tarea.");
            }
        });

        const texto = document.createElement("span");
        texto.className = "texto-tarea";
        texto.textContent = tarea.descripcion;

        const eliminar = document.createElement("button");
        eliminar.className = "eliminar";
        eliminar.textContent = "Eliminar";

        eliminar.addEventListener("click", async () => {
            eliminar.disabled = true;

            try {
                const respuesta = await fetch(
                    `${API_URL}/${tarea.id}`,
                    { method: "DELETE" }
                );

                if (!respuesta.ok) {
                    throw new Error("Error al eliminar la tarea");
                }

                await cargarTareas();
            } catch (error) {
                console.error(error);
                eliminar.disabled = false;
                alert("No se pudo eliminar la tarea.");
            }
        });

        elemento.append(checkbox, texto, eliminar);
        lista.appendChild(elemento);
    });

    actualizarEstadisticas();
}

formulario.addEventListener("submit", async evento => {
    evento.preventDefault();

    const descripcion = entrada.value.trim();

    if (!descripcion || descripcion.length > 100) {
        alert("La tarea debe contener entre 1 y 100 caracteres.");
        return;
    }

    const botonAgregar = formulario.querySelector(
        'button[type="submit"]'
    );

    if (botonAgregar) botonAgregar.disabled = true;

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ descripcion })
        });

        if (!respuesta.ok) {
            throw new Error("Error al registrar la tarea");
        }

        formulario.reset();
        await cargarTareas();
        entrada.focus();
    } catch (error) {
        console.error(error);
        alert("No se pudo guardar la tarea en MySQL.");
    } finally {
        if (botonAgregar) botonAgregar.disabled = false;
    }
});

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        filtroActual = boton.dataset.filtro;

        botonesFiltro.forEach(b => {
            b.classList.remove("activo");
        });

        boton.classList.add("activo");
        mostrarTareas();
    });
});

cargarTareas();
