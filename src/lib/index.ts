import type { DocumentSnapshot } from 'firebase/firestore';

export const mapDocumentWithId = (doc: DocumentSnapshot) => ({
	id: doc.id,
	...doc.data()
});

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
