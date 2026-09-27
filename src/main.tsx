import {StrictMode, Suspense, lazy} from 'react';
import { MotionConfig } from 'motion/react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import { PageTransition } from './components/PageTransition';
import App from './App.tsx';
const CardApp = lazy(() => import('./card/CardApp.tsx'));
import { ThemeProvider } from './context/ThemeContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
      <Suspense fallback={<div className="min-h-screen bg-surface text-heading p-6" role="status">Loading…</div>}>
      <PageTransition>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/card" element={<CardApp />} />
        <Route path="*" element={<main className="min-h-screen bg-surface text-heading p-8"><h1>Page not found</h1><Link to="/" className="underline">Return to Premier Mobile</Link></main>} />
      </Routes>
      </PageTransition>
      </Suspense>
      </ThemeProvider>
    </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
