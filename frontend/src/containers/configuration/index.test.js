// import React from 'react';
// import ReactDOM from 'react-dom';
// import ConfigurationIndex from './index';
// import { BrowserRouter as Router } from 'react-router-dom';

// jest.mock('./components/ConfigurationTable');

// it('renders index without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(
//     <Router>
//       <ConfigurationIndex />
//     </Router>
//   , div);
//   ReactDOM.unmountComponentAtNode(div);
//   console.log(div);
// });
import renderer from 'react-test-renderer'
// import Sidebar from '../Sidebar'
import ConfigurationIndex from './index';

jest.mock('./components/ConfigurationTable', () => 'ConfigurationTable');
// jest.mock('react-router-dom/Link', () => 'Link')

it('should render correctly', () => {
  // eslint-disable-next-line react/react-in-jsx-scope
  const component = renderer.create(<ConfigurationIndex />)
  expect(component.toJSON()).toMatchSnapshot()
})