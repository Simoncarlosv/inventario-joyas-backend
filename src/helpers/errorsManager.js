module.exports = {
    SERVER_ERROR: {
        id: 'serverError',
        message: "Error interno en el servidor",
        description: "Ocurrió un error en el servidor, intenta de nuevo más tarde",
        code: 500
    },
    NOT_FOUND: {
        id: 'notFound',
        message: "Registro no encontrado",
        description: "El registro buscado no existe en la base de datos",
        code: 404
    },
    BAD_REQUEST: {
        id: 'badRequest',
        message: "Solicitud incorrecta",
        description: "Faltan campos o ingresaste campos erróneos",
        code: 400
    }
}