export async function getCoins() {
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&price_change_percentage=1h,24h,7d&sparkline=true&x_cg_demo_api_key=CG-MLnY1PgXaHGgKapUQVKrPxXe';

  try {
    const response = await fetch (url);
    
    if (!response.ok) {
      throw new Error("Ошибка" + response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }

}

export function templateEngine(coin) {
  const {market_cap_rank: rank, name, image, symbol,  
    current_price: price, price_change_percentage_1h_in_currency: hour, 
    price_change_percentage_24h: day, market_cap: market, 
    total_volume: volume, sparkline_in_7d: chart } = coin;

    const prices = coin.sparkline_in_7d.price;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const height = 40;
    const width = 140;

    const points = prices.map((price, index) => {
      const x = (index / (prices.length - 1)) * width;
      const y = height - ((price - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ');

    const color = prices[0] <= prices[prices.length - 1] ? '#00ff88' : '#ff3b3b';

      
    return `<div class="tracker-row">
            <div class="tracker-body__row rank">${rank}</div>
            <div class="tracker-body__row name"><img src="${image}">${name}<span>${symbol.toUpperCase()}</span></div>
            <div class="tracker-body__row price">$${price}</div>
            <div class="tracker-body__row hour">${hour?.toFixed(1)}%</div>
            <div class="tracker-body__row day">${day?.toFixed(1)}%</div>
            <div class="tracker-body__row market-cap">$${market}</div>
            <div class="tracker-body__row volume">$${volume}</div>
            <div class="tracker-body__row chart"><svg width="${width}" height="${height}"><polyline fill="none" stroke="${color}" stroke-width="2" points="${points}"/></svg></div> 
            </div>`         
  }


