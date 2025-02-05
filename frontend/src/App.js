import React, { Suspense, lazy } from 'react';

const TransactionDashboard = lazy(() => import('./components/TransactionDashboard'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <TransactionDashboard />
      </Suspense>
    </div>
  );
}

export default App;
