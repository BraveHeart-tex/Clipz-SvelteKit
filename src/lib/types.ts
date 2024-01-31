import type { ActionResult } from '@sveltejs/kit';
import firebase from 'firebase/compat/app';
import type { SuperForm } from 'sveltekit-superforms/client';
import { type FirebaseStorage } from 'firebase/storage';
import type { ModalStore, ToastStore } from '@skeletonlabs/skeleton';
import { type Subscriber, type Writable } from 'svelte/store';
import type { Video } from '@prisma/client';
import type uploadVideoSchema from './schemas/UploadVideoSchema';

export interface IClip {
  id: string;
  docID?: string;
  uid: string;
  displayName: string;
  title: string;
  fileName: string;
  url: string;
  timestamp: firebase.firestore.Timestamp;
  screenshotURL: string;
  screenshotFileName: string;
}

export interface FormEvent {
  result: ActionResult;
  formEl: HTMLFormElement;
  cancel: () => void;
}

export interface SearchUploadsResponse {
  userUploads: Video[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPageCount: number;
}

export interface MyUploadsStore {
  data: Video[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPageCount: number;
  searchQuery: string;
  statusQuery: string;
}

export interface PopupAction {
  label: string;
  onClick: (
    event: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    },
    upload: Video
  ) => void;
  icon: string;
}

export interface UploadStore {
  videoSrc: string;
  poster: string;
  uploadedFile: File | null;
  progress: number;
  isSubmitting: boolean;
  submitCompleted: boolean;
  thumbnail: File | null;
  currentVideo: Video | null;
}

export interface IVideoFormHandlerParams {
  modalStore: ModalStore;
  toastStore: ToastStore;
  superFrm: SuperForm<typeof uploadVideoSchema>;
  storage: FirebaseStorage;
  currentVideo: Video | null;
}

export interface IVideoFormHandler {
  modalStore: ModalStore;
  toastStore: ToastStore;
  storage: FirebaseStorage;
  uploadStore: Writable<UploadStore>;
  superFrm: SuperForm<typeof uploadVideoSchema>;
  handleRemoveThumbnail: () => void;
  handleCancelUploadClick: () => void;
  handleVideoChange: (event: Event) => void;
  handleThumbnailChange: (event: Event) => void;
  handleUploadSubmit: (event: Event) => void;
  handleSubmitCompletion: () => void;
  resetForm: () => void;
  subscribe: (run: Subscriber<UploadStore>) => () => void;
  handleUploadError: (error: Error) => void;
  sendDataToServer: (formData: FormData) => Promise<void>;
}
