import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import './App.scss';
import './components/layout/layout.scss';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
