// ============================================
//   GALLERY DATA - Events and Images
// ============================================
//
// This file defines the gallery "events" (albums)
// and how images are discovered for each event.
//
// You created folders:
//   Event 1, Event 2, Event 3, Event 4, Event 5
//
// This setup assumes that inside each folder your
// images are named like:
//   1.jpg, 2.jpg, 3.jpg, ...  (or 1.jpeg, 2.jpeg, 3.jpeg, ...)
//
// You ONLY need to:
//   - drop JPGs with those numeric names into the
//     correct "event X" folder
//   - optionally rename the event "name" text below
//
// The code will:
//   - try a range of numbers (1..maxImages)
//   - keep only images that actually exist
//   - skip showing an album in the lightbox if
//     that folder has no images
//
// If you ever need more than 50 images per event,
// just increase maxImages in eventFolderConfig.
//

// ---------- Events / Albums ----------
function getEvents() {
    return [
        {
            id: 'event-1',
            name: 'Annual Function',
            description: '2025-26',
            gradient: '135deg, #667eea 0%, #764ba2 100%',
            // main.jpeg inside "Event 1" will be used as the cover
            coverImage: 'Event 1/main.jpg'
        },
        {
            id: 'event-2',
            name: 'Green Day',
            description: '2025-26',
            gradient: '135deg, #f7971e 0%, #ffd200 100%',
            coverImage: 'Event 2/main.jpeg'
        },
        {
            id: 'event-3',
            name: 'Sports Day',
            description: '2025-26',
            gradient: '135deg, #11998e 0%, #38ef7d 100%',
            coverImage: 'Event 3/main.jpeg'
        },
        {
            id: 'event-4',
            name: 'Surya Namaskar 2026',
            description: '2025-26',
            gradient: '135deg, #ff5f6d 0%, #ffc371 100%',
            coverImage: 'Event 4/main.jpeg'
        },
        {
            id: 'event-5',
            name: 'Campus',
            description: '',
            gradient: '135deg, #4776e6 0%, #8e54e9 100%',
            coverImage: 'Event 5/main.jpeg'
        }
    ];
}

// ---------- Folder configuration ----------
// Map each event id to its folder name and
// the maximum number of images to try.
const eventFolderConfig = {
    'event-1': { folder: 'Event 1', maxImages: 50, ext: 'jpg' },
    'event-2': { folder: 'Event 2', maxImages: 50, ext: 'jpeg' },
    'event-3': { folder: 'Event 3', maxImages: 50, ext: 'jpeg' },
    'event-4': { folder: 'Event 4', maxImages: 50, ext: 'jpeg' },
    'event-5': { folder: 'Event 5', maxImages: 50, ext: 'jpeg' }
};

// Helper to build a list of potential image URLs
// like "Event 1/1.jpg", "Event 1/2.jpg", ...
function buildSequentialImages(folder, maxImages, ext) {
    const images = [];
    const safeExt = ext || 'jpg';
    for (let i = 1; i <= maxImages; i++) {
        images.push({ url: folder + '/' + i + '.' + safeExt });
    }
    return images;
}

// Map images to events
// NOTE: This returns the *potential* list of images.
// script.js will filter this list so that only
// actually existing images are shown to the user.
function getImagesByEvent(eventId) {
    const config = eventFolderConfig[eventId];
    if (!config) return [];
    return buildSequentialImages(config.folder, config.maxImages, config.ext);
}

