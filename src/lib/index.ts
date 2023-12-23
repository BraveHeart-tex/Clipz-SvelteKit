import type { DocumentSnapshot } from 'firebase/firestore';

export const mapDocumentWithId = (doc: DocumentSnapshot) => ({
	id: doc.id,
	...doc.data()
});
