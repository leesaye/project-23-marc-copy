import './App.css';
import { Fragment } from 'react';
import Main from './components/Main';

function App() {
  return (
    <Fragment>
      {/* Things like a navbar that appear on all pages should be put here. 
      For example, you would make a Navbar.js in the components directory,
      then import it here and put the component <Navbar /> above Main */}
      <Main />
    </Fragment>
  );
}

export default App;
