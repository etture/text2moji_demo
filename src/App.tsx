import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
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
            <Text2Moji />
        );
    }
}

export default withRouter(App);
