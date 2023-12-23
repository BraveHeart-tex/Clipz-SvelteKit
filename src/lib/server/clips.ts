import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	updateDoc,
	where
} from 'firebase/firestore';
import type { IClip } from '$lib/types';
import { mapDocumentWithId } from '$lib';
import { db, storage } from '$lib/firebase';
import { deleteObject, ref } from 'firebase/storage';

export const getClips = async () => {
	try {
		const clipsRef = collection(db, 'clips');
		const querySnapshot = await getDocs(clipsRef);

		return querySnapshot.docs.map(mapDocumentWithId);
	} catch (error) {
		console.error('Error fetching clips:', error);
		throw error;
	}
};

export const createClip = async (data: IClip) => {
	try {
		const clipsRef = collection(db, 'clips');
		const docRef = await addDoc(clipsRef, data);

		return docRef.id;
	} catch (error) {
		console.error('Error creating clip:', error);
		throw error;
	}
};

export const getUserClips = async (userId: string) => {
	try {
		const clipsRef = collection(db, 'clips');
		const querySnapshot = await getDocs(query(clipsRef, where('uid', '==', userId)));

		const clips = querySnapshot.docs.map(mapDocumentWithId);

		return clips;
	} catch (error) {
		console.error('Error fetching user clips:', error);
		throw error;
	}
};

export const updateClipTitle = async ({ id, title }: { id: string; title: string }) => {
	try {
		const clipRef = doc(db, 'clips', id);
		await updateDoc(clipRef, {
			title
		});
	} catch (error) {
		console.error('Error updating clip title:', error);
		throw error;
	}
};

export const deleteClip = async ({ clip }: { clip: IClip }) => {
	try {
		const documentRef = doc(db, 'clips', clip.id);
		const clipPath = `clips/${clip.docID}`;
		const clipRef = ref(storage, clipPath);
		const screenshotRef = ref(storage, `/screenshots/${clip.screenshotFileName}`);
		await Promise.all([deleteObject(clipRef), deleteObject(screenshotRef), deleteDoc(documentRef)]);
		return true;
	} catch (error) {
		console.error('Error deleting clip:', error);
		throw error;
	}
};

export const getLatestClips = async () => {
	try {
		const clipsRef = collection(db, 'clips');
		const q = query(clipsRef, orderBy('timestamp', 'desc'), limit(6));
		const querySnapshot = await getDocs(q);
		const clips = querySnapshot.docs.map(mapDocumentWithId);
		return clips;
	} catch (error) {
		console.error('Error fetching latest clips:', error);
		throw error;
	}
};
