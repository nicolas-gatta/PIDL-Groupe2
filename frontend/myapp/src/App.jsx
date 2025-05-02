// src/App.jsx
import React from 'react';
import AppRouter from './routes/AppRouter';  

const App = () => {
    return (
        <div>
            <AppRouter />  {/* Affiche les pages en fonction des routes */}
        </div>
    );
};

export default App;
