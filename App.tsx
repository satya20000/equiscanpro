
import React, { useState, useEffect, useMemo } from 'react';
import { Timeframe, Stock, MarketInsight, NewsItem } from './types';
import { getMockStocks, getMockNews } from './data/mockData';
import { getStockInsight } from './services/geminiService';
import StockChart from './components/StockChart';

const App: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const data = getMockStocks(timeframe);
    setStocks(data);
    if (!selectedStock || !data.find(s => s.ticker === selectedStock.ticker)) {
      setSelectedStock(data[0]);
    }
  }, [timeframe]);

  useEffect(() => {
    if (selectedStock) {
      fetchInsight(selectedStock, timeframe);
      setNews(getMockNews(selectedStock));
    }
  }, [selectedStock, timeframe]);

  const fetchInsight = async (stock: Stock, tf: Timeframe) => {
    setLoadingInsight(true);
    const data = await getStockInsight(stock, tf);
    setInsight(data);
    setLoadingInsight(false);
  };

  const filteredStocks = useMemo(() => {
    return stocks.filter(s => 
      s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stocks, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
               <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-none">EquiScan India</h1>
               <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">NSE & BSE Pro</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {(['1D', '1W', '1M', '1Y', '5Y'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  timeframe === tf 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tf}
              </button>
            )}
          </div>

          <div className="relative">
            <input 
              type="text"
              placeholder="Search Indian stocks..."
              className="bg-slate-900 border border-slate-800 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 md:w-64 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Top Gainers List */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Top Gainers ({timeframe})
            </h2>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Live Feed</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3">
            {filteredStocks.map((stock) => (
              <button
                key={stock.ticker}
                onClick={() => setSelectedStock(stock)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                  selectedStock?.ticker === stock.ticker
                    ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="font-bold text-lg">{stock.ticker}</div>
                  <div className="text-xs text-slate-400 truncate w-32">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{stock.price.toLocaleString('en-IN')}</div>
                  <div className="text-sm font-medium text-emerald-400 flex items-center justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    +{stock.changePercent}%
                  </div>
                </div>
              </button>
            ))}
            {filteredStocks.length === 0 && (
              <div className="text-center py-10 text-slate-500 italic">No stocks found matching your search.</div>
            )}
          </div>
        </div>

        {/* Main Content: Stock Detail & AI Analysis */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {selectedStock ? (
            <>
              {/* Performance Section */}
              <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      {selectedStock.name}
                      <span className="text-lg font-normal text-slate-500">({selectedStock.ticker})</span>
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-400">
                      <span>Sector: {selectedStock.sector}</span>
                      <span>M-Cap: {selectedStock.marketCap}</span>
                      <span>Vol: {selectedStock.volume}</span>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <div className="text-4xl font-bold tracking-tight">₹{selectedStock.price.toLocaleString('en-IN')}</div>
                    <div className="text-lg font-semibold text-emerald-400">+{selectedStock.changePercent}% today</div>
                  </div>
                </div>

                <div className="h-[350px] w-full bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50">
                  <StockChart data={selectedStock.history} color="#10b981" />
                </div>
              </div>

              {/* AI Insight Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">AI Market Sentiment</h3>
                  </div>
                  
                  {loadingInsight ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-slate-800 rounded w-full"></div>
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                      <div className="h-10 bg-slate-800 rounded w-1/4"></div>
                    </div>
                  ) : insight ? (
                    <div className="flex flex-col h-full justify-between">
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
                        "{insight.summary}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          insight.sentiment === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400' : 
                          insight.sentiment === 'Bearish' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {insight.sentiment}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-800 text-slate-400`}>
                          Risk: {insight.riskLevel}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-sm">Select a stock to view analysis.</p>
                  )}
                </div>

                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                   <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Growth Drivers (NSE Focus)
                  </h3>
                  {loadingInsight ? (
                    <div className="space-y-3 animate-pulse">
                      {[1,2,3].map(i => <div key={i} className="h-8 bg-slate-800 rounded w-full"></div>)}
                    </div>
                  ) : insight ? (
                    <ul className="space-y-2">
                      {insight.keyDrivers.map((driver, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950/30 p-2 rounded-lg border border-slate-800/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {driver}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic text-sm">Waiting for insights...</p>
                  )}
                </div>
              </div>

              {/* Recent News Section */}
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4v4h4" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h3M7 12h10M7 16h10" />
                    </svg>
                    Latest Indian Market News: {selectedStock.ticker}
                  </h3>
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">View All News</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      className="group p-4 bg-slate-950/40 rounded-xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex flex-col gap-3"
                    >
                      <h4 className="text-sm font-medium leading-snug group-hover:text-emerald-400 transition-colors">
                        {item.headline}
                      </h4>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-bold uppercase tracking-wider">
                          {item.source}
                        </span>
                        <span className="text-[10px] text-slate-500 italic">
                          {item.timeAgo}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-xl font-medium">Select a stock to see Indian market analysis & news</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-[#0f172a] p-6 text-center text-slate-500 text-xs mt-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; 2024 EquiScan India - Financial Intelligence. Powered by Gemini 3. Market data simulated for NSE/BSE.</p>
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> NSE Online</span>
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> BSE Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
