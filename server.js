const express = required('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app= express();
app.use(bodyParser.urlencoded({ extended:false}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'familia'
});
db.connect(err =>{
    if(err) throw err;
    console.log('Conectado a mysql');
});
app.get('/', (req, res)=>{
    db.query('SELECT * FROM datos_familiares', (err,results)=>{
        if (err) throw err;
        res.render('index', {datos: results});
    });
});
app.post('/add', (req,res)=>{
    const { ganancias, gastos, miembros } = req.body;
    db.query(
        'INSERT INTO datos_familiares (ganancias, gastos, miembros_trabajando) VALUES(?,?,?)',
        [ganancias, gastos, miembros],
        err=>{
            if (err) throw err;
            res.redirect('/');
        }
    );
});
app.post('/update/:id', (req, res)=>{
    const { ganancias, gastos, miembros} =req.body;
    db.query(
        'UPDATE datos_familiares SET ganancias =?, gastos = ?, miembros_trabajando = ? WHERE id = ?',
        [ganancias, gastos, miembros, req.params.id],
        err =>{
            if(err) throw err;
            res.redirect('/');
        }
    );
});
app.post('delete/:id', (req,res)=>{
    db.query('DELETE FROM datos_familiares WHERE id = ?', [req.params.id], err =>{
        if (err) throw err;
        res.redirect('/');
    });
});
app.listen(8000, ()=>{
    console.log('Servidor en http://localhost:8000');
});