import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './components/App';
import { AuthProvider } from './context/AuthProvider';
import { Provider } from 'react-redux';
import store from './slices/index.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <AuthProvider >
       
        <App />
        
    </AuthProvider>
    </Provider>
);

