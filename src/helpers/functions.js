const HATEOAS = ({totalCount, count, pages, results, page, limit}) => {
    return {
        totalCount,
        count,
        pages,
        results: results.map((row) => ({
            id: row.id, 
            nombre: row.nombre, 
            categoria: row.categoria, 
            metal: row.metal,
            precio: row.precio,
            url: `/joyas/${row.id}`,
        })),
        next: page < pages ? `/joyas?limit=${limit}&page=${Number(page) + 1}` : null,
        prev: page > 1 ? `/joyas?limit=${limit}&page=${Number(page) - 1}` : null
    }

}

module.exports = {
    HATEOAS
}