import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.tsx';
import CardApp from './card/CardApp.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ThemeProvider><App /></ThemeProvider>} />
        <Route path="/card" element={<ThemeProvider><CardApp /></ThemeProvider>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

