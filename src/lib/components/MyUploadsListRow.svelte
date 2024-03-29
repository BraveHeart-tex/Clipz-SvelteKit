<script lang="ts">
  import type { Video } from '@prisma/client';
  import UploadStatusBadge from './UploadStatusBadge.svelte';
  import UploadActions from './UploadActions.svelte';
  import type { PopupAction } from '$lib/types';
  import {
    Modal,
    getModalStore,
    getToastStore,
    type ModalSettings
  } from '@skeletonlabs/skeleton';
  import { handleDeleteVideoClick } from '$lib';
  import { goto } from '$app/navigation';

  export let upload: Video;
  export let editMode: boolean;
  export let checked: boolean;
  export let onCheckboxChange: (checked: boolean, upload: Video) => void;

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  const getPopupActions = (upload: Video) => {
    const commonActions: PopupAction[] = [
      {
        label: 'Delete',
        onClick: (event, upload) => {
          handleDeleteVideoClick({ modalStore, toastStore, upload });
        },
        icon: 'fa-solid fa-trash'
      }
    ];

    let actions: PopupAction[] = [];

    if (upload.status === 'PUBLISHED') {
      actions = [
        ...commonActions,
        {
          label: 'Edit',
          onClick: (event, uplaod) => {
            goto(`/upload?videoId=${upload.id}`);
          },
          icon: 'fa-solid fa-edit'
        },
        {
          label: 'View',
          onClick: () => console.log('View'),
          icon: 'fa-solid fa-eye'
        },
        {
          label: 'Share',
          onClick: () => console.log('Share'),
          icon: 'fa-solid fa-share'
        }
      ];
    }

    if (upload.status === 'REJECTED') {
      actions = [
        ...commonActions,
        {
          label: 'Rejection Reason',
          onClick: () => {
            const rejectionReasonModal: ModalSettings = {
              type: 'confirm',
              title: 'Rejection Reason',
              body: `<div class='flex flex-col gap-2'><p>Your video request was rejected because: </p> <span>${upload?.rejection_reason}</span>
              <p>Would you like to delete it?</p>
                </div>`,
              buttonTextConfirm: 'Delete',
              response(r) {
                if (r) {
                  handleDeleteVideoClick({ modalStore, toastStore, upload });
                }
              }
            };
            modalStore.trigger(rejectionReasonModal);
          },
          icon: 'fa-solid fa-eye'
        }
      ];
    }

    if (upload.status === 'PENDING_REVIEW') {
      actions = commonActions;
    }

    return actions;
  };

  $: actions = getPopupActions(upload);
</script>

<div class="border-b border-b-gray-400/50 flex justify-between py-4 px-2">
  <div class="flex items-center gap-2">
    {#if editMode}
      <input
        type="checkbox"
        class="w-4 h-4 checkbox"
        {checked}
        on:change={(e) => {
          // @ts-ignore
          onCheckboxChange(e.target.checked, upload);
        }}
      />
    {/if}
    <span class="flex-auto">
      <dt class="text-lg font-semibold">{upload.title}</dt>
      <dd class="text-gray-500 dark:text-gray-300">
        {upload.description}
      </dd>
    </span>
  </div>
  <div class="flex items-center gap-2">
    <span class="badge">
      <UploadStatusBadge status={upload.status} />
    </span>
    <UploadActions {upload} {actions} />
  </div>
</div>
