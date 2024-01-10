/* eslint-disable @typescript-eslint/ban-types */
import type { User } from '@prisma/client';
import type { UserRecord } from 'firebase-admin/auth';

/// <reference types="lucia" />
declare global {
  declare namespace App {
    interface Locals {
      user?: UserRecord | null;
      auth: import('lucia').AuthRequest;
    }
    // interface PageData {}
    // interface Error {}
    // interface Platform {}
  }
  namespace Lucia {
    type Auth = import('$lib/server/lucia').Auth;
    type DatabaseUserAttributes = Partial<User>;
    type DatabaseSessionAttributes = {};
  }

  interface Document {
    startViewTransition(
      updateCallback: () => Promise<void> | void
    ): ViewTransition;
  }

  interface ViewTransition {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition(): void;
  }

  interface CSSStyleDeclaration {
    viewTransitionName: string;
  }
}

export {};
