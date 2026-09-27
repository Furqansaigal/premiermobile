import {StrictMode, Suspense, lazy} from 'react';
import { MotionConfig } from 'motion/react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.tsx';
const CardApp = lazy(() => import('./card/CardApp.tsx'));
import { ThemeProvider } from './context/ThemeContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<div className="min-h-screen bg-surface text-heading p-6" role="status">Loading…</div>}>
      <Routes>
        <Route path="/" element={<ThemeProvider><App /></ThemeProvider>} />
        <Route path="/card" element={<ThemeProvider><CardApp /></ThemeProvider>} />
        <Route path="*" element={<main className="min-h-screen bg-surface text-heading p-8"><h1>Page not found</h1><a href="/" className="underline">Return to Premier Mobile</a></main>} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
