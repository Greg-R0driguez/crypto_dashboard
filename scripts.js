//Coin Gecko API

//variables
const showTopBtn = document.getElementById('showTopTen')
const closeTopBtn = document.getElementById('closeTopTen')

const showExBtn = document.getElementById('showExchange')
const closeExBtn = document.getElementById('closeExchange')

const searchResultsEl = document.getElementById('searchResultsDiv')
const topTenEl = document.getElementById('topTenDiv')
const exchangeEl = document.getElementById('exchangeDiv')

//event listners
searchResultsEl.addEventListener('click', (e) => {
    const deleteBtn = e.target
    if(deleteBtn.classList[0] === 'delete-btn') {
        const parentDiv = deleteBtn.parentElement
        parentDiv.remove()
    }
})

showTopBtn.addEventListener('click', () => {
    getGeckoApi("coins", displayTopTen)
    //prevent multiple calls to render repeat data
    showTopBtn.disabled = true 
})

closeTopBtn.addEventListener('click', () => {
    //clear out data and close card
    topTenEl.innerHTML = "" 
    showTopBtn.disabled = false
})

showExBtn.addEventListener('click', () => {
    getGeckoApi("exchanges", displayExchanges)
    showExBtn.disabled = true
})

closeExBtn.addEventListener('click', () => {
    exchangeEl.innerHTML = ""
    showExBtn.disabled = false
})

window.onload = () => {
    const searchFieldEl = document.querySelector('#searchField')

    searchFieldEl.addEventListener('keyup', (e) => {
        if(e.key === 'Enter') {
            getSearchedCoin(searchFieldEl.value)
            searchFieldEl.value = ""
        }
    })
}

//functions

//used chained thenables for fetch API
const getSearchedCoin = (query) => {
    fetch(`https://api.coingecko.com/api/v3/coins`).
    then(res => res.json()).
    then(data => {
        //checks for coin name or coin ticker symbol
        const coinResults = data.filter(coins => coins.id === query.toLowerCase() || 
        coins.symbol === query.toLowerCase())
        renderSearchResults(coinResults)
    })
}

const renderSearchResults = (coin) => {
    //destructured to store in multiple variables names
    const [{ 
        id,
        name, 
        image:{thumb: img}, 
        market_data:{
            current_price: {usd: currentPrice}, 
            price_change_24h: priceChange,
            market_cap_rank: rank},
    }] = coin
    searchResultsEl.innerHTML += `
            <div class="search-card">
                <button id=${id} type="button" class="delete-btn">X</button>
                <div class="search-title">
                    <img src=${img}/>
                    <h3>${name}</h3>
                </div>
                <p>Rank: ${rank}</p>
                <p>Current Price: $${currentPrice.toFixed(2)}</p>
                <p>24hr Price Change: $${priceChange.toFixed(2)}</p>
            </div>
        `
}

//param 1 for endspoints of API, param 2 for display function
const getGeckoApi = async (endpoint, displayFunction) => { 
    const url = `https://api.coingecko.com/api/v3/${endpoint}`
    const res = await fetch(url)
    const data = await res.json()
    data.splice(10) //removed array elements to just get first ten
    displayFunction(data) //call func and pass data
}

const displayTopTen = (coinData) => {  
    //Choose not to destruct nested items, only using three data points.
    for(coin of coinData) {
        topTenEl.innerHTML += `
        <div class="card-info">
            <h3>${coin.symbol.toUpperCase()} - ${coin.name}</h3>
            <p>$${coin.market_data.current_price.usd.toFixed(2)}</p>
        </div>
        <hr>
        `
    }
}

const displayExchanges = (exchangeData) => {
    //using a different method to render to the DOM
    exchangeData.forEach(exchange => {
        exchangeEl.innerHTML += `
        <div class="card-info">
            <a href="${exchange.url}" target="_blank">
            <h3>${exchange.name}</h3> 
            </a>
        </div>
        `
    })
}

