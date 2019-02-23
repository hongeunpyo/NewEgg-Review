import React from 'react';
import $ from 'jquery';

class Reviews extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="reviewMain">
                <div className="reviewOverview">
                <h2 className="sectionTitle"> Customer Reviews of This Item</h2>
                    <div className="ratingView">
                        <div className="ratingName">5 egg</div>
                        <div className="ratingChart">
                            <div className="ratingChart_current"></div>
                            <div className="ratingNumber">{this.props.reviews.filter((review) => {
                                return review.eggs === 5
                            }).length}
                            </div>
                        </div>
                        <div className="ratingPercent"> {this.props.reviews.filter((review) => {
                            return review.eggs === 5
                        }).length / this.props.reviews.length * 100}%
                        </div>
                    </div>
                    <div className="ratingView">
                        <div className="ratingName">4 egg</div>
                        <div className="ratingChart">
                            <div className="ratingChart_current"></div>
                            <div className="ratingNumber">{this.props.reviews.filter((review) => {
                                return review.eggs === 4
                            }).length}
                            </div>
                        </div>
                        <div className="ratingPercent"> {this.props.reviews.filter((review) => {
                            return review.eggs === 4
                        }).length / this.props.reviews.length * 100}%
                        </div>
                    </div>
                    <div className="ratingView">
                        <div className="ratingName">3 egg</div>
                        <div className="ratingChart">
                            <div className="ratingChart_current"></div>
                            <div className="ratingNumber">{this.props.reviews.filter((review) => {
                                return review.eggs === 3
                            }).length}
                            </div>
                        </div>
                        <div className="ratingPercent"> {this.props.reviews.filter((review) => {
                            return review.eggs === 3
                        }).length / this.props.reviews.length * 100}%
                        </div>
                    </div>
                    <div className="ratingView">
                        <div className="ratingName">2 egg</div>
                        <div className="ratingChart">
                            <div className="ratingChart_current"></div>
                            <div className="ratingNumber">{this.props.reviews.filter((review) => {
                                return review.eggs === 2
                            }).length}
                            </div>
                        </div>
                        <div className="ratingPercent"> {this.props.reviews.filter((review) => {
                            return review.eggs === 2
                        }).length / this.props.reviews.length * 100}%
                        </div>
                    </div>
                    <div className="ratingView">
                        <div className="ratingName">1 egg</div>
                        <div className="ratingChart">
                            <div className="ratingChart_current"></div>
                            <div className="ratingNumber">{this.props.reviews.filter((review) => {
                                return review.eggs === 1
                            }).length}
                            </div>
                        </div>
                        <div className="ratingPercent"> {this.props.reviews.filter((review) => {
                            return review.eggs === 1
                        }).length / this.props.reviews.length * 100}%
                        </div>
                    </div>
                    <div className="reviews">
                    {this.props.reviews.map((review) => {
                        return (
                            <div className="reviewItem" key={review.id}>
                                <div className="review">
                                    <section className="reviewDetails">
                                    <div className="sidebar">
                                        <div className="author">{review.author}</div>
                                    </div>
                                    <div className="reviewBody">
                                        <div className="reviewHead">
                                            <span className="rating">Rating: {review.eggs}</span>
                                            <span className="reviewTitle">{review.title}</span>
                                            <span className="reviewDate">{review.date}</span>
                                        </div>
                                        <div className="reviewContent">
                                            <span className="pros"><strong>Pros:</strong> {review.pros}</span>
                                            <br/>
                                            <span className="cons"><strong>Cons:</strong> {review.cons}</span>
                                            <br/>
                                            <span className="reviewBody"><strong>Other thoughts:</strong> {review.body}</span>
                                        </div>
                                    </div>
                                        <div className="poll">
                                            <span className="rate">{review.helpful} people out of {review.helpful + review.not_helpful} found this review helpful. Did you?
                                            <button className="yes" onClick={(e) => this.props.voteHelpful(e.target)} id={review.id}>Yes</button><button className="no" onClick={(e) => this.props.voteNotHelpful(e.target)} id={review.id}>No</button>
                                            </span>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </div>
            </div>
        )
    }
}

export default Reviews