// ============================================
//   GALLERY DATA - Events and Images
// ============================================
//
// This file defines the gallery "events" (albums)
// and how images are discovered for each event.
//
// You created folders:
//   event 1, event 2, event 3, event 4, event 5
//
// This setup assumes that inside each folder your
// images are named like:
//   1.jpg, 2.jpg, 3.jpg, ...
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
            // main.jpg inside "event 1" will be used as the cover
            coverImage: 'event 1/main.jpg'
        },
        {
            id: 'event-2',
            name: 'Event 2',
            description: 'Highlights from Event 2',
            gradient: '135deg, #f7971e 0%, #ffd200 100%',
            coverImage: 'event 2/main.jpg'
        },
        {
            id: 'event-3',
            name: 'Event 3',
            description: 'Highlights from Event 3',
            gradient: '135deg, #11998e 0%, #38ef7d 100%',
            coverImage: 'event 3/main.jpg'
        },
        {
            id: 'event-4',
            name: 'Event 4',
            description: 'Highlights from Event 4',
            gradient: '135deg, #ff5f6d 0%, #ffc371 100%',
            coverImage: 'event 4/main.jpg'
        },
        {
            id: 'event-5',
            name: 'Event 5',
            description: 'Highlights from Event 5',
            gradient: '135deg, #4776e6 0%, #8e54e9 100%',
            coverImage: 'event 5/main.jpg'
        }
    ];
}

// ---------- Folder configuration ----------
// Map each event id to its folder name and
// the maximum number of images to try.
const eventFolderConfig = {
    'event-1': { folder: 'event 1', maxImages: 50 },
    'event-2': { folder: 'event 2', maxImages: 50 },
    'event-3': { folder: 'event 3', maxImages: 50 },
    'event-4': { folder: 'event 4', maxImages: 50 },
    'event-5': { folder: 'event 5', maxImages: 50 }
};

// Helper to build a list of potential image URLs
// like "event 1/1.jpg", "event 1/2.jpg", ...
function buildSequentialImages(folder, maxImages) {
    const images = [];
    for (let i = 1; i <= maxImages; i++) {
        images.push({ url: folder + '/' + i + '.jpg' });
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
    return buildSequentialImages(config.folder, config.maxImages);
}

