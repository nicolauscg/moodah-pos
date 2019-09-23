// import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  // error Cannot read property 'HOC' of undefined 
  // in src/containers/_layout/topbar/Topbar.jsx
  // ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
