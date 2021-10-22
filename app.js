const express = require('express');
let pokemons = require('./mock-pokemon');
const { success, getUniqueId } = require('./helper');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const PokemonModel = require('./src/models/pokemon');
const { Sequelize, DataTypes } = require( 'sequelize' );

const app = express();
const port = 3000;

const sequelize = new Sequelize('postgres://pokedex:pokedex@localhost:5432/pokedex');
// const sequelize = new Sequelize(
//     'pokedex',
//     'pokedex',
//     'pokedex',
//     {
//         host: 'localhost',
//         dialect: 'postgres',
//         logging: false
//     }
// )
sequelize.authenticate()
    .then(_ => console.log('Connection has been established succesfully'))
    .catch(error => console.error('Unable to connect to the database:', error))

const Pokemon = PokemonModel(sequelize, DataTypes);

sequelize.sync({force: true})
    .then(_ => {
        console.log('La base de données "Pokedex" a bien été synchronisée.');
        pokemons.map(pokemon => {
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types.join()
            }).then(pokemon => console.log(pokemon.toJSON()))
        });
        // Pokemon.create({
        //     name: 'Bulbizarre',
        //     hp: 25,
        //     cp: 5,
        //     picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png',
        //     types: ["Plante", "Poison"].join()
        // }).then(bulbizarre => console.log(bulbizarre.toJSON()))
    })

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
});

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = { ...req.body, id:id};
    pokemons = pokemons.map( pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    });

    const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié.`;
    res.json(success(message, pokemonUpdated));
});

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id);
    pokemons = pokemons.filter(pokemon => pokemon.id !== id);
    const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé.`;
    res.json(success(message, pokemonDeleted));
});

app.listen(port, () => console.log(`Notre application Node est démarré sur : http://localhost:${port}`));