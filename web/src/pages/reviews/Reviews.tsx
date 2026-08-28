import { useState } from 'react';
import { Star, EyeOff, Flag } from 'lucide-react';
import { Card, SearchBar, Dropdown, Badge, PageSkeleton } from '../../components/ui';
import { useReviews } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '@shared/utils/formatters';

export default function Reviews() {
  const loading = useLoading(800);
  const reviews = useReviews();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('0');

  const filtered = reviews.filter(r => {
    const matchesSearch = r.reviewerName.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewedMemberName.toLowerCase().includes(search.toLowerCase());
    const matchesRating = ratingFilter === '0' || r.rating === Number(ratingFilter);
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
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search reviews..." className="flex-1 sm:flex-none sm:w-48" />
          <Dropdown value={ratingFilter} onChange={setRatingFilter} options={[
            { value: '0', label: 'All Ratings' },
            { value: '5', label: '5 Stars' },
            { value: '4', label: '4 Stars' },
            { value: '3', label: '3 Stars' },
            { value: '2', label: '2 Stars' },
            { value: '1', label: '1 Star' }
          ]} />
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
              <div className="flex gap-1 shrink-0">
                <button onClick={() => showToast(`Hiding review by ${review.reviewerName}`, 'info')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 min-w-[36px] min-h-[36px] flex items-center justify-center"><EyeOff size={14} /></button>
                <button onClick={() => showToast(`Flagging review by ${review.reviewerName}`, 'info')} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg dark:hover:bg-amber-900/20 min-w-[36px] min-h-[36px] flex items-center justify-center"><Flag size={14} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
