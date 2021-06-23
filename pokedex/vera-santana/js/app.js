let pokemonList = [];
let pokemonTypes = []

// Método assíncrono para obter tipos via api. Utilize o sufixo Async no fim do nome do método é um bom padrão
async function fetchTypesAsync() {
    // #region Utilizando await

    /* 
        Cada linha é aguarda pela resposta da requisição que é feita nela. Menos código, mais legível.
        Linha 14: Aguarda resposta do servidor
        Linha 15: Aguarda conversão da resposta do servidor (Os dados mesmo)
    */

    const response = await fetch("https://pokeapi.co/api/v2/type")
    const data = await response.json()

    pokemonTypes = data.results.map(function (type) {
        return type.name
    });

    // #endregion

    // #region Utilizando then
    /*        
        Código onde cada then depende diretamente do outro. Mais código, menos legível.
        Em sala fizemos assim, com a diferença que aqui estamos adicionando os dados obtidos numa váriavel
        Linha 33: Aguarda resposta do servidor e inicia a conversão em json
        Linha 34: Aguarda dados já convertidos
        Linha 39: Mostra algum erro
    */

    // pokemonTypes = await fetch("https://pokeapi.co/api/v2/type")
    //     .then((response) => response.json())
    //     .then(data => {
    //         return data.results.map(function (type) {
    //             return type.name
    //         });
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });

    // #endregion
}

async function fetchPokemonsAsync() {
    // https://borgesdn.github.io/pokedex-source/pokedex.json
    try {
        const response = await fetch('https://borgesdn.github.io/pokedex-source/pokedex.json');
        const pokemons = await response.json();
        pokemonList = pokemons;
    } catch (error) {
        console.error(error);
    }
}

async function getPokemonAsync(id) {
    // https://pokeapi.co/api/v2/pokemon/{id}
    let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((resposta) => resposta.json())
        .catch((error) => {
            console.log(error);
            alert("Erro ao buscar pokemon")
        })
    return pokemon
}

function filterPokemon(name, type) {
    const filteredList = pokemonList.filter((pokemon) => {
        const searchName = new RegExp(name, "i");
        const checkName = searchName.test(pokemon.name);
        const checkType = type.length == 0 ? true : pokemon.type.includes(type);
        return checkName && checkType;
    });
    return filteredList;
}



function sortPokemon(filteredList, sortExpression) {
    let listaOrdenada = [];

    switch (sortExpression) {
        case 'ID (desc)':
            listaOrdenada = filteredList.sort(function (pokemonA, pokemonB) {
                return pokemonA.id - pokemonB.id;
            });
            listaOrdenada.reverse();
            break;
        case 'A-Z':
            listaOrdenada = filteredList.sort((pokemonA, pokemonB) => {
                if (pokemonA.name > pokemonB.name) {
                    return 1;
                }
                if (pokemonA.name < pokemonB.name) {
                    return -1;
                }
                return 0;
            })
            break;
        case 'Z-A':
            listaOrdenada = filteredList.sort((pokemonA, pokemonB) => {
                if (pokemonA.name > pokemonB.name) {
                    return -1;
                }
                if (pokemonA.name < pokemonB.name) {
                    return 1;
                }
                return 0;
            })
            break;
        default:
            listaOrdenada = filteredList.sort((pokemonA, pokemonB) => {
                return pokemonA.id - pokemonB.id;
            });
            break;

    }

    return listaOrdenada;
}

function getPokemon(id) {
    const pokemon = pokemonList.find(pokemon => pokemon.id == id);
    return pokemon;
}

function deletePokemon(id) {
    pokemonList = pokemonList.filter(pokemon => pokemon.id != id);
    alert("Pokemon removido com sucesso!");
}

function editPokemon(id, name, hp, attack, defense, speed, specialAttack, specialDefense, types) {
    let pokemon = getPokemon(id);
    let listaType = types.split(';');
    let indice = listaType.indexOf("");
    listaType.splice(indice, 1);

    pokemon.name = name;
    pokemon.stats.hp = hp;
    pokemon.stats.attack = attack;
    pokemon.stats.defense = defense;
    pokemon.stats.speed = speed;
    pokemon['stats']['sp-atk'] = specialAttack;
    pokemon['stats']['sp-def'] = specialDefense;
    pokemon.type = listaType;

    alert("Pokemon editado com sucesso!");
}

function addPokemon(name, hp, attack, defense, speed, specialAttack, specialDefense, types) {
    let max;
    for (let i = 0; i < pokemonList.length; i++) {
        let a, b;

        a = pokemonList[i];
        b = pokemonList[i + 1];

        if (!b) {
            b = 0;
        }

        if (a.id > b.id) {
            max = a.id;
        } else if (b.id > a.id) {
            max = b.id;
        } else if (a.id === b.id) {
            max = a.id;
        }
    }

    let arrayTypes = types.split(';');
    arrayTypes = arrayTypes.filter(type => type != "");

    let pokemon = new Object();

    pokemon = {
        id: max + 1,
        name: name,
        stats: {
            hp: hp,
            attack: attack,
            defense: defense,
            speed: speed,
            'sp-atk': specialAttack,
            'sp-def': specialDefense,
        },
        type: arrayTypes
    }

    pokemonList.push(pokemon);

    alert("Pokemon adicionado com sucesso!");
}
