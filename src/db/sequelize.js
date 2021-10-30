const { Sequelize, DataTypes } = require( "sequelize" );
const bcrypt = require('bcrypt');
const PokemonModel = require('../models/pokemon');
const UserModel = require('../models/user');
const pokemons = require('./mock-pokemon');

// const sequelize = new Sequelize('postgres://pokedex:pokedex@localhost:5432/pokedex');
let sequelize;
if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize('postgres://vyjyzjtekftezy:22d8a826b74aa68d6524ea8aeb2a1094f2923aaf2b6d80375adbcc0a82ac80f5@ec2-44-198-196-169.compute-1.amazonaws.com:5432/dct63iuojpfh9i?ssl=true');
} else {
    sequelize = new Sequelize('postgres://pokedex:pokedex@localhost:5432/pokedex');
}

const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

sequelize.authenticate()
    .then(_ => console.log('Connection has been established succesfully'))
    .catch(error => console.error('Unable to connect to the database:', error))


const initDb = () => {
    return sequelize.sync().then(_ => {
        pokemons.map(pokemon => {
        Pokemon.create({
            name: pokemon.name,
            hp: pokemon.hp,
            cp: pokemon.cp,
            picture: pokemon.picture,
            types: pokemon.types
        }).then(pokemon => console.log(pokemon.toJSON()))
        })
        bcrypt.hash('pikachu', 10)
        .then(hash =>User.create({ username: 'pikachu', password: hash}))
        .then(user => console.log(user.toJSON()))
        console.log('La base de donnée a bien été initialisée !')
    })
    }
    
module.exports = { 
initDb, Pokemon, User
}