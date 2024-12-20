const { pool } = require('../config/db')
const format = require('pg-format')
const { HATEOAS } = require('../helpers/functions')

// Get para hacer el paginado
const GetAllJoyas = async (limit = 10, page = 1, order_by = "id_ASC") => {
    try {
        // Parsear el campo y la dirección del parámetro order_by
        const [campo, direccion] = order_by.split("_");
        // Validar el campo y la dirección
        const camposValidos = ["id", "nombre", "categoria", "metal", "precio"];
        const direccionesValidas = ["ASC", "DESC"];
        // Mensaje de validacion
        if (!camposValidos.includes(campo) || !direccionesValidas.includes(direccion)) {
            throw new Error("Parámetro order_by inválido. Usa el formato campo_DIRECCION (ej: id_ASC).");
        }

        //calculo para paginacion
        const offset = Math.abs(page - 1) * limit
        // Construir la consulta SQL con pg-format
        const SQLQuery = format(
            `SELECT id, nombre, categoria, metal, precio 
             FROM inventario 
             ORDER BY %I %s 
             LIMIT %s OFFSET %s`,
            campo,        // Campo para ordenar (como identificador)
            direccion,    // Dirección de orden (como cadena segura)
            limit,        // Límite
            offset        // Offset
        );

        // Obtener el total de joyas
        const { rowCount: totalCount} = await pool.query('SELECT * FROM inventario')
        const pages = Math.ceil(totalCount / limit)
        // Ejecutar la consulta principal
        const { rows, rowCount } = await pool.query(SQLQuery)
        // Retornar la estructura HATEOAS
        return HATEOAS({ totalCount, count: rowCount, pages, results: rows, page, limit})
    } catch (error) {
        throw error
    }
}


// Get para ir por id a cada Joya
const GetSingleJoyas = async (id) => {
    try {
        // Construir la consulta SQL con pg-format
        const SQLQuery = format(
            `SELECT * 
             FROM inventario 
             WHERE id = %s`,
            id       // id
        );
        // Ejecutar la consulta principal
        const { rows } = await pool.query(SQLQuery)
        // Retornar rows con la informacion de la joya
        return rows
    } catch (error) {
        throw error
    }
}


// Get para filtrado
const GetJoyasFiltro = async (precio_min = '', precio_max = '', categoria = '', metal = '') => {
    try {

        // Constante para traer los valores para el query y los values del filtro que se llama 'handleAddFilters'
        const { query, values } = handleAddFilters({precio_min, precio_max, categoria, metal})
        // Construir la consulta SQL con pg-format
        const SQLQuery = format(`
            SELECT * 
             FROM inventario 
             ${query ? `WHERE ${query}` : ''}`, // el valor de query se arma a traves del filtro con el .join
            ...values,     // values del filtro
        );
        // Ejecutar la consulta principal
        const { rows } = await pool.query(SQLQuery)
        // Retornar la estructura HATEOAS
        return rows
    } catch (error) {
        throw error
    }
}




//FUNCION PARA FILTRADO
const handleAddFilters = (filters) => {
    const querys = []
    const values = []

    Object.entries(filters).forEach((filter) => {
        // EXPLICACION OBJECT.ENTRIES
        //Toma un objeto "filters" y lo convierte en formato de arreglo
        // Viene asi EJ: [precio_min = '', precio_max = 2000, categoria = 'anillo', metal = '']
        // Proceso de object.entries:
        // [precio_min = ''], = const [precio_min = ''] = filter
        //    key       value
        //
        // [precio_max = 2000], 
        // [categoria = 'anillo'], 
        // [metal = ''] 
        const [key, value] = filter

        if (value) {
            switch (key) {
                case 'precio_max':
                    querys.push(`precio <= %s`)
                    values.push(value)
                    break;
                case 'precio_min':
                    querys.push(`precio >= %s`)
                    values.push(value)
                    break;
                case 'categoria':
                    querys.push(`categoria ILIKE '%s'`)
                    values.push(value)
                    break;
                case 'metal':
                    querys.push(`metal ILIKE '%s'`)
                    values.push(value)
                    break;
            
                default:
                    break;
            }
        }
    })

    return {
        query: querys.join(" AND "),
        values
    }
}



module.exports = {
    GetAllJoyas,
    GetSingleJoyas,
    GetJoyasFiltro
}