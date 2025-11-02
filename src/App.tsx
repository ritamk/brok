import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';

function App() {
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-main-dark text-text-primary flex flex-col">
      {/* Header */}
      <header>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-5xl font-bold text-blue font-brand">
            brok
          </h1>
          <p className="text-text-primary/90 mt-1">{'let\'s make money'}</p>
        </div>
      </header>

      {/* Main content */}
      <main className={`flex-1 container mx-auto px-4 py-8 ${isHomePage ? 'flex items-center justify-center' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-text-muted">
          <p>
            <span className="font-bold font-brand">
              brok
            </span>
            {' '} by Ritam
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
