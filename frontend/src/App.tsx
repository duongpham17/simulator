import './styles/index.scss';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@redux/store';

import Global from 'global';
import Themes from 'themes';
import Pages from 'pages';
import Alert from 'constant/alert';
import Navbar from 'constant/navbar';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
        <Themes>
          <Global/>
          <Alert />
          <Navbar/>
          <Pages/>
        </Themes>
    </BrowserRouter>
  </Provider>
);

export default App;
