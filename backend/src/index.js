const cors = require('cors');
const express = require('express'); //referenciar módulos
const routes = require('./routes'); //referenciar arquivos
const app = express();

app.use(cors());
app.use(express.json()); //dados enviados serão em json, e devem ser convertidos para objeto js
app.use(routes);

app.listen(3333);


/* Rotas | Recursos */

/* Métodos HTTP

- GET: buscar infos no back-end
- POST: criar info no back-end
- PUT: alterar info no back-end
- DELETE: deletar info no back-end

*/

/* Tipos de parâmetros:

- Query params: parâmetros nomeados enviados na rota após "?" (filtros, paginação)
- Route params: parâmetros utilizados p/ identificar recursos
- Request Body: corpo da requisição, utilizado para criar/alterar recursos

/* 
Driver: SELECT * FROM users
QUERY BUILDER: select().from().where() - mais flexível, independe do bd, posso usar código js (semelhante ao dal do web2py)
*/


