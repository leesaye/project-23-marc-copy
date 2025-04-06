import './App.css';
import { Fragment } from 'react';
import Main from './components/Main';
import { AuthProvider } from './contexts/useAuth';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <Fragment>
      <AuthProvider>
        <GoogleOAuthProvider clientId="<GOOGLE_CLIENT_ID>">
          <Main />
        </GoogleOAuthProvider>
      </AuthProvider>
    </Fragment>
  );
}

export default App;
