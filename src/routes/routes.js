const { Router } = require('express')
const { GetAllJoyasController,
    GetSingleJoyasController,
    GetJoyasFiltroController
} = require('../controllers/joyas.controller')

const router = Router()

router.get('/joyas', GetAllJoyasController)// para HATEOS
router.get('/joyas/:id', GetSingleJoyasController)// para UNA JOYA por ID
router.get('/joyas/filtered',  GetJoyasFiltroController)

module.exports = router