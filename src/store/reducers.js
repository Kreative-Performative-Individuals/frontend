import { combineReducers } from 'redux';  // Import the combineReducers function to combine multiple reducers
import main from './main/reducer';  // Import the 'main' reducer from the 'main/reducer' file

// Combine all individual reducers into a rootReducer
const rootReducer = combineReducers({
    main  // Add the 'main' reducer to the combined reducers
});

export default rootReducer;  // Export the rootReducer as the default export
