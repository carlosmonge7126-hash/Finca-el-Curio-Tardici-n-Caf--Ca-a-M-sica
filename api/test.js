// api/test.js
module.exports = function(req, res) {
  res.status(200).json({ 
    mensaje: "✅ API funcionando correctamente",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    carpeta: "api existe y funciona"
  });
};
/---"Actualizo test.js para diagnóstico"---/
