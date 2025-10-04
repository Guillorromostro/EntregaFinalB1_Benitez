const socket = io();

const productList = document.getElementById('product-list');
const addForm = document.getElementById('add-product-form');

// Escuchar la lista de productos y renderizarla
socket.on('products', (products) => {
    productList.innerHTML = '';
    products.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.title} - $${p.price} (ID: ${p.id}) `;

        // Botón para eliminar producto
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = () => {
            socket.emit('deleteProduct', p.id);
        };

        li.appendChild(deleteBtn);
        productList.appendChild(li);
    });
});

// Manejar el envío del formulario para agregar producto
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(addForm));
    data.price = Number(data.price);
    data.stock = Number(data.stock);
    data.thumbnails = data.thumbnails ? data.thumbnails.split(',').map(s => s.trim()) : [];
    socket.emit('addProduct', data);
    addForm.reset();
});