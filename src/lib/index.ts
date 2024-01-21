import type { DocumentSnapshot } from 'firebase/firestore';
import { type ClassValue, clsx } from 'clsx';
import { ZodEffects, ZodObject } from 'zod';
import { twMerge } from 'tailwind-merge';
import type {
  ModalSettings,
  ModalStore,
  ToastSettings,
  ToastStore
} from '@skeletonlabs/skeleton';
import type { Video } from '@prisma/client';
import { invalidate } from '$app/navigation';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from './firebase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = (callback: () => void, delay = 500) => {
  let timer: NodeJS.Timeout | null = null;
  clearTimeout(timer!);
  timer = setTimeout(() => {
    callback();
  }, delay);
};

export function clickOutside(node: HTMLElement, visible: boolean) {
  window.addEventListener('click', handleClick);

  function handleClick(e: Event) {
    const triggerButton = document.getElementById(
      'notification-popover-trigger'
    );
    if (
      !node.contains(e.target as Node) &&
      visible &&
      !triggerButton?.contains(e.target as Node)
    ) {
      node.dispatchEvent(new CustomEvent('clickOutside'));
    }
  }

  return {
    destroy() {
      window.removeEventListener('click', handleClick);
    }
  };
}

export function longpress(node: HTMLElement, threshold = 350) {
  const handlePressStart = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    const timeout = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longpress'));
    }, threshold);

    const cancel = () => {
      clearTimeout(timeout);
      node.removeEventListener('mousemove', cancel);
      node.removeEventListener('mouseup', cancel);
      node.removeEventListener('touchmove', cancel);
      node.removeEventListener('touchend', cancel);
    };

    node.addEventListener('mousemove', cancel);
    node.addEventListener('mouseup', cancel);
    node.addEventListener('touchmove', cancel);
    node.addEventListener('touchend', cancel);
  };

  node.addEventListener('mousedown', handlePressStart);
  node.addEventListener('touchstart', handlePressStart);

  return {
    destroy() {
      node.removeEventListener('mousedown', handlePressStart);
      node.removeEventListener('touchstart', handlePressStart);
    }
  };
}

export const generateReadbleEnum = ({
  key,
  separator = '_'
}: {
  key: string;
  separator?: string;
}) => {
  let label = key.replace(separator, ' ');

  if (label.split(' ').length > 1) {
    const words = label.split(' ');
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    label = capitalizedWords.join(' ');
  } else {
    label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  }

  return label;
};

export const generateReadbleEnumLabels = ({
  enumObj,
  separator = '_'
}: {
  enumObj: Record<string, string>;
  separator?: string;
}) => {
  const keys = Object.keys(enumObj);

  const readableLabels = keys.map((key) => {
    const label = generateReadbleEnum({ key, separator });
    return {
      label,
      value: key
    };
  });

  return readableLabels;
};

export const mapDocumentWithId = (doc: DocumentSnapshot) => ({
  id: doc.id,
  ...doc.data()
});

export const generateVideoThumbnail = (file: File) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const video = document.createElement('video');

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL('image/png'));
    };
  });
};

export function generateFormFields(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodObject<any> | ZodEffects<ZodObject<any>>
) {
  const formFields = [];
  let schemaShape;

  if (schema instanceof ZodEffects) {
    schemaShape = schema._def.schema.shape;
  } else {
    schemaShape = schema.shape;
  }

  for (const key of Object.keys(schemaShape)) {
    const fieldSchema = schemaShape[key];

    const description = fieldSchema._def.description;

    const parsedDescription = description
      .split(',')
      .map((item: string) => item.trim());

    const fieldType = parsedDescription
      .find((item: string) => item.startsWith('type:'))
      .split(':')[1]
      .trim();

    const fieldLabel = parsedDescription
      .find((item: string) => item.startsWith('label:'))
      .split(':')[1]
      .trim();

    const fieldObject: {
      name: string;
      type: string;
      label: string;
      options?: string[];
    } = {
      name: key,
      type: fieldType,
      label: fieldLabel
    };

    if (fieldType === 'combobox') {
      const fieldOptions = parsedDescription
        .find((item: string) => item.startsWith('options:'))
        .split(':')[1]
        .trim()
        .split('-');

      fieldObject['options'] = fieldOptions;
    }

    formFields.push(fieldObject);
  }

  return formFields;
}

export const acceptedFileTypes = [
  'video/mp4',
  'video/x-m4v',
  'video/*',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-flv',
  'video/webm',
  'video/x-matroska',
  'video/mpeg'
];

export const handleDeleteVideoClick = ({
  modalStore,
  toastStore,
  upload
}: {
  modalStore: ModalStore;
  toastStore: ToastStore;
  upload: Video;
}) => {
  const modal: ModalSettings = {
    type: 'confirm',
    title: 'Delete video?',
    body: 'Are you sure you want to delete this video? This action cannot be undone.',
    buttonTextCancel: 'Cancel',
    buttonTextConfirm: 'Yes, delete this video',
    async response(r) {
      if (r) {
        try {
          await fetch(`/api/videos/${upload.id}`, {
            method: 'DELETE'
          });
          invalidate('app:myVideos');
          const successToast: ToastSettings = {
            message: 'Your video was deleted successfully.',
            background: 'variant-filled-success',
            timeout: 5000
          };

          toastStore.trigger(successToast);
        } catch (error) {
          const errorToast: ToastSettings = {
            message:
              'There was an error deleting your video. Please try again later.',
            background: 'variant-filled-error',
            timeout: 5000
          };
          toastStore.trigger(errorToast);
        }
      }
    }
  };

  modalStore.trigger(modal);
};

export async function deleteVideoFromFirebaseStorage({
  video,
  deleteThumbnail = true
}: {
  video: Video;
  deleteThumbnail?: boolean;
}) {
  console.log(video);

  try {
    const videoStorageRef = ref(
      storage,
      '/videos/' + getFirebaseStoragePath(video.url)
    );

    const thumbnailStorageRef = ref(
      storage,
      '/thumbnails/' + getFirebaseStoragePath(video.poster_url!)
    );

    await deleteObject(videoStorageRef);

    if (deleteThumbnail) {
      await deleteObject(thumbnailStorageRef);
    }
  } catch (error) {
    console.error(error);
    return {
      error
    };
  }
}

export const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

function getFirebaseStoragePath(url: string) {
  try {
    if (!url) return;
    const regex = RegExp(/%2F(.*?)\?alt/);
    const match = regex.exec(url);
    if (match) {
      const path = match[1];
      return path;
    }
  } catch (error) {
    console.error(error);
    return;
  }
}
