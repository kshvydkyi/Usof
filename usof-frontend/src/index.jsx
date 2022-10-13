import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './components/App';
import { AuthProvider } from './context/AuthProvider';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <Provider store={store}>
    <AuthProvider >
       <Routes>
        <Route path='/*' element={<App />} />
        </Routes>
    </AuthProvider>
    </Provider>
    </BrowserRouter>
);

