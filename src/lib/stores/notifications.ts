import type { Notification } from '@prisma/client';
import { writable } from 'svelte/store';

export function createNotificationsStore(initialData: Notification[]) {
  const store = writable<{
    notifications: Notification[];
    unreadNotifications: Notification[];
  }>({
    notifications: initialData,
    unreadNotifications: initialData.filter(
      (notification) => !notification.is_read
    )
  });

  function markAsRead(id: string) {
    store.update((state) => {
      const notification = state.notifications.find(
        (notification) => notification.id === id
      );

      if (notification) {
        notification.is_read = true;
      }

      return {
        ...state,
        unreadNotifications: state.unreadNotifications.filter(
          (notification) => notification.id !== id
        )
      };
    });
  }

  function addNotification(notification: Notification) {
    store.update((state) => {
      return {
        ...state,
        notifications: [...state.notifications, notification],
        unreadNotifications: [...state.unreadNotifications, notification]
      };
    });
  }

  function markAllAsRead() {
    store.update((state) => {
      state.notifications.forEach((notification) => {
        notification.is_read = true;
      });

      return {
        ...state,
        unreadNotifications: []
      };
    });
  }

  return {
    ...store,
    markAsRead,
    addNotification,
    markAllAsRead
  };
}

export const notificationsStore = createNotificationsStore([]);
