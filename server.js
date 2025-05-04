const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'deportes' 
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM usuarios1';
  connection.query(sql, (err, resultados) => {
    if (err) throw err;
    res.render('index', { datos: resultados });
  });
});

app.post('/guardar', (req, res) => {
  const datos = req.body;
  const sql = `
    INSERT INTO usuarios1 
    (nombre, apellidoPaterno, apellidoMaterno, fechaDeNacimiento, problemasDeSalud, domicilio, numeroCelular, email, sexo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const valores = [
    datos.nombre,
    datos.apellidoPaterno,
    datos.apellidoMaterno,
    datos.fechaDeNacimiento,
    datos.problemasDeSalud,
    datos.domicilio,
    datos.numeroCelular,
    datos.email,
    datos.sexo
  ];
  connection.query(sql, valores, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});
//consultar
app.get('/usuario/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM usuarios1 WHERE idusuario = ?';

  connection.query(sql, [id], (err, resultados) => {
    if (err) throw err;

    if (resultados.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.render('detalle', { usuario: resultados[0] });
  });
});
//actualizar
app.get('/editar/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM usuarios1 WHERE idusuario = ?';

  connection.query(sql, [id], (err, resultados) => {
    if (err) throw err;

    if (resultados.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.render('editar', { usuario: resultados[0] });
  });
});

// Guardar cambios del usuario editado
app.post('/actualizar/:id', (req, res) => {
  const id = req.params.id;
  const datos = req.body;

  const sql = `
    UPDATE usuarios1 SET 
      nombre = ?, 
      apellidoPaterno = ?, 
      apellidoMaterno = ?, 
      fechaDeNacimiento = ?, 
      problemasDeSalud = ?, 
      domicilio = ?, 
      numeroCelular = ?, 
      email = ?, 
      sexo = ?
    WHERE idusuario = ?
  `;

  const valores = [
    datos.nombre,
    datos.apellidoPaterno,
    datos.apellidoMaterno,
    datos.fechaDeNacimiento,
    datos.problemasDeSalud,
    datos.domicilio,
    datos.numeroCelular,
    datos.email,
    datos.sexo,
    id
  ];

  connection.query(sql, valores, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Eliminar usuario
app.get('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM usuarios1 WHERE idusuario = ?';

  connection.query(sql, [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.listen(4000, () => {
  console.log('Servidor iniciado en http://localhost:4000');
});