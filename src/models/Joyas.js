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
const GetJoyasFiltro = async (precio_min = '', precio_max = '', categoria = '', metal = '', page = 1, limit = 4) => {
    try {

        // Constante para traer los valores para el query y los values del filtro que se llama 'handleAddFilters'
        const { query, values } = handleAddFilters({precio_min, precio_max, categoria, metal})
        //calculo para paginacion
        const offset = Math.abs(page - 1) * limit
        // Construir la consulta SQL con pg-format
        const SQLQuery = format(`
            SELECT * 
             FROM inventario 
             WHERE ${query}
             LIMIT %s
             OFFSET %s`, // el valor de query se arma a traves del filtro con el .join
            ...values,
            limit,
            offset     // values del filtro
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




//FUNCION PARA FILTRADO
const handleAddFilters = (filters) => {
    const querys = []
    const values = []

    Object.entries(filters).forEach((filter) => {
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



// let filtros = []
//         const values = []

//         const agregarFiltro = (campo, comparador, valor) => {
//             values.push(valor)
//             const { length } = filtros
//             filtros.push(`${campo} ${comparador} $${length + 1}`)
//         }

//         if (precio_max) agregarFiltro('precio', '<=', precio_max)
//         if (precio_min) agregarFiltro('precio', '>=', precio_min)
//         if (categoria) agregarFiltro('categoria', '=', 'categoria')
//         if (metal) agregarFiltro('metal', '=', 'metal')

//         let consulta = "SELECT * FROM inventario"

//         if (filtros.length > 0) {
//             filtros = filtros.join(" AND ")
//             consulta += ` WHERE ${filtros}`
//         }

//         const { rows: inventario } = await pool.query(consulta, values)
//         return inventario



module.exports = {
    GetAllJoyas,
    GetSingleJoyas,
    GetJoyasFiltro
}