const numberItems = document.querySelector('.number-item')
const footer = document.getElementById('footer')
const cerrarCartBtn = document.querySelector('.close-icon')
const navCartBtn = document.querySelector('.nav-cart')
const items = document.getElementById('items')
const itemList = document.querySelector('.item-list')
const templateFooter = document.getElementById('template-footer').content
const templateCard = document.getElementById('template-cards').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
const cards = document.getElementById('cards')
let carrito = {}

// ====================  COPYRIGHT  ====================
const copyright = document.querySelector('.copyright-text .copyright')

const year = new Date();
const actual = year.getFullYear();
console.log(actual)

copyright.textContent = actual

// ==================================  botones  ==================================================
cards.addEventListener('click', e =>{
    addCarrito(e)
})

cerrarCartBtn.addEventListener('click', ()=>{
    itemList.classList.toggle('spread')
})

navCartBtn.addEventListener('click', ()=>{
    itemList.classList.toggle('spread')
})
items.addEventListener('click', (e)=>{
    accionBtn(e)
})
// window.addEventListener('click', (e)=>{
//     if(itemList.classList.contains('spread') && e.target !== itemList && e.target !== cerrarCartBtn){
//         itemList.classList.toggle('spread')
//     }
// })
// ======================================  Fetch API  ============================================

document.addEventListener('DOMContentLoaded', ()=>{
    fetchAPI()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

const fetchAPI = async ()=>{
    const url = 'api.json'
    try {
        const resp = await fetch(url)
        const data = await resp.json()
        pintarCards(data)
        // console.log(data)
    } catch (error) {
        console.log(error)
    }
}
const pintarCards = (data)=>{
    data.forEach((producto)=>{
        // console.log(producto)
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('.btn-secondary').dataset.id = producto.id
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}
const addCarrito = e =>{
    // console.log(e.target)
    if(e.target.classList.contains('btn-secondary')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
const setCarrito = objeto =>{
    // console.log(objeto)
    const producto = {
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        id: objeto.querySelector('.btn-secondary').dataset.id,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    // console.log(carrito)
    pintarCarrito()
}
const pintarCarrito = ()=>{
    items.innerHTML = ''
    Object.values(carrito).forEach((producto) =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelectorAll('td')[2].textContent = producto.precio
        templateCarrito.querySelector('.inc').dataset.id = producto.id
        templateCarrito.querySelector('.dec').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    // console.log(carrito)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))

}

const pintarFooter = ()=>{
    footer.innerHTML = ''
    if(Object.keys(carrito) === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    } 
    
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad ,0)
    const nTotal = Object.values(carrito).reduce((acc, {precio, cantidad})=> acc + precio * cantidad, 0)
    // console.log(nTotal)
    // console.log(nCantidad)
    numberItems.textContent = nCantidad

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nTotal

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const vaciarCarritoBtn = document.getElementById('vaciar-carrito')
    vaciarCarritoBtn.addEventListener('click', ()=>{
        carrito = {}
        pintarCarrito()
    })
}
const accionBtn = (e)=>{
    // console.log(e.target)
    if(e.target.classList.contains('inc')){
        // console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...producto}

        pintarCarrito()
    }
    if(e.target.classList.contains('dec')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}