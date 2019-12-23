import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import axios from 'axios';

import { IPredictionStore } from '../stores/PredictionStore';
import { EmojiProbPair } from '../definitions/EmojiPredictions';

interface IText2MojiProps extends RouteComponentProps<{}> {
    predictionStore?: IPredictionStore
}
interface IText2MojiState { }

@inject('predictionStore')
@observer
class Text2Moji extends Component<IText2MojiProps, IText2MojiState> {
    constructor(props: IText2MojiProps) {
        super(props);
    }

    handleQuery = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.predictionStore!.setQueryString(e.target.value);
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formProps = {
                'sentence': this.props.predictionStore!.queryString
            };
            axios.defaults.headers.common['Content-Type'] = 'application/json'
            const response = await axios.post(`http://localhost:8123/hello`, formProps);
            this.props.predictionStore!.setPredictions(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    emojiResult = (): JSX.Element[] => {
        let resultList: Array<JSX.Element> = [];
        if (this.props.predictionStore!.initialized) {
            const preds = this.props.predictionStore!.predictions;
            const predsList: Array<EmojiProbPair> = [preds.first!, preds.second!, preds.third!, preds.fourth!, preds.fifth!];
            predsList.forEach(item => {
                const hexStr = String.raw`{${item.hexcode}}`;
                const hex = '\\u' + `{${item.hexcode}}`;
                // const utf = convert.hexToUtf8(hex);
                const emojiStr = String.fromCodePoint(parseInt(item.hexcode, 16));
                resultList.push(
                    <li key={item.hexcode} className="list-group-item">
                        <div className="container">
                            <h3>{`${emojiStr}`}</h3>
                            <h3>{`${item.probability}`}</h3>
                        </div>
                    </li>
                )
            });
        }
        return resultList;
    }

    render() {
        return (
            <div className="container">
                <div className="container card">
                    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
                        <h3>문장을 입력하세요.</h3>
                        <div className="form-group">
                            <label className="label">문장</label>
                            <input
                                className="form-control"
                                type="text"
                                name="query"
                                value={this.props.predictionStore!.queryString}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleQuery(e)}
                            />
                        </div>
                        <button className="btn btn-primary" type="submit">제출</button>
                    </form>
                </div>
                <div className="container card">
                    <h3>결과</h3>
                    <ul>
                        {this.emojiResult()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(Text2Moji);