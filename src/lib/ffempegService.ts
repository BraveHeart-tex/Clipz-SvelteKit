import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

interface FFmpegServiceInterface {
  isRunning: boolean;
  isReady: boolean;
  init(): Promise<void>;
  getScreenShots(file: File): Promise<string[]>;
  blobFromURL(url: string): Promise<Blob>;
}

export class FFmpegService implements FFmpegServiceInterface {
  isRunning: boolean = false;
  isReady: boolean = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) return;

    await this.ffmpeg.load();

    this.isReady = true;
  }

  async getScreenShots(file: File) {
    this.isRunning = true;
    const data = await fetchFile(file);

    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds: number[] = [0, 10, 20];
    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        // Input
        '-i',
        file.name,

        // Output options
        '-ss',
        `00:00:0${second}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-1',

        // Output
        `output_0${second}.png`
      );
    });

    await this.ffmpeg.run(...commands);

    const screenshots: string[] = [];
    seconds.forEach((second) => {
      const screenshotFile = this.ffmpeg.FS(
        `readFile`,
        `output_0${second}.png`
      );

      const screenshotBlob = new Blob([screenshotFile.buffer], {
        type: 'image/png'
      });

      const screenshotURL = URL.createObjectURL(screenshotBlob);

      screenshots.push(screenshotURL);
    });

    this.isRunning = false;

    return screenshots;
  }

  async blobFromURL(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}

export const ffmpegService = new FFmpegService();
