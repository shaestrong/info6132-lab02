import * as React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import { initializeApp } from '@react-native-firebase/app';
import TodoApp from './screens/TodoApp';

// Initialize Firebase
initializeApp();

const App = () => {
  return (
    <Provider store={store}>
      <TodoApp/>
    </Provider>
  );
}

export default App;
