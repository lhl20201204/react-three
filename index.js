import React from "react";
import App from './test/App.jsx';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('container');
const root = createRoot(container); 
root.render(<App />);