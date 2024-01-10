import { invalidate } from '$app/navigation';
import type { Video, VideoStatus } from '@prisma/client';
import type {
  ModalSettings,
  ModalStore,
  ToastSettings,
  ToastStore
} from '@skeletonlabs/skeleton';

export const handleAdminReviewAction = async ({
  row,
  action,
  status,
  successMessage,
  errorMessage,
  toastStore,
  modalStore
}: {
  row: Video;
  action: string;
  status: VideoStatus;
  successMessage: string;
  errorMessage: string;
  toastStore: ToastStore;
  modalStore: ModalStore;
}) => {
  const confirmationModal: ModalSettings = {
    type: 'confirm',
    title: `${action} Video Request`,
    body: `Are you sure you want to ${action.toLowerCase()} the video request titled "${
      row.title
    }"?`,
    buttonTextCancel: 'No',
    buttonTextConfirm: 'Yes',
    async response(r) {
      if (r) {
        try {
          await fetch(`/api/admin/requests/${row.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              status: status
            })
          });
          invalidate('app:admin');
          toastStore.trigger({
            message: successMessage,
            background: 'variant-filled-success',
            timeout: 4000
          });
        } catch (error) {
          console.error(error);
          const toast: ToastSettings = {
            message: errorMessage,
            background: 'variant-filled-error',
            timeout: 4000
          };
          toastStore.trigger(toast);
        }
      }
    }
  };

  modalStore.trigger(confirmationModal);
};
