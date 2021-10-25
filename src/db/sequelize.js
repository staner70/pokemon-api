const { Sequelize, DataTypes } = require( "sequelize" );
const PokemonModel = require('../models/pokemon');
const pokemons = require('./mock-pokemon');

const sequelize = new Sequelize('postgres://pokedex:pokedex@localhost:5432/pokedex');

const Pokemon = PokemonModel(sequelize, DataTypes);

sequelize.authenticate()
    .then(_ => console.log('Connection has been established succesfully'))
    .catch(error => console.error('Unable to connect to the database:', error))


const initDb = () => {
    return sequelize.sync({force: true}).then(_ => {
        pokemons.map(pokemon => {
        Pokemon.create({
            name: pokemon.name,
            hp: pokemon.hp,
            cp: pokemon.cp,
            picture: pokemon.picture,
            types: pokemon.types
        }).then(pokemon => console.log(pokemon.toJSON()))
        })
        console.log('La base de donnée a bien été initialisée !')
    })
    }
    
module.exports = { 
initDb, Pokemon
}