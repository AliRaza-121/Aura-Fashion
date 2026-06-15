import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating = 0, reviewCount = 0, showCount = true, size = 14 }) {
  // If there are no reviews, force rating to 0 so all stars are empty
  const displayRating = reviewCount === 0 ? 0 : rating;

  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center text-gray-300">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="fill-gray-200 text-gray-200" />
      ))}
      {showCount && (
        <span className="text-xs text-gray-500 ml-2">({reviewCount} reviews)</span>
      )}
    </div>
  );
}
