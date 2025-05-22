const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Validar Cedula Dominicana
function validarCedula(cedula) {
  // Eliminar guiones y espacios si los hay
  cedula = cedula.replace(/[-\s]/g, '');

  // Debe tener exactamente 11 dígitos
  if (!/^\d{11}$/.test(cedula)) return false;

  let suma = 0;
  for (let i = 0; i < 10; i++) {
    let digito = parseInt(cedula.charAt(i));
    let multiplicador = (i % 2 === 0) ? 1 : 2;
    let resultado = digito * multiplicador;

    if (resultado > 9) resultado -= 9; // Equivalente a sumar sus dígitos

    suma += resultado;
  }

  let digitoVerificador = (10 - (suma % 10)) % 10;

  return digitoVerificador === parseInt(cedula.charAt(10));
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
