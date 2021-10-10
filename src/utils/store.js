import { createStore } from "redux";

const initialState = {};

function saveToLocalStorage(state) {
  try {
    const serializedSate = JSON.stringify(state);
    // eslint-disable-next-line no-undef
    localStorage.setItem("state", serializedSate);
  } catch (e) {
  }
}

function loadFromLocalStorage() {
  try {
    // eslint-disable-next-line no-undef
    const serializedSate = localStorage.getItem("state");
    if (serializedSate === null) return undefined;
    return JSON.parse(serializedSate);
  } catch (e) {
    return undefined;
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.data,
        status: "logged",
      };
    case "LOGOUT":
      return {
        ...state,
        user: {},
        status: "",
      };

    default:
      return state;
  }
};

const persistedState = loadFromLocalStorage();

const store = createStore(reducer, persistedState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
