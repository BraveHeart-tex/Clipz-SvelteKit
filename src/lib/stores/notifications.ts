import type { Notification } from '@prisma/client';
import { writable } from 'svelte/store';

export function createNotificationsStore(initialData: Notification[]) {
  const store = writable<{
    notifications: Notification[];
    unreadNotifications: Notification[];
  }>({
    notifications: initialData,
    unreadNotifications: initialData.filter(
      (notification) => !notification.read_date
    )
  });

  function markAsRead(id: string) {
    store.update((state) => {
      const notification = state.notifications.find(
        (notification) => notification.id === id
      );

      if (notification) {
        notification.read_date = new Date();
      }

      return {
        ...state,
        notifications: state.notifications.map((notification) => {
          if (notification.id === id) {
            notification.read_date = new Date();
          }

          return notification;
        }),
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
        notification.read_date = new Date();
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
