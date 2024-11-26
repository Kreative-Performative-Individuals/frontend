import { all } from 'redux-saga/effects'
import MainSaga from './main/saga';

export default function* rootSaga() {
    yield all([
        MainSaga(),
    ])
}