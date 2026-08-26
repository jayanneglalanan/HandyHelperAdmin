import usersData from '@shared/data/users.json';
import jobsData from '@shared/data/jobs.json';
import credentialsData from '@shared/data/credentials.json';
import categoriesData from '@shared/data/categories.json';
import subscriptionsData from '@shared/data/subscriptions.json';
import reviewsData from '@shared/data/reviews.json';
import reportsData from '@shared/data/reports.json';
import disputesData from '@shared/data/disputes.json';
import notificationsData from '@shared/data/notifications.json';
import analyticsData from '@shared/data/analytics.json';
import conversationsData from '@shared/data/conversations.json';
import contentData from '@shared/data/content.json';
import faqsData from '@shared/data/faqs.json';
import announcementsData from '@shared/data/announcements.json';
import auditLogsData from '@shared/data/auditLogs.json';

export function useUsers() {
  return usersData;
}

export function useJobs() {
  return jobsData;
}

export function useCredentials() {
  return credentialsData;
}

export function useCategories() {
  return categoriesData;
}

export function useSubscriptions() {
  return subscriptionsData;
}

export function useReviews() {
  return reviewsData;
}

export function useReports() {
  return reportsData;
}

export function useDisputes() {
  return disputesData;
}

export function useNotifications() {
  return notificationsData;
}

export function useAnalytics() {
  return analyticsData;
}

export function useConversations() {
  return conversationsData;
}

export function useContent() {
  return contentData;
}

export function useFaqs() {
  return faqsData;
}

export function useAnnouncements() {
  return announcementsData;
}

export function useAuditLogs() {
  return auditLogsData;
}
