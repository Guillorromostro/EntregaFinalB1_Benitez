# Aplicación Servidor Express

Este proyecto es una aplicación de servidor Node.js y Express diseñada para gestionar productos y carritos de compras. Proporciona una API RESTful para manejar operaciones de productos y carritos.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Endpoints de la API](#endpoints-de-la-api)
  - [Productos](#productos)
  - [Carritos](#carritos)
- [Licencia](#licencia)

## Instalación

1. Clona el repositorio:
   ```
   git clone <url-del-repositorio>
   ```
2. Navega al directorio del proyecto:
   ```
   cd express-server-app
   ```
3. Instala las dependencias:
   ```
   npm install
   ```

## Uso

Para iniciar el servidor, ejecuta el siguiente comando:
```
npm start
```
El servidor escuchará en el puerto 8080.

## Endpoints de la API

### Productos

- **GET /**: Lista todos los productos.
- **GET /:pid**: Obtiene un producto por su ID.
- **POST /**: Agrega un nuevo producto.
- **PUT /:pid**: Actualiza un producto por su ID.
- **DELETE /:pid**: Elimina un producto por su ID.

### Carritos

- **POST /**: Crea un nuevo carrito.
- **GET /:cid**: Lista los productos en el carrito especificado.
- **POST /:cid/product/:pid**: Agrega un producto al carrito especificado.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.