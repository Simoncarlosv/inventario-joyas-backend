const { GetAllJoyas,
        GetSingleJoyas,
        GetJoyasFiltro
 } = require('../models/Joyas')

const GetAllJoyasController = async (req, res, next)=> {
    try {
        const { limit, page, order_by } = req.query

        const response = await GetAllJoyas( limit, page, order_by )

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}


const GetSingleJoyasController = async (req, res, next)=> {
    try {
        const { id } = req.params

        const response = await GetSingleJoyas( id )

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

const GetJoyasFiltroController = async (req, res, next)=> {
    try {
        const { precio_min, precio_max, categoria, metal, page, limit } = req.query

        const response = await GetJoyasFiltro( precio_min, precio_max, categoria, metal, page, limit )

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}


module.exports = {
    GetAllJoyasController,
    GetSingleJoyasController,
    GetJoyasFiltroController
}