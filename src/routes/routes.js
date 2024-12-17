const { Router } = require('express')
const { GetAllJoyasController,
    GetSingleJoyasController,
    GetJoyasFiltroController
} = require('../controllers/joyas.controller')

const router = Router()

//Rutas
router.get('/joyas/filtered',  GetJoyasFiltroController) // Ruta de FILTRO
// EXPLICACION DE POR QUE FILTRO VA DE LOS PRIMEROS
// Cuando se coloca la ruta del filtro al final o después de las rutas con :ID
// La aplicacion se confunde y toma como ID la segunda parte de la ruta
// es decir, /filtered, entonces arroja un error al hacer una consulta
// donde el error menciona que no se encuentra la columna "filtered"
router.get('/joyas', GetAllJoyasController)// para HATEOS
router.get('/joyas/:id', GetSingleJoyasController)// para UNA JOYA por ID

module.exports = router