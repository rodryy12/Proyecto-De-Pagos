const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Para servir archivos estáticos

// Ruta básica para comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.render('index', { title: 'Página Principal' });
});

// Ruta para mostrar el formulario de registro
app.get('/register', (req, res) => {
  res.render('register'); // Renderiza la vista 'register.ejs'
});

// Ruta para manejar el envío del formulario de registro
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  // Aquí puedes agregar código para guardar el usuario en la base de datos
  console.log(`Nuevo usuario: ${username}, Email: ${email}`);
  res.redirect('/'); // Redirige a la página principal después del registro
});

// Ruta para mostrar el formulario de creación de producto
app.get('/create-product', (req, res) => {
  res.render('create-product'); // Renderiza la vista 'create-product.ejs'
});

// Ruta para manejar el envío del formulario de creación de producto
app.post('/create-product', (req, res) => {
  const { productName, price, redirectLink, description } = req.body;
  // Aquí puedes agregar código para guardar el producto en la base de datos
  console.log(`Nuevo producto: ${productName}, Precio: ${price}, Enlace: ${redirectLink || 'No proporcionado'}, Descripción: ${description || 'No proporcionada'}`);
  res.redirect('/'); // Redirige a la página principal después de crear el producto
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
const paypal = require('@paypal/checkout-server-sdk');

// Configuración de PayPal
function configurePayPalEnvironment() {
  return new paypal.core.SandboxEnvironment('AQAFDhvfrGl8TZW9xgi00BYsdoBS88HKGAuPC9pN6rHzhRgmrq7lO0_qYXLILmRWbmYjAt5MuWTUf0YZ', 'EJnT-4h8WkHTOxEBSMGVe3M8_JOxXHe3RjWRltNE8vuiz1iQn7LRff1cqf1D3yE6xeDwVhxqSQTaynQ-
');
}

const payPalClient = new paypal.core.PayPalHttpClient(configurePayPalEnvironment());
