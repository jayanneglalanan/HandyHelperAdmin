import { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, SearchBar, Badge, PageSkeleton } from '../../components/ui';
import { useReviews } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { formatDate } from '@shared/utils/formatters';

export default function Reviews() {
  const loading = useLoading(800);
  const reviews = useReviews();
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);

  const filtered = reviews.filter(r => {
    const matchesSearch = r.reviewerName.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewedMemberName.toLowerCase().includes(search.toLowerCase());
    const matchesRating = ratingFilter === 0 || r.rating === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
      ))}
    </div>
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Reviews</h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">{filtered.length} reviews</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search reviews..." className="flex-1 sm:flex-none sm:w-48" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 min-h-[40px]"
          >
            <option value={0}>All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <PageSkeleton type="list" />
      ) : (
      <div className="space-y-3">
        {filtered.map((review) => (
          <Card key={review.id}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {review.reviewerName} → {review.reviewedMemberName}
                  </h3>
                  <Badge>{review.jobTitle}</Badge>
                </div>
                <div className="mt-1">{renderStars(review.rating)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{review.comment}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">{formatDate(review.date)}</span>
                  <Badge variant={review.status === 'visible' ? 'success' : 'error'}>{review.status}</Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
