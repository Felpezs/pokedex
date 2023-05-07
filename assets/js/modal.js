const modal = document.getElementById('modal')

function changeTab(ev){
    const activeTab = document.querySelector('.navInfo li.active')
    const targetTab = ev.target

    if(activeTab === targetTab)
        return

    activeTab.classList.remove('active')
    let currentTabId = activeTab.dataset.tab
    document.querySelector(`div#${currentTabId}`).classList.remove('showTab')

    targetTab.classList.add('active')
    currentTabId = targetTab.dataset.tab
    document.querySelector(`div#${currentTabId}`).classList.add('showTab')
}

const aboutPokemon = (pokemon) => {
    return `
        <div id="about" class="showTab">
            <div class="description">
                <p class="attributte">Base exp:</p>
                <p>${pokemon.baseExp}exp</p>
            </div>
            <div class="description">
                <p class="attributte">Height:</p>
                <p>${pokemon.height}cm</p>
            </div>
            <div class="description">
                <p class="attributte">Weight:</p>
                <p>${pokemon.weight}kg</p>
            </div>
            <div class="description">
                <p class="attributte">Abilities:</p>
                <p>${pokemon.abilities.join(', ')}</p>
            </div>
            <div class="description">
                <p class="attributte">Habitat:</p>
                <p>${pokemon.habitat}</p>
            </div>
            <div class="description">
                <p class="attributte">Generation:</p>
                <p>${pokemon.generation}</p>
            </div>
            <h4>Story:</h4>
            <p class='story'>${pokemon.story}</p>       
        </div>
    `
}

const stats = (pokemon) => { 
    return `<div id="stats">
        ${pokemon.stats.map((stat) => `
            <div class="statLine">
                <span class="statProperty">${stat.name}</span>
                <span class="statValue">${stat.value}</span>
                <div class="statBar">
                    <span style="width: ${stat.value/3}%" class="${stat.name}"></span>
                </div>
            </div>`  
        ).join('')}
    </div>`
}    

const evolution = (pokemon) => {
    const src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/'
    return `
    <div id="evolution">
        <div class="evolutionContainer">
            ${pokemon.evolutionChain.map((evolution) => `
                <img src="${src+evolution.id}.png" alt="${evolution.name}">
                <p>${evolution.name}</p>
            `).join('')}
        </div>
    </div>`
}

function showPokemonDetails(pokemon){
    body.classList.add('disable-scroll')
    modal.style.display = 'block'
    modal.innerHTML = `
        <div class="pokemonOverview ${pokemon.type}">
            <div class="head">
                <span class="name">${pokemon.name}</span>
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
            <nav class="navInfo">
                <ul>
                    <li data-tab='about' class='active'>About</li>
                    <li data-tab='stats'>Stats</li>
                    <li data-tab='evolution'>Evolution</li>
                </ul>
            </nav>
            <div id="pokemonData">
                ${aboutPokemon(pokemon)}
                ${stats(pokemon)}
                ${evolution(pokemon)}
            </div>
            <span id="dataFooter"></span>
        </div>`
    const tabs = document.querySelector('.navInfo ul')
    
    for(let tab of tabs.children)
        tab.addEventListener('click', changeTab)
}

modal.addEventListener('click', (ev)=>{
    if(ev.target == modal){
        ev.target.style.display = 'none'
        body.classList.remove('disable-scroll')
    }
})