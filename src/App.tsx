import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { extendObservable } from 'mobx';
import logo from './logo.svg';
import './App.css';

import Text2Moji from './views/Text2Moji';

interface IAppProps extends RouteComponentProps<{}> { }
interface IAppState { }

class App extends Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);
        extendObservable(this, {});
    }

    render() {
        return (
            <div>
                <div style={{
                    background: "#B5D89E", 
                    height: "40pt",
                    marginBottom: "30pt",
                    padding: "3pt 65pt",
                    verticalAlign: "baseline"
                    }}>
                    <h2 style={{
                        color: "white", 
                        display: "inline-block"
                    }}>Text2Moji Demo</h2>
                    <img style={{marginTop: "-4pt", float: "right"}} src={process.env.PUBLIC_URL + '/ybigta_logo.png'} height="55pt"/>
                </div>
                <Text2Moji />
            </div>
        );
    }
}

export default withRouter(App);
