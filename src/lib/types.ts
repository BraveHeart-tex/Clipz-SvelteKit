import type { Video } from '@prisma/client';
import type { ActionResult } from '@sveltejs/kit';
import firebase from 'firebase/compat/app';

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

export interface Event {
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
