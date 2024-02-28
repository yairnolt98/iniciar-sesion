const formulario = document.querySelector("#formulario");
const tareas = document.querySelector("#tareas");
const total = document.querySelector("#total");
const completadas = document.querySelector("#completadas");
let task = [];

function guardarTotalTareas() {
    let totalTareas = task.length;
    localStorage.setItem("totalTareas", totalTareas);
}

function validarFormulario(e) {
    e.preventDefault();
    const tarea = document.querySelector("#tarea").value;
    if (tarea.trim().length === 0) {
        console.log('vacio');
        return
    }

    const objTarea = { id: Date.now(), tarea: tarea, estado: false };
    task = [...task, objTarea];
    formulario.reset();

    agregarHTML();

    guardarTotalTareas();
}

function agregarHTML() {
    while (tareas.firstChild) {
        tareas.removeChild(tareas.firstChild)
    }

    if (task.length > 0) {
        task.forEach(item => {
            const elemento = document.createElement('div');
            elemento.classList.add('item-tarea');
            elemento.innerHTML = `
                <p>${item.estado ? (
                    `<span class='completa'>${item.tarea}</span>`
                ) : (
                    `<span>${item.tarea}</span>`
                )}</p>
                <div class="botones">
                    <button class="eliminar" data-id="${item.id}">x</button>
                    <button class="completada" data-id="${item.id}">✓</button>
                </div>
            `
            tareas.appendChild(elemento)
        });

    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "No hay tareas asignadas"
        tareas.appendChild(mensaje)
    }

    let totalTareas = task.length;
    let tareasCompletas = task.filter(item => item.estado === true).length;

    total.textContent = `Total tareas: ${totalTareas}`;
    completadas.textContent = `Completadas: ${tareasCompletas}`;

    localStorage.setItem("tareas", JSON.stringify(task))

}

function eliminarTarea(e) {
    if (e.target.classList.contains("eliminar")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.filter((item) => item.id !== tareaID);
        task = nuevasTareas;
        agregarHTML();
    }
}


function completarTarea(e) {
    if (e.target.classList.contains("completada")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.map(item => {
            if (item.id === tareaID) {
                item.estado = !item.estado;
                return item;
            } else {
                return item
            }
        })
        task = nuevasTareas;
        agregarHTML();
    }
}


(() => {
    formulario.addEventListener('submit', validarFormulario);
    tareas.addEventListener("click", eliminarTarea);
    tareas.addEventListener("click", completarTarea);
    document.addEventListener("DOMContentLoaded", () => {
        let datosLS = JSON.parse(localStorage.getItem("tareas")) || [];
        task = datosLS;
        agregarHTML();
    })
})()