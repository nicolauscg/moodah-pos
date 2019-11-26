import React from 'react';
import ReactDOM from 'react-dom';
import ProductCategoryIndex from './index';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('./components/ProductCategoryTable');

it('renders index without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <ProductCategoryIndex />
    </Router>
  , div);
  ReactDOM.unmountComponentAtNode(div);
  console.log(div);
});
