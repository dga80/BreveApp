import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Pragmapp:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="text-xl font-bold mb-2">Ha ocurrido un error al cargar Pragmapp</h1>
          <p className="text-sm text-stone-600 max-w-md mb-6">
            Hemos detectado un problema con los datos almacenados en el navegador ({this.state.error?.message}).
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 bg-teal-700 text-white text-sm font-semibold rounded-2xl shadow-md hover:bg-teal-800 transition-all"
          >
            Restablecer aplicación y cargar versión limpia
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register Service Worker for PWA support
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Pragmapp ServiceWorker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.error('Pragmapp ServiceWorker registration failed:', error);
      });
  });
}

