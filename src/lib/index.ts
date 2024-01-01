import type { DocumentSnapshot } from 'firebase/firestore';
import { type ClassValue, clsx } from 'clsx';
import { ZodEffects, ZodObject } from 'zod';
import { twMerge } from 'tailwind-merge';

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

export const generateReadbleEnumLabels = ({
  enumObj,
  separator = '_'
}: {
  enumObj: Record<string, string>;
  separator?: string;
}) => {
  const keys = Object.keys(enumObj);

  const readableLabels = keys.map((key) => {
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

    return {
      label,
      value: key
    };
  });

  return readableLabels;
};

export const replaceStateWithQuery = (values: Record<string, string>) => {
  const url = new URL(window.location.toString());
  // eslint-disable-next-line prefer-const
  for (let [k, v] of Object.entries(values)) {
    if (v) {
      url.searchParams.set(encodeURIComponent(k), encodeURIComponent(v));
    } else {
      url.searchParams.delete(k);
    }
  }
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
