import { all } from 'redux-saga/effects';  // Import the 'all' effect from redux-saga to run multiple sagas concurrently
import MainSaga from './main/saga';  // Import the 'MainSaga' from the 'main/saga' file

// Define the root saga that combines all individual sagas
export default function* rootSaga() {
    // Use the 'all' effect to run multiple sagas in parallel
    yield all([
        MainSaga(),  // Run the MainSaga
    ]);
}
