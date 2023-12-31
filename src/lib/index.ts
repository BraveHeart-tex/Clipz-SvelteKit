import type { DocumentSnapshot } from 'firebase/firestore';
import { type ClassValue, clsx } from 'clsx';
import { ZodEffects, ZodObject } from 'zod';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

const lazyLoadOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0
};

export const lazyLoad = (image: HTMLImageElement, src: string) => {
  const loaded = () => {
    image.style.opacity = '1';
  };
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      image.src = src;
      if (image.complete) {
        loaded();
      } else {
        image.addEventListener('load', loaded);
      }
    }
  }, lazyLoadOptions);
  observer.observe(image); // intersection observer

  return {
    destroy() {
      image.removeEventListener('load', loaded); // clean up the event listener
    }
  };
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
