import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import Header from './HeaderComponent';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
};

class Main extends Component {

    render() {

        return (
            <div>
                <Header />
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Main));