const url = 'http://localhost:4000/api/articulos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'))
const formArticulo = document.querySelector('form')
const descripcion = document.getElementById('descripcion')
const precio = document.getElementById('precio')
const stock = document.getElementById('stock')
let opcion = ''

btnCrear.addEventListener('click', () => {
    descripcion.value = ''
    precio.value = ''
    stock.value = ''
    modalArticulo.show()
    opcion = 'crear'
})

const mostrar = (articulos) => {
    articulos.forEach(articulo => {
        resultados += '<tr><td>' + articulo.id + '</td><td>' + articulo.descripcion + '</td><td>' + articulo.precio + '</td><td>' + articulo.stock + '</td><td class="text-center"><button id="btnEditar"class="btn btn-primary" href="">Editar</button><button id="btnBorrar" class="btn btn-danger">Eliminar</button></td></tr>'
    })
    contenedor.innerHTML = resultados
}

fetch(url)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.error(error))


const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

on(document, 'click','#btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    console.log(id)
    alertify.confirm("Desea cancelar la acción Eliminar.",
        function() {
            fetch(url + id, {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(() => location.reload())
            
        },
        function() {
            alertify.error('Cancel');
        });
})

let idForm = ''
on(document, 'click','#btnEditar', (e) => {
    const fila = e.target.parentNode.parentNode
    //idForm = fila.children[0].innerHTML
    idForm = fila.firstElementChild.innerHTML
    const descripcionForm = fila.children[1].innerHTML
    const precioForm = fila.children[2].innerHTML
    const stockForm = fila.children[3].innerHTML
    console.log(idForm);
    descripcion.value = descripcionForm
    precio.value = precioForm
    stock.value = stockForm
    opcion = 'editar'
    modalArticulo.show()

})

formArticulo.addEventListener('submit', (e) => {
    e.preventDefault()
    if (opcion == 'crear') {
        fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    descripcion: descripcion.value,
                    precio: precio.value,
                    stock: stock.value
                })
            })
            .then(response => response.json())
            .then(dato => {
                const nuevoArticulo = []
                nuevoArticulo.push(dato)
                mostrar(nuevoArticulo)
            })
    }
    if (opcion == 'editar') {

        fetch(url + idForm, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    descripcion: descripcion.value,
                    precio: precio.value,
                    stock: stock.value
                })
            })

            .then(response => response.json())
            .then(response => location.reload())

    }
    modalArticulo.hide()
})


