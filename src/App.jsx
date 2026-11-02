import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Voting from './pages/Voting';
import ModelVote from './pages/ModelVote';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Voting />} />
            <Route path="/vote/:modelId" element={<ModelVote />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
