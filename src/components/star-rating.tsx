import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';

const MAX_RATING = 5; // Maximum number of stars in the rating component
const MIN_RATING = 0; // Minimum allowable rating (used to clamp invalid values)

// StarRatingProps - Props for displaying a star-based rating UI
interface StarRatingProps {
  rating: number; // The numerical rating to display (e.g., 3 out of 5)
  classname?: string; // Optional additional classes for the wrapper container
  iconClassName?: string; // Optional classes for individual star icons
  text?: string; // Optional text label to show next to the stars
}

// StarRating - Renders a visual star rating with optional label text
export const StarRating = ({
  rating,
  classname,
  iconClassName,
  text,
}: StarRatingProps) => {
  // Clamp the rating value between MIN_RATING and MAX_RATING
  const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));

  return (
    <div className={cn('flex items-center gap-x-1', classname)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn(
            'size-4',
            index < safeRating ? 'fill-black' : '', // Fill stars up to the safeRating value
            iconClassName
          )}
        />
      ))}
      {/* Display optional label text if provided */}
      {text && <p>{text}</p>}
    </div>
  );
};
