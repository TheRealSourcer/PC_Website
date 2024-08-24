import React, { useState, useEffect } from 'react';
import useUserUUID from '../../hooks/useUserUUID'; // Import the custom hook

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ title: '', rating: 0, content: '', product: '' });
    const [selectedFilter, setSelectedFilter] = useState('all-reviews');
    const [showNewReviewForm, setShowNewReviewForm] = useState(false);
    const userUUID = useUserUUID(); // Get the unique user identifier

    // Fetch reviews from server
    useEffect(() => {
        const fetchReviews = async () => {
            const response = await fetch('http://localhost:3000/api/reviews');
            const data = await response.json();
            console.log('Fetched reviews:', data); // Add this line to debug
            setReviews(data);
        };
    
        fetchReviews();
    }, []);

    // Calculate the average rating
    const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageStars = reviews.length > 0 ? (totalStars / reviews.length).toFixed(1) : 0;

    // Handle form submission
    const handleSubmitReview = async () => {
        if (newReview.title && newReview.rating && newReview.content && newReview.product) {
            console.log('Submitting review:', newReview); // Debug log
    
            const response = await fetch('http://localhost:3000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReview)
            });
    
            const savedReview = await response.json();
            console.log('Saved review:', savedReview); // Debug log
            setReviews(prev => [...prev, savedReview]);
            setNewReview({ title: '', rating: 0, content: '', product: '' });
            setShowNewReviewForm(false);
        } else {
            console.error('Review submission failed. Missing fields.');
        }
    };

    // Handle usefulness button click
    const handleUsefulnessClick = async (reviewId, type) => {
        if (userUUID) {
            // Fetch current vote state
            const currentVote = reviews.find(review => review._id === reviewId)?.userVotes[userUUID];
            
            let newType = type;
    
            if (currentVote) {
                // If user has already voted, toggle between like and dislike
                if (currentVote === type) {
                    newType = 'remove'; // Remove the vote if it's the same as current vote
                } else {
                    // If different vote, update vote type
                    newType = type;
                }
            }
    
            const response = await fetch('http://localhost:3000/api/reviews/usefulness', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reviewId, userUUID, type: newType })
            });
    
            const updatedReview = await response.json();
            setReviews(prev => prev.map(review => review._id === updatedReview._id ? updatedReview : review));
        }
    };    

    // Render filtered reviews
    const filteredReviews = selectedFilter === 'all-reviews'
        ? reviews
        : reviews.filter(review => review.product === selectedFilter || (selectedFilter === 'website-reviews' && review.product === 'Website'));

    return (
        <main className="reviews-main">
            <section className='reviews-header'>
                <fieldset className="review-fieldset">
                    <legend>Filter Reviews:</legend>
                    <div className="filter-container">
                        {['all-reviews', 'Smoother', 'Beast', 'Terminator', 'Spaceship', 'website-reviews'].map((filter) => (
                            <div key={filter} className={`review-filter ${filter}-filter`}>
                                <input 
                                    type="radio" 
                                    id={filter} 
                                    name="pc" 
                                    value={filter} 
                                    className='input-review-filter'
                                    checked={selectedFilter === filter}
                                    onChange={() => setSelectedFilter(filter)}
                                />
                                <label htmlFor={filter}>{filter === 'all-reviews' ? 'All Reviews' : filter}</label>
                            </div>
                        ))}
                    </div>
                </fieldset>

                <button className='add-review' onClick={() => setShowNewReviewForm(!showNewReviewForm)}>
                    {showNewReviewForm ? '-' : '+'}
                </button>
            </section>

            {/* Display the average rating */}
            <section className="average-rating">
                <h2>Average Rating: {averageStars} Stars</h2>
            </section>

            {showNewReviewForm && (
                <div className="new-review-container">
                <input
                    type="text"
                    placeholder="Review Title"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                />
                <select 
                    value={newReview.product} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, product: e.target.value }))}
                >
                    <option value="">Select a product</option>
                    <option value="Smoother">Smoother</option>
                    <option value="Beast">Beast</option>
                    <option value="Terminator">Terminator</option>
                    <option value="Spaceship">Spaceship</option>
                    <option value="Website">Website</option>
                </select>
                <div className='rating-box'>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                            key={star}
                            className={`fa-solid fa-star star ${star <= newReview.rating ? 'activated' : ''}`}
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        ></i>
                    ))}
                </div>
                <textarea
                    placeholder="Write your review here..."
                    value={newReview.content} // Ensure 'content' is correctly bound
                    onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                />
                <button onClick={handleSubmitReview} className="submit-review">Submit Review</button>
            </div>
            )}

            <div className='reviews-container'>
    {filteredReviews.map((review) => (
        <div key={review._id} className="review">
            <div className='review-body'>
                <h2 className='review-title'>{review.title}</h2>
                <p>Product: {review.productName}</p> {/* Updated from 'product' to 'productName' */}
                <div className='rating-box'>
                    {[...Array(review.rating)].map((_, index) => (
                        <i key={index} className="fa-solid fa-star star activated"></i>
                    ))}
                </div>
                <p className='review-paragraph'>{review.content}</p> {/* Updated from 'comment' to 'content' */}
            </div>
            <div className='usefulness-rating'>
                <p>Was this review useful?</p>
                <button 
                    onClick={() => handleUsefulnessClick(review._id, 'like')} 
                    className={`fa-solid fa-thumbs-up like-button ${review.userVotes[userUUID] === 'like' ? 'activated' : ''}`}
                ></button>
                <span>{review.thumbsUp}</span>
                <button 
                    onClick={() => handleUsefulnessClick(review._id, 'dislike')} 
                    className={`fa-solid fa-thumbs-down dislike-button ${review.userVotes[userUUID] === 'dislike' ? 'activated' : ''}`}
                ></button>
                <span>{review.thumbsDown}</span>   
            </div>
        </div>
    ))}
</div>
        </main>
    );
}
