import React, { useState } from 'react';

export default function Reviews() {
    const [selectedFilter, setSelectedFilter] = useState('all-reviews');
    const [ratings, setRatings] = useState({});
    const [usefulness, setUsefulness] = useState({});
    const [reviews, setReviews] = useState([
        { id: 'main-review', title: 'Best Pc Ever', rating: 5, content: 'I have never seen a better pc, the rgb looks so great' }
    ]);
    const [newReview, setNewReview] = useState({ title: '', rating: 0, content: '' });
    const [showNewReviewForm, setShowNewReviewForm] = useState(false);
    
    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    const [hoverRating, setHoverRating] = useState({ reviewId: null, rating: 0 });

    const handleStarClick = (reviewId, rating) => {
        if (reviewId === 'new') {
            setNewReview(prev => ({ ...prev, rating }));
        } else {
            setRatings(prevRatings => ({
                ...prevRatings,
                [reviewId]: rating
            }));
        }
    };

    const handleStarHover = (reviewId, rating) => {
        setHoverRating({ reviewId, rating });
    };

    const handleStarLeave = () => {
        setHoverRating({ reviewId: null, rating: 0 });
    };

    const renderStars = (reviewId) => {
        const rating = reviewId === 'new' ? newReview.rating : (ratings[reviewId] || 0);
        const isHovering = hoverRating.reviewId === reviewId;
        const hoverRatingValue = hoverRating.rating;

        return [1, 2, 3, 4, 5].map((star) => (
            <i 
                key={star}
                className={`fa-solid fa-star star 
                    ${star <= rating ? 'activated' : ''}
                    ${isHovering && star <= hoverRatingValue ? 'current-hover' : ''}
                `}
                onClick={() => handleStarClick(reviewId, star)}
                onMouseEnter={() => handleStarHover(reviewId, star)}
                onMouseLeave={handleStarLeave}
            ></i>
        ));
    };

    const handleUsefulnessClick = (reviewId, value) => {
        setUsefulness(prevUsefulness => ({
            ...prevUsefulness,
            [reviewId]: prevUsefulness[reviewId] === value ? null : value
        }));
    };

    const renderUsefulness = (reviewId) => {
        const value = usefulness[reviewId];
        return (
            <div className='usefulness-rating'>
                <p>Was this review useful?</p>
                <button 
                    onClick={() => handleUsefulnessClick(reviewId, 'like')} 
                    className={`fa-solid fa-thumbs-up like-button ${value === 'like' ? 'activated' : ''}`}
                ></button>
                <button 
                    onClick={() => handleUsefulnessClick(reviewId, 'dislike')} 
                    className={`fa-solid fa-thumbs-down dislike-button ${value === 'dislike' ? 'activated' : ''}`}
                ></button>     
            </div>
        );
    };

    const handleSubmitReview = () => {
        if (newReview.title && newReview.rating && newReview.content) {
            setReviews(prev => [...prev, { ...newReview, id: `review-${Date.now()}` }]);
            setNewReview({ title: '', rating: 0, content: '' });
            setShowNewReviewForm(false);
        }
    };

    const toggleNewReviewForm = () => {
        setShowNewReviewForm(prev => !prev);
    };

    return (
        <main className="reviews-main">
            <section className='reviews-header'>
            <fieldset className="review-fieldset">
                <legend>Filter Reviews:</legend>
                <div className="filter-container">
                    {['all-reviews', 'Smoother', 'Beast', 'Terminator', 'spaceship'].map((filter) => (
                        <div key={filter} className={`review-filter ${filter}-filter`}>
                            <input 
                                type="radio" 
                                id={filter} 
                                name="pc" 
                                value={filter} 
                                className='input-review-filter'
                                checked={selectedFilter === filter}
                                onChange={handleFilterChange}
                            />
                            <label htmlFor={filter}>{filter === 'all-reviews' ? 'All Reviews' : filter}</label>
                        </div>
                    ))}
                </div>
            </fieldset>

            <button className='add-review' onClick={toggleNewReviewForm}>
                {showNewReviewForm ? '-' : '+'}
            </button>
            </section>

            {showNewReviewForm && (
                <div className="new-review-container">
                    <input
                        type="text"
                        placeholder="Review Title"
                        value={newReview.title}
                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <div className='rating-box'>
                        {renderStars('new')}
                    </div>
                    <textarea
                        placeholder="Write your review here..."
                        value={newReview.content}
                        onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                    />
                    <button onClick={handleSubmitReview} className="submit-review">Submit Review</button>
                </div>
            )}

            <div className='reviews-container'>
                {reviews.map((review) => (
                    <div key={review.id} className="review">
                        <div className='review-body'>
                            <h2 className='review-title'>{review.title}</h2>
                            <div className='rating-box'>
                                {renderStars(review.id)}
                            </div>
                            <p className='review-paragraph'>{review.content}</p>
                        </div>
                        {renderUsefulness(review.id)}
                    </div>
                ))}
            </div>
        </main>
    )
}

