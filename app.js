const express = require('express');
let pokemons = require('./mock-pokemon');
const { success, getUniqueId } = require('./helper');
const morgan = require('morgan');
const favicon = require('serve-favicon');

const app = express();
const port = 3000;

app.use(express.json());
app
.use(favicon(__dirname + '/favicon.ico'))
.use(morgan('dev'));

app.use((req, res, next) => {
    console.log('Time', Date.now());
    next();
})
app.use((err, req, res, next) => {
    console.error(err);
    res.send('Erreur');
})

app.get('/', (req, res) => {
    
    res.send('Hello, Express !')
});

app.get('/api/pokemons', (req, res) => {
    
    const message = "La liste des pokémons a bien été récupéré";
    res.json(success(message, pokemons));
})

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find( pokemon => pokemon.id === id);
    const message = 'Un pokémon a bien été trouvé.';
    res.json(success(message, pokemon));
});

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons);
    const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}};
    pokemons.push(pokemonCreated);
    const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`;
    res.json(success(message, pokemonCreated));
})



app.listen(port, () => console.log(`Notre application Node est démarré sur : http://localhost:${port}`));