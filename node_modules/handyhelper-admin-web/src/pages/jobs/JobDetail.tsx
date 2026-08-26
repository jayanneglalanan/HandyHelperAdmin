import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Clock } from 'lucide-react';
import { Card, CardTitle, StatusBadge, Badge, Button, PageSkeleton } from '../../components/ui';
import { useJobs } from '../../hooks/useMockData';
import { useLoading } from '../../hooks/useLoading';
import { formatDate, formatCurrency } from '@shared/utils/formatters';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loading = useLoading(800);
  const jobs = useJobs();
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Job not found</p>
        <Button onClick={() => navigate('/jobs')} className="mt-4">Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 min-h-[40px]"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </button>

      {loading ? (
        <PageSkeleton type="detail" />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                  {job.urgent && <Badge variant="error">Urgent</Badge>}
                </div>
                <StatusBadge status={job.status} />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(job.budget)}</span>
            </div>

            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{job.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posted {formatDate(job.postedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{job.preferredSchedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{job.category}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {job.assignedMemberId && (
            <Card>
              <CardTitle>Assigned Member</CardTitle>
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center shrink-0">
                    <User size={20} className="text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{job.assignedMemberName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Accepted: {job.acceptedDate ? formatDate(job.acceptedDate) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <CardTitle>Job Timeline</CardTitle>
            <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {[
                { label: 'Job Posted', date: job.postedDate, done: true },
                { label: 'Member Accepted', date: job.acceptedDate, done: !!job.acceptedDate },
                { label: 'Job Completed', date: job.completedDate, done: !!job.completedDate },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${step.done ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${step.done ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}`}>{step.label}</p>
                    {step.date && <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(step.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardTitle>Client Information</CardTitle>
            <div className="mt-3 sm:mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center shrink-0">
                  <User size={20} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{job.clientName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Client</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Job Details</CardTitle>
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Job ID</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs">{job.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Category</span>
                <span className="text-gray-900 dark:text-white">{job.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Budget</span>
                <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(job.budget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <StatusBadge status={job.status} />
              </div>
            </div>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}
