
import { Stock, Timeframe, StockDataPoint, NewsItem } from '../types';

const generateHistory = (basePrice: number, points: number, volatility: number): StockDataPoint[] => {
  const history: StockDataPoint[] = [];
  let currentPrice = basePrice * (1 - volatility);
  
  for (let i = 0; i < points; i++) {
    const change = currentPrice * (Math.random() * volatility * 2 - volatility) * 0.5;
    currentPrice += change;
    history.push({
      time: i.toString(),
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  return history;
};

export const getMockStocks = (timeframe: Timeframe): Stock[] => {
  const stockTemplates = [
    { ticker: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy & Retail', base: 2985.40 },
    { ticker: 'TCS', name: 'Tata Consultancy Services', sector: 'IT Services', base: 4120.15 },
    { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking', base: 1745.50 },
    { ticker: 'INFY', name: 'Infosys Ltd', sector: 'IT Services', base: 1890.30 },
    { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking', base: 1210.20 },
    { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom', base: 1540.10 },
    { ticker: 'SBIN', name: 'State Bank of India', sector: 'Banking', base: 815.45 },
    { ticker: 'ITC', name: 'ITC Ltd', sector: 'Consumer Goods', base: 495.20 },
    { ticker: 'LT', name: 'Larsen & Toubro Ltd', sector: 'Infrastructure', base: 3620.15 },
    { ticker: 'ADANIENT', name: 'Adani Enterprises', sector: 'Conglomerate', base: 3120.90 },
    { ticker: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automobile', base: 945.45 },
    { ticker: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'Consumer Goods', base: 2520.10 },
  ];

  const multipliers = {
    '1D': 0.03,
    '1W': 0.08,
    '1M': 0.15,
    '1Y': 0.50,
    '5Y': 2.50
  };

  const pointsCount = {
    '1D': 24,
    '1W': 35,
    '1M': 30,
    '1Y': 52,
    '5Y': 60
  };

  return stockTemplates.map(s => {
    const perfMultiplier = multipliers[timeframe];
    const change = (Math.random() * perfMultiplier * 100).toFixed(2);
    const history = generateHistory(s.base, pointsCount[timeframe], perfMultiplier * 0.5);
    
    return {
      ticker: s.ticker,
      name: s.name,
      price: s.base,
      changePercent: parseFloat(change),
      marketCap: `₹${(Math.random() * 15 + 5).toFixed(1)}L Cr`,
      sector: s.sector,
      volume: `${(Math.random() * 10 + 2).toFixed(1)}M`,
      history: history,
      description: `${s.name} is a cornerstone of the Indian economy, operating as a market leader in the ${s.sector} domain.`
    };
  }).sort((a, b) => b.changePercent - a.changePercent);
};

export const getMockNews = (stock: Stock): NewsItem[] => {
  const genericNews = [
    { headline: `${stock.name} shares surge as quarterly profits beat analyst estimates by 12%.`, source: 'Economic Times', timeAgo: '2h ago' },
    { headline: `Foreign Institutional Investors (FIIs) increase stake in ${stock.ticker} following positive sector outlook.`, source: 'Moneycontrol', timeAgo: '5h ago' },
    { headline: `How the latest RBI repo rate decision impacts ${stock.sector} stocks like ${stock.ticker}.`, source: 'Mint', timeAgo: '8h ago' },
    { headline: `${stock.name} announces strategic expansion into green energy and digital transformation.`, source: 'CNBC TV18', timeAgo: '1d ago' },
    { headline: `Market Analysis: Why ${stock.ticker} remains a top pick for long-term investors in the Indian market.`, source: 'Business Standard', timeAgo: '1d ago' }
  ];
  
  return genericNews.map((n, i) => ({
    id: `news-${i}`,
    ...n,
    url: '#'
  }));
};
