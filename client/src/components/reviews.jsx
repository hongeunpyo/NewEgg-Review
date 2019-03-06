import React from 'react';
import $ from 'jquery';

class Reviews extends React.Component {
    constructor(props) {
        super(props)
        this.dateFormatter = this.dateFormatter.bind(this);
    }

    dateFormatter(date) {
        let year = date.slice(0, 4);
        let month = date.slice(5, 7);
        let day = date.slice(8, 10);
        let hour = date.slice(11, 13);
        if (month.startsWith('0')) {
            month = month.slice(1);
        }
        if (day.startsWith('0')) {
            day = day.slice(1);
        }
        let formattedHour = '';
        let amPm = '';
        if (hour.startsWith('0')) {
            formattedHour = hour.slice(1)
        } else if (hour === '13' ) {
            formattedHour = '1'
        } else if (hour === '14' ) {
            formattedHour = '2'
        } else if (hour === '15' ) {
            formattedHour = '3'
        } else if (hour === '16' ) {
            formattedHour = '4'
        } else if (hour === '17' ) {
            formattedHour = '5'
        } else if (hour === '18' ) {
            formattedHour = '6'
        } else if (hour === '19' ) {
            formattedHour = '7'
        } else if (hour === '20' ) {
            formattedHour = '8'
        } else if (hour === '21' ) {
            formattedHour = '9'
        } else if (hour === '22' ) {
            formattedHour = '10'
        } else if (hour === '23' ) {
            formattedHour = '11'
        } else {
            formattedHour = hour;
        };
        let minSec = date.slice(14, 19); 
        if (hour.startsWith('0')) {
            amPm = 'AM'
        } else if (hour.startsWith('10')) {
            amPm = 'AM'
        } else if (hour.startsWith('11')) {
            amPm = 'AM'
        } else {
            amPm = 'PM'
        }
        let dateString = `${month}/${day}/${year} ${formattedHour}:${minSec} ${amPm}`;
        return dateString;
    }

    render() {
        return (
            <div className="reviews">
            {this.props.reviews.map((review) => {
                return (
                    <div className="reviewItem" key={review.id}>
                        <div className="review">
                            <div className="sidebar">
                                <div className="author">{review.author}</div>
                                <div className={review.verified === 'T'
                        ? 'verified'
                        : 'unverified'}>
                        {review.verified === 'T'
                        // hardcoded: no length of ownership information in database
                        ? 'Ownership: 1 month to 1 year'
                        : ''}
                        <br />
                        <br />
                        {review.verified === 'T'
                        ? 'Verified Owner'
                        : ''}
                        </div>
                            </div>
                            <div className="reviewBody">
                                <div className="reviewHead">
                                    <span className="rating" style={{background: `url(//localhost:3009/assets/spr_${review.eggs}.png) no-repeat`}}></span>
                                    <span className="reviewTitle">{review.title}</span>
                                    <span className="reviewDate">{this.dateFormatter(review.date)}</span>
                                </div>
                                <div className="reviewContent">
                                    <span className="pros"><strong>Pros:</strong> {review.pros}</span>
                                    <br/>
                                    <span className="cons"><strong>Cons:</strong> {review.cons}</span>
                                    <br/>
                                    <span className="reviewBody"><strong>Other thoughts:</strong> {review.body}</span>
                                </div>
                                <div className="poll">
                                {this.props.reviewsVotedOn.indexOf(JSON.stringify(review.id)) === -1
                                ?  (
                                    <span className="rate">{review.helpful} people out of {review.helpful + review.not_helpful} found this review helpful. Did you?
                                    <button className="yes" onClick={(e) => this.props.voteHelpful(e.target)} id={review.review_id}>Yes</button>
                                    <button className="no" onClick={(e) => this.props.voteNotHelpful(e.target)} id={review.review_id}>No</button>
                                    </span>
                                )
                                :  (
                                <span className="voted">Thanks for voting! {review.helpful} people out of {review.helpful + review.not_helpful} found this review helpful.
                                   </span>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
            </div>
        )
    }
}

export default Reviews