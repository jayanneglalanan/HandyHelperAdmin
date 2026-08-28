import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Star } from 'lucide-react';
import { Card, CardTitle, StatusBadge, Avatar, Badge, Button, PageSkeleton } from '../../components/ui';
import { useUsers, useJobs, useReviews } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '@shared/utils/formatters';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loading = useLoading(800);
  const users = useUsers();
  const jobs = useJobs();
  const reviews = useReviews();
  const { showToast } = useToast();
  const [userStatus, setUserStatus] = useState<string | null>(null);

  const user = users.find(u => u.id === id);
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
        <Button onClick={() => navigate('/users')} className="mt-4">Back to Users</Button>
      </div>
    );
  }

  const effectiveStatus = userStatus || user.status;
  const userJobs = jobs.filter(j => j.clientId === id || j.assignedMemberId === id);
  const userReviews = reviews.filter(r => r.reviewedMemberId === id);

  return (
    <div className="space-y-3 sm:space-y-6">
      <button onClick={() => navigate('/users')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 min-h-[40px]">
        <ArrowLeft size={16} />
        Back to Users
      </button>

      {loading ? (
        <PageSkeleton type="detail" />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-1">
          <div className="text-center">
            <Avatar initials={`${user.firstName[0]}${user.lastName[0]}`} size="lg" className="mx-auto" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-3 sm:mt-4">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
            <div className="mt-2"><StatusBadge status={effectiveStatus} /></div>
          </div>

          <div className="mt-4 sm:mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-gray-400 shrink-0" /><span className="text-gray-600 dark:text-gray-400 truncate">{user.email}</span></div>
            <div className="flex items-center gap-3 text-sm"><Phone size={16} className="text-gray-400 shrink-0" /><span className="text-gray-600 dark:text-gray-400">{user.phone}</span></div>
            <div className="flex items-center gap-3 text-sm"><Calendar size={16} className="text-gray-400 shrink-0" /><span className="text-gray-600 dark:text-gray-400">Joined {formatDate(user.dateJoined)}</span></div>
          </div>

          {user.role === 'member' && 'skills' in user && user.skills && (
            <div className="mt-4 sm:mt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1.5">{user.skills.map((skill: string) => <Badge key={skill}>{skill}</Badge>)}</div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 flex gap-2">
            <Button variant="outline" fullWidth onClick={() => showToast(`Editing ${user.firstName}'s profile`, 'info')}>Edit</Button>
            {effectiveStatus === 'active' ? (
              <Button variant="danger" fullWidth onClick={() => { setUserStatus('suspended'); showToast(`${user.firstName} has been suspended`); }}>Suspend</Button>
            ) : (
              <Button variant="success" fullWidth onClick={() => { setUserStatus('active'); showToast(`${user.firstName} has been activated`); }}>Activate</Button>
            )}
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {user.role === 'member' && 'averageRating' in user && (
            <Card>
              <CardTitle>Statistics</CardTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{('jobsCompleted' in user ? user.jobsCompleted : 0) as number}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Jobs Done</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500 sm:w-4 sm:h-4" /><p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{('averageRating' in user ? user.averageRating : 0) as number}</p></div>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Rating</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{('totalReviews' in user ? user.totalReviews : 0) as number}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Reviews</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{('yearsExperience' in user ? user.yearsExperience : 0) as number}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Years Exp</p>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <CardTitle>Job History</CardTitle>
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {userJobs.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No jobs found</p>
              ) : (
                userJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="min-w-0 mr-2"><p className="text-sm font-medium text-gray-900 dark:text-white truncate">{job.title}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(job.postedDate)}</p></div>
                    <StatusBadge status={job.status} />
                  </div>
                ))
              )}
            </div>
          </Card>

          {userReviews.length > 0 && (
            <Card>
              <CardTitle>Reviews</CardTitle>
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                {userReviews.map(review => (
                  <div key={review.id} className="p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">{[1, 2, 3, 4, 5].map(star => <Star key={star} size={12} className={star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'} />)}</div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{review.reviewerName}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
