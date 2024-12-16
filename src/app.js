const express = require('express')
const morgan = require('morgan')
const routes = require('./routes/routes')
const { errorMiddleware } = require('./middlewares/errorMiddlewares')


const app = express()

//Utilizar Middlewares
app.use(morgan('dev'))

//Utilizar Routes
app.use('/', routes)

// Utlizamos nuestro middleware de manejador de errores, y debe ir AQUI al final, por el parámetro "next", que va pasando el proceso por los otros pasos para ir detectando los errores.
app.use(errorMiddleware)

module.exports = app