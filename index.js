
const input = document.getElementById("input-box");
const searchButton = document.getElementById("searchButton");
const boxCoinsSearched = document.getElementById("container-crypto-prices");

let coinsSearched = [];

function searchCoin(){
    fetchData();
    input.value = "";
}

function showCoinsOnScreen(){

    let newListCoins = '';

    //for every crypto, we put this in newListCoins 
    coinsSearched.forEach(coin => {
        newListCoins += `<div class="box">
                            <div class="crypto">
                                <h3 class="crypto-name">${coin.name}</h3>
                                <img width="20" height="20" src="${coin.url}" alt="crypto-icon">
                            </div>
                            <h4 class="crypto-price">${coin.price} USD</h2>
                            <h4 class="crypto-change ${coin.change >= 0 && "green-price"} ${coin.change < 0 && "red-price"}">${coin.change} %</h2>
                         </div>`;
    });

    //change the structure of our website
    boxCoinsSearched.innerHTML = newListCoins;
}

async function fetchData(){
    try{
        
        const coinName = input.value.toLowerCase(); //name of the crypto desired in lower case

        const allCoins = await fetch(`https://api.coinpaprika.com/v1/tickers`); //use this endpoint to retrieve all cryptos

        if(!allCoins.ok)//if was not sucessful
        {
            throw new Error("Could not fetch resource")
        }

        const data = await allCoins.json(); //convert the response to json
        
        //search for the desired crypto, and put the object related to that crypto in an array
        let coinObtained = data.filter(cryptocoin => {
            return cryptocoin.name.toLowerCase() === coinName;
        });

        //if the array is empty, return error
        if(coinObtained.length === 0)
        {
            throw new Error("Coin does not exist!!!")
        }
        
        //use another endpoint to retrieve more info (we need the logo) about the desired crypto,
        const coinExtraInfo = await fetch(`https://api.coinpaprika.com/v1/coins/${coinObtained[0].id}`);

        //if we could not fetch or the crypto doens't exists
        if(!coinExtraInfo.ok)
        {
            throw new Error("Could not fetch resource")
        }
        if(coinExtraInfo.length === 0)
        {
            throw new Error("Coin does not exist!!!")
        }

        //convert the retrived info to json
        const coinExtraInfoData = await coinExtraInfo.json();

        //append to the list with all searched cryptos, a object with this structure
        coinsSearched.push({name: coinObtained[0].symbol, price: coinObtained[0].quotes.USD.price.toFixed(2), change: coinObtained[0].quotes.USD.percent_change_24h.toFixed(2), url: coinExtraInfoData.logo})
        
        //update what we see in the screen
        showCoinsOnScreen();
    }
    catch(error)
    {
        console.log(error);
    }
}


showCoinsOnScreen();