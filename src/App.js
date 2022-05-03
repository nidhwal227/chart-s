
import './App.css';
import React from 'react';

import MyChart from './MyChart';
import SearchBar from './SearchBar';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { useState } from 'react';




const queryClient = new QueryClient();
function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [displayRecent, changeDisplayRecent] = useState('AAPL');
  return (

    <QueryClientProvider client={queryClient}>
      <div className="chart flex justify-center items-center h-screen flex-col bg-slate-200">
        <SearchBar symbol={symbol} setSymbol={setSymbol} displayRecent={displayRecent} changeDisplayRecent={changeDisplayRecent} />
        <MyChart symbol={symbol} displayRecent={displayRecent} className="pie-chart flex place-content-center justify-center" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
