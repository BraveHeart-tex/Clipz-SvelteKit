import type { UserRecord } from 'firebase-admin/auth';

declare global {
  declare namespace App {
    interface Locals {
      user?: UserRecord | null;
    }
    // interface PageData {}
    // interface Error {}
    // interface Platform {}
  }
}
