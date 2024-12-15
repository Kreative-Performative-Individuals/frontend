import React from 'react'; // Import React library for building UI components
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering React components into the DOM
import './index.css'; // Import global CSS styles
import App from './App'; // Import the main App component
import { Provider } from 'react-redux'; // Import the Provider component to integrate Redux with React
import '@fontsource/roboto/300.css'; // Import Roboto font with weight 300
import '@fontsource/roboto/400.css'; // Import Roboto font with weight 400
import '@fontsource/roboto/500.css'; // Import Roboto font with weight 500
import '@fontsource/roboto/700.css'; // Import Roboto font with weight 700
import store from './store'; // Import the Redux store configuration

// Get the root DOM element where the React app will be rendered
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the React application within the root element
root.render(
  <React.StrictMode> 
    {/* StrictMode helps detect potential issues in an application and enforces best practices */}
    <Provider store={store}> 
      {/* Provider makes the Redux store available to all nested components */}
      <App /> 
      {/* The main App component that serves as the root of the React app */}
    </Provider>
  </React.StrictMode>
);
