const connection = require('../database/connection');

module.exports = { 
    async index(request, response) { //mostrar apenas 5 incidentes por página
        const { page = 1 } = request.query; //1 como default. parametro que vem após ?

        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5) //começa pulando 0, dps de 5 em 5
            .select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization; //autenticação, localização, idioma, o que caracteriza a conexão
        
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });
        //const id = result[0]; //equivalente a const [id], pq retorna um array, e já sei que só tem um valor.
        return response.json({ id });
    },
    
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;
        
        const incident = await connection('incidents').where('id', id).select('ong_id').first();

        if (incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.' }); //(http) não autorizado
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
};