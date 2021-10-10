import React, { Suspense } from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import AppRoutes from "./utils/routes";
import firebaseConfig from "./utils/firebase";
import { FirebaseAppProvider } from "reactfire";
import * as firebase from "firebase";
import Loading from "./components/loading/loading";
import { Provider } from 'react-redux'
import store from './utils/store'
import 'bootstrap/dist/css/bootstrap.min.css';


const onRedirectCallback = (appState) => {
  window.history.replaceState({}, document.title, appState && appState.targetUrl ? appState.targetUrl : window.location.pathname + "/");
};

render(
  <div className="app-style">
   <Provider store={store}>
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <Suspense fallback={<Loading />}>
      <AppRoutes />
    </Suspense>
  </FirebaseAppProvider>
    </Provider>
  </div>
,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
