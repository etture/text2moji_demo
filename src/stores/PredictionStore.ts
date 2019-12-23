import { observable, action, extendObservable } from 'mobx';
import { EmojiPredictions, EmojiProbPair } from '../definitions/EmojiPredictions';

export interface IPredictionStore {
    queryString: string,
    predictions: EmojiPredictions,
    initialized: boolean,
    setQueryString(qStr: string): void,
    setPredictions(preds: EmojiPredictions): void
}

class Predictions implements EmojiPredictions {
    first: EmojiProbPair | undefined = undefined;
    second: EmojiProbPair | undefined = undefined;
    third: EmojiProbPair | undefined = undefined;
    fourth: EmojiProbPair | undefined = undefined;
    fifth: EmojiProbPair | undefined = undefined;

    constructor() {
        extendObservable(this, {});
    }

    setProbabilities(preds: EmojiPredictions) {
        this.first = preds.first;
        this.second = preds.second;
        this.third = preds.third;
        this.fourth = preds.fourth; 
        this.fifth= preds.fifth;
    }
}

export class PredictionStore implements IPredictionStore {
    @observable queryString = "";
    @observable predictions = new Predictions();
    @observable initialized = false;

    @action
    setQueryString(qStr: string) {
        this.queryString = qStr;
    }

    @action
    setPredictions(preds: EmojiPredictions) {
        this.initialized = true;
        this.predictions.setProbabilities(preds);
        console.log(this.predictions)
    }
}