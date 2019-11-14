import React from 'react';
import ReactDOM from 'react-dom';
import ConfigurationIndex from './index';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('./components/ConfigurationTable');

it('renders index without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <ConfigurationIndex />
    </Router>
  , div);
  ReactDOM.unmountComponentAtNode(div);
  console.log(div);
});
