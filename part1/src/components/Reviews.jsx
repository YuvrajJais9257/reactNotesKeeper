import React from 'react';

const Reviews = ({ reviews }) => {
  // Convert string values to numbers if necessary
  const good = Number(reviews.good);
  const neutral = Number(reviews.neutral);
  const bad = Number(reviews.bad);

  const average = Math.floor((good + neutral + bad) / 3);
  const positive = good + neutral;

  return (
    <div>
      <h1>Reviews</h1>
      <h3>Good: {good}</h3>
      <h3>Neutral: {neutral}</h3>
      <h3>Bad: {bad}</h3>
      <h1>Average</h1>
      <h3>{average}</h3>
      <h1>Positive</h1>
      <h3>{positive}</h3>
    </div>
  );
};

export default Reviews;
