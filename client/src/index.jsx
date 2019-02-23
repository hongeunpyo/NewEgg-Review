import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Overview from './components/overview.jsx';
import Reviews from './components/reviews.jsx';
import Blank from './components/blank.jsx'
import $ from 'jquery';
import {awsReview} from '../config.js'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            view: "reviews",
            reviews: [],
            currentItem: 1
        };
        this.getReviews = this.getReviews.bind(this);
        this.voteHelpful = this.voteHelpful.bind(this);
        this.voteNotHelpful = this.voteNotHelpful.bind(this);
        this.renderView = this.renderView.bind(this);
        this.changeView = this.changeView.bind(this);
        this.getItemByUrl = this.getItemByUrl.bind(this);
    }

    getItemByUrl() {
        let item = window.location.href.split('/')[3] || 1;
        this.setState({currentItem: item}, () => {
            this.getReviews();
        });
    }

    getReviews() {
        let itemId = this.state.currentItem;
        axios.get(`${awsReview}/reviews/${itemId}`)
             .then((response) => this.setState({reviews: response.data}))
             .catch((err) => console.error('There was a problem getting reviews: ' + err))
    }

    voteHelpful(review) {
        axios.patch(`${awsReview}/reviews`, {id: review.id, helpful: true})
             .then((response) => this.getReviews())
             .catch((err) => console.error('Could not process vote'));
    }

    voteNotHelpful(review) {
        axios.patch(`${awsReview}/reviews`, {id: review.id, helpful: false})
             .then((response) => this.getReviews())
             .catch((err) => console.error('Could not process vote'))
    }

    componentDidMount() {
        this.getItemByUrl();
    }

    changeView(newView) {
        this.setState(
            {view: newView}
            );
    }

    renderView() {
        let {view} = this.state;
        let {reviews} = this.state;
        if (view === 'reviews' && Array.isArray(reviews) && reviews.length > 0) {
            return (
                <React.Fragment>
                    <Reviews voteHelpful={this.voteHelpful} voteNotHelpful={this.voteNotHelpful} sort={this.sort} filterByRating={this.ratingFilter} reviews={this.state.reviews} />
                </React.Fragment>
            )
        } else {
            return <Blank />
        }
    }

    render() {
        return (
            <div className="reviewApp">
                <div className="navbar">
                    <span className={this.state.view === 'overview'
                        ? 'nav_selected'
                        : 'nav_unselected'}
                        onClick={() => this.changeView('overview')}
                        id="overview">
                        <span className="nav_title">Overview</span>
                        </span>
                    <span className={this.state.view === 'specs'
                        ? 'nav_selected'
                        : 'nav_unselected'}
                        onClick={() => this.changeView('specs')}
                        id="specs">
                        <span className="nav_title">Specifications</span>
                        </span>
                    <span className={this.state.view === 'warranty'
                        ? 'nav_selected'
                        : 'nav_unselected'}
                        onClick={() => this.changeView('warranty')}
                        id="warranty">
                        <span className="nav_title">Warranty & Returns</span>
                        </span>
                    <span className={this.state.view === 'reviews'
                        ? 'nav_selected'
                        : 'nav_unselected'}
                        onClick={() => this.changeView('reviews')}
                        id="reviews">
                        <span className="nav_title">Reviews</span>
                        </span>
                    <span className={this.state.view === 'questions'
                        ? 'nav_selected'
                        : 'nav_unselected'}
                        onClick={() => this.changeView('questions')}
                        id="questions">
                        <span className="nav_title">Q&A</span>
                        </span>
                </div>
                <div className="main">
                    {this.renderView()}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('reviewApp'));