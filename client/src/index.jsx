import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Overview from "./components/overview.jsx";
import Reviews from "./components/reviews.jsx";
import Blank from "./components/blank.jsx";
import $ from "jquery";
import { awsReview } from "../config.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "reviews",
      reviews: [],
      currentItem: 1,
      sortBy: "date",
      reviewsVotedOn: [],
      filters: [],
      filteredReviews: []
    };
    this.getReviews = this.getReviews.bind(this);
    this.voteHelpful = this.voteHelpful.bind(this);
    this.voteNotHelpful = this.voteNotHelpful.bind(this);
    this.renderView = this.renderView.bind(this);
    this.changeView = this.changeView.bind(this);
    this.getItemByUrl = this.getItemByUrl.bind(this);
    this.sortReviews = this.sortReviews.bind(this);
    this.setSort = this.setSort.bind(this);
    this.filterReviews = this.filterReviews.bind(this);
  }

  componentDidMount() {
    this.getItemByUrl();
  }

  getItemByUrl() {
    let item = window.location.href.split("/")[3] || 1;
    this.setState({ currentItem: item }, () => {
      this.getReviews();
    });
  }

  getReviews() {
    let itemId = this.state.currentItem;
    axios
      .get(`http://${awsReview}/reviews/${itemId}`)
      .then(response => {
        this.setState({ reviews: response.data });
      })
      .then(() => {
        this.sortReviews(this.state.sortBy);
      })
      .catch(err =>
        console.error("There was a problem getting reviews: " + err)
      );
  }

  filterReviews(filterType) {
    const currentFilters = this.state.filters;
    console.log(currentFilters);
    if (currentFilters.indexOf(filterType) !== -1) {
      currentFilters.splice(currentFilters.indexOf(filterType), 1);
    } else {
      currentFilters.push(filterType);
    }
    this.setState({ filters: currentFilters }, () => {
      if (filterType === "verified") {
        let results = [];
        this.sortReviews(this.state.sortBy);
        this.state.reviews.filter(review => {
          if (review.verified === "T") {
            results.push(review);
          }
        });
        this.setState({ filteredReviews: results });
      }
    });
  }

  voteHelpful(review) {
    let votedItems = this.state.reviewsVotedOn;
    votedItems.push(review.id);
    console.log("event clicked on", review);
    this.setState({ reviewsVotedOn: votedItems }, () => {
      axios
        .patch(`http://${awsReview}/reviews`, { id: review.id, helpful: true })
        .then(response => this.getReviews())
        .catch(err => console.error("Could not process vote"));
    });
  }

  voteNotHelpful(review) {
    this.setState({
      reviewsVotedOn: this.state.reviewsVotedOn.push(review.id)
    });
    axios
      .patch(`http://${awsReview}/reviews`, { id: review.id, helpful: false })
      .then(response => this.getReviews())
      .catch(err => console.error("Could not process vote"));
  }

  setSort(attribute) {
    this.setState({ sortBy: attribute }, () =>
      this.sortReviews(this.state.sortBy)
    );
  }

  sortReviews(attribute) {
    // if (this.state.filters) {
    if (this.state.sortBy === "date") {
      this.setState({
        reviews: this.state.reviews.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
      });
      this.setState({
        filteredReviews: this.state.filteredReviews.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
      });
    }
    if (this.state.sortBy === "helpful") {
      this.setState({
        reviews: this.state.reviews.sort((a, b) => b.helpful - a.helpful)
      });
      this.setState({
        filteredReviews: this.state.filteredReviews.sort(
          (a, b) => b.helpful - a.helpful
        )
      });
    }
    if (this.state.sortBy === "highest") {
      this.setState({
        reviews: this.state.reviews.sort((a, b) => b.eggs - a.eggs)
      });
      this.setState({
        filteredReviews: this.state.filteredReviews.sort(
          (a, b) => b.eggs - a.eggs
        )
      });
    }
    if (this.state.sortBy === "lowest") {
      this.setState({
        reviews: this.state.reviews.sort((a, b) => a.eggs - b.eggs)
      });
      this.setState({
        filteredReviews: this.state.filteredReviews.sort(
          (a, b) => a.eggs - b.eggs
        )
      });
    }
    // } else {
    //     if (this.state.sortBy === 'date') {
    //         this.setState({filteredReviews: this.state.filteredReviews.sort((a, b) => (new Date(b.date) - new Date(a.date)))});
    //     }
    //     if (this.state.sortBy === 'helpful') {
    //         this.setState({filteredReviews: this.state.filteredReviews.sort((a, b) => (b.helpful - a.helpful))});
    //     }
    //     if (this.state.sortBy === 'highest') {
    //         this.setState({filteredReviews: this.state.filteredReviews.sort((a, b) => (b.eggs - a.eggs))})
    //     }
    //     if (this.state.sortBy === 'lowest') {
    //         this.setState({filteredReviews: this.state.filteredReviews.sort((a, b) => (a.eggs - b.eggs))})
    //     }
    // }
  }

  changeView(newView) {
    this.setState({ view: newView });
  }

  renderView() {
    let { view } = this.state;
    let { reviews } = this.state;
    if (view === "reviews") {
      return (
        <React.Fragment>
          <Overview
            sortBy={this.setSort}
            handleFilter={this.filterReviews}
            reviews={this.state.reviews}
            filters={this.state.filters}
          />
          <Reviews
            voteHelpful={this.voteHelpful}
            voteNotHelpful={this.voteNotHelpful}
            reviewsVotedOn={this.state.reviewsVotedOn}
            reviews={
              this.state.filters.length === 0
                ? this.state.reviews
                : this.state.filteredReviews
            }
          />
        </React.Fragment>
      );
    } else {
      return <Blank />;
    }
  }

  render() {
    return (
      <div className="reviewApp">
        <div className="navbar">
          <span
            className={
              this.state.view === "overview" ? "nav_selected" : "nav_unselected"
            }
            onClick={() => this.changeView("overview")}
            id="overview"
          >
            <span className="nav_title">Overview</span>
          </span>
          <span
            className={
              this.state.view === "specs" ? "nav_selected" : "nav_unselected"
            }
            onClick={() => this.changeView("specs")}
            id="specs"
          >
            <span className="nav_title">Specifications</span>
          </span>
          <span
            className={
              this.state.view === "warranty" ? "nav_selected" : "nav_unselected"
            }
            onClick={() => this.changeView("warranty")}
            id="warranty"
          >
            <span className="nav_title">Warranty & Returns</span>
          </span>
          <span
            className={
              this.state.view === "reviews" ? "nav_selected" : "nav_unselected"
            }
            onClick={() => this.changeView("reviews")}
            id="reviews"
          >
            <span className="nav_title">Reviews</span>
          </span>
          <span
            className={
              this.state.view === "questions"
                ? "nav_selected"
                : "nav_unselected"
            }
            onClick={() => this.changeView("questions")}
            id="questions"
          >
            <span className="nav_title">Q&A</span>
          </span>
        </div>
        <div className="main">{this.renderView()}</div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("reviewApp"));
