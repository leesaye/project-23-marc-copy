import './App.css';
import { Fragment } from 'react';
import Main from './components/Main';
import { AuthProvider } from './contexts/useAuth';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <Fragment>
      <AuthProvider>
        <GoogleOAuthProvider process.env.clientId=GOOGLE_CLIENT_ID>
          {/* Things like a navbar that appear on all pages should be put here.
          For example, you would make a Navbar.js in the components directory,
          then import it here and put the component <Navbar /> above Main */}
          <Main />
        </GoogleOAuthProvider>
      </AuthProvider>
    </Fragment>
  );
}

export default App;
