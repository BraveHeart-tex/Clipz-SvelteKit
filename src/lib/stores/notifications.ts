import type { Notification } from '@prisma/client';
import { writable } from 'svelte/store';

export function createNotificationsStore(initialData: Notification[]) {
  const store = writable<{
    notifications: Notification[];
  }>({
    notifications: initialData
  });

  return {
    ...store
  };
}

export const notificationsStore = createNotificationsStore([
  {
    id: '1',
    user_id: 'user_1',
    title: 'New Message',
    description: 'You have a new message.',
    created_at: new Date('2024-01-20T12:30:45Z'),
    is_read: false
  },
  {
    id: '2',
    user_id: 'user_2',
    title: 'Friend Request',
    description: 'You have a new friend request.',
    created_at: new Date('2024-01-20T13:45:20Z'),
    is_read: false
  },
  {
    id: '3',
    user_id: 'user_3',
    title: 'Event Reminder',
    description: "Don't forget about the upcoming event tomorrow.",
    created_at: new Date('2024-01-21T08:00:00Z'),
    is_read: false
  },
  {
    id: '4',
    user_id: 'user_4',
    title: 'Event Reminder',
    description: "Don't forget about the upcoming event tomorrow.",
    created_at: new Date('2024-01-21T08:00:00Z'),
    is_read: false
  }
]);
