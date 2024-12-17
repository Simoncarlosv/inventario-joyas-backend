const fs = require('fs');
const path = require('path');

// Middleware para registrar actividad en las rutas
const loggerMiddleware = (req, res, next) => {
    const logMessage = `
    ${new Date().toISOString()} - 
    Ruta: ${req.method} ${req.originalUrl} - 
    IP: ${req.ip}\n`;
    
    // Mostrar el registro en la consola
    console.log(logMessage);

    // Guardar el registro en un archivo
    const logFilePath = path.join(__dirname, 'logs.txt');
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de logs:', err);
        }
    });

    // Pasar al siguiente middleware o controlador
    next();
};

module.exports = {
    loggerMiddleware
};