import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import https from 'https';

import { IPredictionStore } from '../stores/PredictionStore';
import { EmojiProbPair } from '../definitions/EmojiPredictions';
import { sleep } from '../utils/sleep';
import { protocol, domain, port, endpoint } from '../global/variables';

import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

axios.defaults.headers.common['Content-Type'] = 'application/json';
const agent = new https.Agent({
    rejectUnauthorized: false
});

interface IText2MojiProps {
    predictionStore?: IPredictionStore
}
interface IText2MojiState {
    loading: boolean,
    width: number
}

@inject('predictionStore')
@observer
class Text2Moji extends Component<IText2MojiProps, IText2MojiState> {
    constructor(props: IText2MojiProps) {
        super(props);
        this.state = {
            loading: false,
            width: window.innerWidth
        };
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    // make sure to remove the listener
    // when the component is not mounted anymore
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    handleQuery = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.predictionStore!.setQueryString(e.target.value);
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formProps = {
                'sentence': this.props.predictionStore!.queryString,
                httpsAgent: agent
            };
            this.setState({ loading: true });
            this.props.predictionStore!.setShowOff();
            await sleep(400); // To show the loader even when response is quick
            const response = await axios.post(`${protocol}://${domain}:${port}${endpoint}`, formProps);
            this.setState({ loading: false });
            this.props.predictionStore!.setPredictions(response.data);
        } catch (error) {
            this.setState({ loading: false });
            // TODO show there was error
            console.log(error);
        }
    }

    getDisplayStyle = (element: string): string => {
        switch (element) {
            case "loader":
                if (this.state.loading) {
                    return "block";
                } else {
                    return "none";
                }
            case "results":
                if (this.props.predictionStore!.show) {
                    return "block";
                } else {
                    return "none";
                }
            default:
                return "none";
        }
    }

    emojiResult = (): JSX.Element[] | JSX.Element => {
        let resultList: Array<JSX.Element> = [];
        if (this.props.predictionStore!.show) {
            // To adjust table shape depending on desktop or mobile
            const { width } = this.state;
            const isMobile = width <= 500;

            const preds = this.props.predictionStore!.predictions;
            const predsList: Array<EmojiProbPair> =
                [preds.first!, preds.second!, preds.third!, preds.fourth!, preds.fifth!];

            if (isMobile) {
                predsList.forEach(item => {
                    const emojiStr = String.fromCodePoint(parseInt(item.hexcode, 16));
                    const prob = (item.probability * 100).toFixed(2);
                    resultList.push(
                        <tr key={emojiStr}>
                            <td>
                                <h3 style={{ textAlign: "center" }}>{`${emojiStr}`}</h3>
                            </td>
                            <td>
                                <h3>{`${prob}%`}</h3>
                            </td>
                        </tr>
                    );
                });
                return resultList;
            } else {
                predsList.forEach(item => {
                    const emojiStr = String.fromCodePoint(parseInt(item.hexcode, 16));
                    resultList.push(
                        <td key={emojiStr}>
                            <div className="container">
                                <h3 style={{ textAlign: "center" }}>{`${emojiStr}`}</h3>
                                <h3>{`${item.probability * 100}%`}</h3>
                            </div>
                        </td>
                    );
                });
                return (
                    <tr>
                        {resultList}
                    </tr>
                );
            }
        }
        return resultList;
    }

    render() {
        return (
            <div className="container">
                <div className="container card" style={{ padding: "20pt 10pt" }}>
                    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => this.handleSubmit(e)}>
                        <h3>문장을 입력하세요.</h3>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="query"
                                placeholder="문장 -> 이모지"
                                value={this.props.predictionStore!.queryString}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleQuery(e)}
                            />
                        </div>
                        <button className="btn btn-primary" type="submit">제출</button>
                    </form>
                </div>
                <div style={{ display: this.getDisplayStyle("loader") }}>
                    <Loader type="Hearts" width={130} height={130} color="#D873CE" />
                </div>
                <div className="container card" style={{
                    display: this.getDisplayStyle("results"),
                    marginTop: "20pt",
                    padding: "20pt 10pt"
                }}>
                    <h3>결과</h3>
                    <table className="table table-sm table-borderless col-6">
                        <tbody>
                            {this.emojiResult()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Text2Moji;