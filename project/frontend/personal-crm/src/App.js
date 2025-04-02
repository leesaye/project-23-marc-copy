import './App.css';
import { Fragment } from 'react';
import Main from './components/Main';
import { AuthProvider } from './contexts/useAuth';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <Fragment>
      <AuthProvider>
        <GoogleOAuthProvider clientId="701175770587-uu3vvsfmgfopun5ccsnmotnokc89cnbd.apps.googleusercontent.com">
          <Main />
        </GoogleOAuthProvider>
      </AuthProvider>
    </Fragment>
  );
}

export default App;
