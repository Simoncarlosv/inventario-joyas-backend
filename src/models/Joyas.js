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
             ORDER BY %s %s 
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
        const { query, values } = handleAddFilters({ precio_min, precio_max, categoria, metal });
        const offset = Math.abs(page - 1) * limit;

        // Construir la consulta SQL de forma segura
        const SQLQuery = `
            SELECT * 
            FROM inventario
            ${query ? `WHERE ${query}` : ''}
            LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        
        // Agregar `limit` y `offset` al array de valores
        const finalValues = [...values, limit, offset];

        // Ejecutar la consulta
        const { rows, rowCount } = await pool.query(SQLQuery, finalValues);

        // Obtener el total de joyas para el cálculo de páginas
        const { rowCount: totalCount } = await pool.query('SELECT * FROM inventario');
        const pages = Math.ceil(totalCount / limit);

        // Retornar la estructura HATEOAS
        return HATEOAS({ totalCount, count: rowCount, pages, results: rows, page, limit });
    } catch (error) {
        throw error;
    }
};



//FUNCION PARA FILTRADO
const handleAddFilters = (filters) => {
    const querys = [];
    const values = [];

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            switch (key) {
                case 'precio_max':
                    querys.push(`precio <= $${values.length + 1}`);
                    values.push(value);
                    break;
                case 'precio_min':
                    querys.push(`precio >= $${values.length + 1}`);
                    values.push(value);
                    break;
                case 'categoria':
                    querys.push(`categoria ILIKE $${values.length + 1}`);
                    values.push(`%${value}%`);
                    break;
                case 'metal':
                    querys.push(`metal ILIKE $${values.length + 1}`);
                    values.push(`%${value}%`);
                    break;
            }
        }
    });

    return {
        query: querys.join(' AND '),
        values,
    };
};



module.exports = {
    GetAllJoyas,
    GetSingleJoyas,
    GetJoyasFiltro
}