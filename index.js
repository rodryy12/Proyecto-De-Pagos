const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config(); // Asegúrate de que dotenv está cargado

const app = express();
const port = process.env.PORT || 3000;

// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Para servir archivos estáticos

// Configuración de PayPal
function configurePayPalEnvironment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID, // Client ID desde .env
    process.env.PAYPAL_SECRET_KEY // Secret Key desde .env
  );
}
const payPalClient = new paypal.core.PayPalHttpClient(configurePayPalEnvironment());

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

// Ruta para crear el pago con PayPal
app.post('/create-payment', async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: req.body.price, // Precio del producto
      },
      description: req.body.productName, // Nombre del producto
    }],
    application_context: {
      return_url: `${process.env.RENDER_URL}/success`, // URL de éxito desde .env
      cancel_url: `${process.env.RENDER_URL}/cancel`,   // URL de cancelación desde .env
    },
  });

  try {
    const order = await payPalClient.execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el pago');
  }
});

// Ruta para capturar el pago con PayPal
app.post('/capture-payment', async (req, res) => {
  const request = new paypal.orders.OrdersCaptureRequest(req.body.orderID);
  request.requestBody({});
  try {
    const capture = await payPalClient.execute(request);
    res.json(capture.result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al capturar el pago');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
