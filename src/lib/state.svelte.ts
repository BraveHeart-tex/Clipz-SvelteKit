import type { User } from 'lucia';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const USER_CTX = 'USER_CTX';

export function setUserState(user: User | undefined) {
  const userState = writable(user);
  setContext(USER_CTX, userState);
  return userState;
}

export function getUserState() {
  return getContext<Writable<User>>(USER_CTX);
}
