const pokeApi = {}

const getIdBySpecieUrl = (specieUrl) => (specieUrl.substring(42)).replace('/', '')

function getPokemonEvolution (evolutionUrl){
    return fetch(evolutionUrl)
    .then((pokemonEvolution) => pokemonEvolution.json())
    .then((evolution) => {
        let evolutionList = []
        let evolutionChain = evolution.chain

        //Reference: https://stackoverflow.com/questions/39112862/pokeapi-angular-how-to-get-pokemons-evolution-chain
        do{
            let numberOfEvolutions = evolutionChain.evolves_to.length;  

            evolutionList.push({
                'name': evolutionChain.species.name,
                'id': getIdBySpecieUrl(evolutionChain.species.url)
            })
          
            if(numberOfEvolutions > 1) {
              for (let i = 1; i < numberOfEvolutions; i++) { 
                evolutionList.push({
                    'name': evolutionChain.evolves_to[i].species.name,
                    'id': getIdBySpecieUrl(evolutionChain.evolves_to[i].species.url)
                })
              }
            }        
      
            evolutionChain = evolutionChain.evolves_to[0];
      
          }while(!!evolutionChain && evolutionChain.hasOwnProperty('evolves_to'));

          return evolutionList
    })
}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    const speciesUrl = pokeDetail.species.url

    return fetch(speciesUrl)
    .then((pokemonSpecie) => pokemonSpecie.json())
    .then((specie)=>{
        pokemon.story = specie.flavor_text_entries[0].flavor_text.replace('\n',' ').replace('\f',' ')
        pokemon.generation = specie.generation.name
        pokemon.habitat = specie.habitat.name
        return specie.evolution_chain.url
    })
    .then((evolutionUrl) => getPokemonEvolution(evolutionUrl))
    .then((evolutionChain) => pokemon.evolutionChain = JSON.parse(JSON.stringify(evolutionChain)))
    .then(() => {
        pokemon.number = pokeDetail.id
        pokemon.name = pokeDetail.name

        const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
        const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)
        const statsMap = pokeDetail.stats.map((statSlot)=>{
            let statName = statSlot.stat.name
            if(statName.includes('special'))
                statName = statName.replace('special', 'sp')
            
            
            return {'name': statName, 'value': statSlot.base_stat}
        })

        const [ type ] = types

        pokemon.abilities = abilities
        pokemon.types = types
        pokemon.type = type
        pokemon.photo = pokeDetail.sprites.versions['generation-v']['black-white'].animated.front_default
        pokemon.height = pokeDetail.height * 10 //decimeter to centimeter
        pokemon.weight = pokeDetail.weight //Kg
        pokemon.baseExp = pokeDetail.base_experience
        pokemon.stats = statsMap

        return pokemon
    }) 
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)
}
pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`

    return fetch(url)
        .then((response) => response.json())
        .then((responseBody) => responseBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
        .catch((error) => console.error(error))
}