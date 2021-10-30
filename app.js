const express = require('express');
const favicon = require('serve-favicon');
const cors = require('cors');
const sequelize = require('./src/db/sequelize');


const app = express();
const port = process.env.PORT || 3000;

app
.use(favicon(__dirname + '/favicon.ico'))
.use(express.json())
.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }));

sequelize.initDb();

app.use((req, res, next) => {
    console.log('Time', Date.now());
    next();
})
app.use((err, req, res, next) => {
    console.error(err);
    res.send('Erreur');
})

app.get('/', (req, res) => {
    res.json('Hello, Heroku ! <img draggable="false" role="img" class="emoji" alt="👋" src="https://s.w.org/images/core/emoji/13.0.1/svg/1f44b.svg">')
})

require('./src/routes/findAllPokemons')(app);
require('./src/routes/findPokemonByPk')(app);
require('./src/routes/createPokemon')(app);
require('./src/routes/updatePokemon')(app);
require('./src/routes/deletePokemon')(app);
require('./src/routes/login')(app);

app.use(({res}) => {
    const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.';
    res.status(404).json({message});
});

app.listen(port, () => console.log(`Notre application Node est démarré sur : http://localhost:${port}`));