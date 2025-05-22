const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Validar cédula dominicana
function validarCedula(cedula) {
  if (!/^\d{11}$/.test(cedula)) return false;

  const multiplicadores = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 10; i++) {
    let producto = cedula[i] * multiplicadores[i];
    if (producto >= 10) producto = Math.floor(producto / 10) + (producto % 10);
    suma += producto;
  }

  const verificador = (10 - (suma % 10)) % 10;

  return verificador === parseInt(cedula[10]);
}

// Endpoint API
app.post('/api/validar', (req, res) => {
  const { cedula } = req.body;

  if (!cedula) {
    return res.status(400).json({ valido: false, mensaje: 'Debe enviar una cédula.' });
  }

  const esValida = validarCedula(cedula);
  res.json({
    cedula,
    valido: esValida,
    mensaje: esValida ? 'Cédula válida.' : 'Cédula inválida.'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
