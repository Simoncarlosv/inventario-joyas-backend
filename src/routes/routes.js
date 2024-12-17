const { Router } = require('express')
const { GetAllJoyasController,
    GetSingleJoyasController,
    GetJoyasFiltroController
} = require('../controllers/joyas.controller')

const router = Router()

router.get('/joyas/filtered',  GetJoyasFiltroController)
router.get('/joyas', GetAllJoyasController)// para HATEOS
router.get('/joyas/:id', GetSingleJoyasController)// para UNA JOYA por ID

module.exports = router