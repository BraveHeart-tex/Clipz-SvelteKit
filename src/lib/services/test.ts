import { videoService } from './video-service';
import uploadVideoSchema from '../schemas/UploadVideoSchema';
import type { SuperForm } from 'sveltekit-superforms/client';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type FirebaseStorage
} from 'firebase/storage';
import type {
  ModalSettings,
  ModalStore,
  ToastSettings,
  ToastStore
} from '@skeletonlabs/skeleton';
import { writable, type Subscriber, type Writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { acceptedFileTypes } from '..';
import { storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

interface UploadStore {
  videoSrc: string;
  poster: string;
  uploadedFile: File | null;
  progress: number;
  isSubmitting: boolean;
  submitCompleted: boolean;
  thumbnail: File | null;
  isEditMode: boolean;
}

class VideoFormHandler {
  modalStore: ModalStore;
  toastStore: ToastStore;
  uploadStore: Writable<UploadStore>;
  superFrm: SuperForm<typeof uploadVideoSchema>;

  constructor(
    modalStore: ModalStore,
    toastStore: ToastStore,
    superFrm: SuperForm<typeof uploadVideoSchema>,
    isEditMode: boolean
  ) {
    this.modalStore = modalStore;
    this.toastStore = toastStore;
    this.superFrm = superFrm;
    this.uploadStore = writable({
      videoSrc: '',
      poster: '',
      uploadedFile: null,
      progress: 0,
      isSubmitting: false,
      submitCompleted: false,
      thumbnail: null,
      isEditMode
    });
  }

  subscribe(run: Subscriber<UploadStore>) {
    return this.uploadStore.subscribe(run);
  }

  hanleRemoveThumbnail() {
    const confirmationModal: ModalSettings = {
      type: 'confirm',
      title: 'Remove Thumbnail',
      body: 'Are you sure you want to remove this thumbnail?',
      buttonTextCancel: 'Cancel',
      buttonTextConfirm: 'Yes, remove the thumbnail',
      response(r) {
        if (r) {
          handleConfirm();
        }
      }
    };

    const handleConfirm = () => {
      this.uploadStore.update((store) => ({
        ...store,
        thumbnail: null,
        poster: ''
      }));
    };

    this.modalStore.trigger(confirmationModal);
  }

  handleCancelUploadClick() {
    const confirmationModal: ModalSettings = {
      type: 'confirm',
      title: 'Cancel Upload',
      body: 'Are you sure you want to cancel this upload? Any progress will be lost.',
      buttonTextCancel: 'No, continue upload',
      buttonTextConfirm: 'Yes, cancel upload',
      response(r) {
        if (r) {
          handleConfirm();
        }
      }
    };

    const handleConfirm = () => {
      this.resetForm();
    };

    this.modalStore.trigger(confirmationModal);
  }

  handleVideoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const file = target?.files[0];
      if (!file || file.type !== 'video/mp4') return;

      if (acceptedFileTypes.includes(file.type)) {
        this.uploadStore.update((store) => ({
          ...store,
          uploadedFile: file
        }));

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.uploadStore.update((store) => ({
            ...store,
            videoSrc: reader.result as string
          }));

          const videoTitle = file.name.split('.').slice(0, -1).join('.');
          this.superFrm.fields.title.value.set(videoTitle);
        };
        reader.onerror = (error) => {
          console.error(error);
        };
      } else {
        const errorToast: ToastSettings = {
          message:
            'Invalid file type. Please upload a video file. Accepted file types: mp4, m4v, mov, avi, wmv, flv, webm, mkv, mpeg',
          background: 'variant-filled-error',
          timeout: 5000
        };
        this.toastStore.trigger(errorToast);
      }
    }
  }

  handleThumbnailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const file = target?.files[0];
      if (!file) return;

      if (file.type.startsWith('image/')) {
        this.uploadStore.update((store) => ({
          ...store,
          thumbnail: file
        }));
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.uploadStore.update((store) => ({
            ...store,
            poster: reader.result as string
          }));
        };
        reader.onerror = (error) => {
          console.error(error);
        };
      } else {
        const errorToast: ToastSettings = {
          message: 'Invalid file type. Please upload an image file.',
          background: 'variant-filled-error',
          timeout: 5000
        };
        this.toastStore.trigger(errorToast);
      }
    }
  }

  async handleUploadSubmit(event: Event) {
    event.preventDefault();
    this.uploadStore.update((store) => ({
      ...store,
      isSubmitting: true
    }));

    const validationResult = await this.superFrm.validate();
    if (!validationResult.valid) {
      this.uploadStore.update((store) => ({
        ...store,
        isSubmitting: false
      }));
      this.superFrm.errors.set(validationResult.errors);
      return;
    }

    try {
      const { title, description } = validationResult.data;

      const formData = new FormData();
      this.uploadStore.subscribe(async (store) => {
        const { uploadedFile, thumbnail, isEditMode, videoSrc, poster } = store;
        let fileInputs = [
          {
            name: 'video',
            file: uploadedFile as File,
            title: `${title.replace(/\s/g, '_')}.mp4`,
            contentType: 'video/mp4',
            storageRef: ref(
              storage,
              `videos/${uuidv4() + title.replace(/\s/g, '_')}.mp4`
            )
          },
          {
            name: 'thumbnail',
            file: thumbnail as File,
            title: thumbnail?.name.replace(/\s/g, '_') as string,
            contentType: 'image/jpeg',
            storageRef: ref(
              storage,
              `thumbnails/${
                uuidv4() + thumbnail?.name.replace(/\s/g, '_') ?? ''
              }`
            )
          }
        ];

        // TODO:
        // if (isEditMode && videoSrc) {
        //   await videoService.deleteVideoFromFirebaseStorage({
        //     video: data.currentVideo!,
        //     deleteThumbnail: poster ? true : false
        //   });
        // }

        if (isEditMode && !videoSrc) {
          fileInputs.shift();
        }

        if (!thumbnail) {
          fileInputs.pop();
        }

        if (isEditMode && !thumbnail) {
          fileInputs = fileInputs.filter(
            (fileInput) => fileInput.name !== 'thumbnail'
          );
        }

        let uploadPromises: unknown[] = [];

        if (fileInputs.length === 0) {
          // uploadPromises = [
          //   {
          //     name: 'videoUrl',
          //     url: data.currentVideo?.url
          //   },
          //   {
          //     name: 'thumbnailUrl',
          //     url: data.currentVideo?.poster_url
          //   }
          // ];
        } else if (fileInputs.length >= 1) {
          uploadPromises = fileInputs.map((fileInput) => {
            return new Promise(async (resolve, reject) => {
              const uploadTask = uploadBytesResumable(
                fileInput.storageRef,
                fileInput.file,
                {
                  contentType: fileInput.contentType
                }
              );

              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const { bytesTransferred, totalBytes } = snapshot;
                  this.uploadStore.update((store) => ({
                    ...store,
                    progress: (bytesTransferred / totalBytes) * 100
                  }));
                },
                (error) => {
                  this.uploadStore.update((store) => ({
                    ...store,
                    isSubmitting: false
                  }));
                  const errorToast: ToastSettings = {
                    message:
                      'An error occurred while uploading your video. Please try again later.',
                    background: 'variant-filled-error',
                    timeout: 5000
                  };
                  this.toastStore.trigger(errorToast);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    if (url) {
                      resolve({
                        name: fileInput.name,
                        url
                      });
                    } else {
                      reject('Failed to get download URL');
                    }
                  });
                }
              );

              const urls = await Promise.all(uploadPromises);
              if (urls.length > 0) {
                const urlResults = urls as {
                  name: 'video' | 'thumbnail';
                  url: string;
                }[];

                const videoUrl = urlResults.find((url) => url.name === 'video');
                const thumbnailUrl = urlResults.find(
                  (url) => url.name === 'thumbnail'
                );

                formData.set('title', title);
                formData.set('description', description);
                formData.set(
                  'videoUrl',
                  // videoUrl?.url ?? data?.currentVideo?.url!
                  videoUrl?.url ?? ''
                );
                if (thumbnailUrl) {
                  formData.set(
                    'thumbnailUrl',
                    thumbnailUrl?.url ?? ''
                    // thumbnailUrl?.url ?? data.currentVideo?.poster_url!
                  );
                } else {
                  formData.set(
                    'thumbnailUrl',
                    ''
                    // data.currentVideo?.poster_url ?? ''
                  );
                }

                // if (isEditMode)
                //   formData.set('videoId', data?.currentVideo?.id!);

                // send the form data to the server
                fetch(
                  isEditMode ? '/upload?/updateVideo' : '/upload?/uploadVideo',
                  {
                    method: 'POST',
                    body: formData
                  }
                ).then(() => {
                  this.uploadStore.update((store) => ({
                    ...store,
                    isSubmitting: false,
                    submitCompleted: true
                  }));
                });
              }
            });
          });
        }
      });
    } catch (error) {
      console.error(error);
      this.uploadStore.update((store) => ({
        ...store,
        isSubmitting: false
      }));
      const errorToast: ToastSettings = {
        message:
          'An error occurred while uploading your video. Please try again later.',
        background: 'variant-filled-error',
        timeout: 5000
      };
      this.toastStore.trigger(errorToast);
    }
  }

  handleSubmitCompletion() {
    this.uploadStore.subscribe((store) => {
      if (store.submitCompleted) {
        const successToast: ToastSettings = {
          message: 'Your video has been uploaded successfully.',
          background: 'variant-filled-success',
          timeout: 5000
        };
        this.toastStore.trigger(successToast);

        this.resetForm();
      }
    });
  }

  resetForm() {
    this.superFrm.reset();
    this.uploadStore.update((store) => ({
      ...store,
      videoSrc: '',
      uploadedFile: null,
      isSubmitting: false,
      submitCompleted: false,
      poster: '',
      thumbnail: null
    }));

    this.uploadStore.subscribe((store) => {
      if (store.isEditMode) {
        goto('/upload');
      }
    });
  }
}

export class TestClass {
  value: Writable<number>;
  constructor() {
    this.value = writable(0);
  }

  subscribe(run: Subscriber<number>) {
    return this.value.subscribe(run);
  }

  increment() {
    this.value.update((n) => n + 1);
  }
}
