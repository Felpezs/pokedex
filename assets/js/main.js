const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const body = document.body

const limit = 40
let offset = 0

const maxRecords = 151

function loadPokemonItens(offset, limit){
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {    
        pokemonList.append(...pokemons.map((pokemon) => {
            let li = document.createElement('li')
            li.classList.add('pokemon', pokemon.type)
            li.innerHTML = `
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            `
            li.addEventListener('click', ()=>showPokemonDetails(pokemon))
            return li
        }))  
     })
     
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtyRecordNextPage = offset + limit

    if(qtyRecordNextPage >= maxRecords){
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else{
        loadPokemonItens(offset, limit)
    }
})