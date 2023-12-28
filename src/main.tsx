import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./styles/tailwind.css";
import { QueryClientProvider } from 'react-query';
import { queryClient } from './config/queryClient.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
