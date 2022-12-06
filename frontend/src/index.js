import React from "react";
import ReactDOMClient from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import ContextProvider from "./context/ContextProvider";
import AuthProvider from './context/AuthProvider'
import './index.css'

const root = ReactDOMClient.createRoot(document.getElementById('root'))

root.render(
    <Router>
        <AuthProvider>
            <ContextProvider>

                <App />
            </ContextProvider>
        </AuthProvider>
    </Router>
)