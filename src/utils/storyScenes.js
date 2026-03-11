/**
 * Storytelling scenes for animate-on-scroll.
 * Single source of truth for each stage: overlay copy, phone placement, and metadata.
 * Used by GSAP ScrollTrigger and the main layout to render the right content per section.
 */

/** @typedef {'center' | 'right' | 'left' | 'bottom' | 'off'} PhonePlacement */

/**
 * @typedef {Object} StoryScene
 * @property {string} id - Unique scene id (e.g. for ScrollTrigger markers / refs)
 * @property {string} name - Human-readable name for debugging
 * @property {string} [overlayText] - Copy shown as overlay (above or beside the phone)
 * @property {PhonePlacement} phonePlacement - Where the phone sits in the viewport
 * @property {Object} [phoneAnimation] - Hints for phone animation into this stage (e.g. spinUp, slideIn)
 * @property {Object} [overlayAnimation] - Hints for overlay animation (e.g. fadeIn, fadeOut)
 */

/** @type {StoryScene[]} */
export const storyScenes = [
  {
    id: 'intro-enter',
    name: 'Intro – phone enters',
    overlayText: 'Introducing Memory AI',
    phonePlacement: 'center',
    phoneAnimation: { type: 'spinUp', from: 'bottom' },
    overlayAnimation: { type: 'fadeIn', position: 'abovePhone' },
  },
  {
    id: 'intro-transition',
    name: 'Intro – transition to side',
    overlayText: null,
    phonePlacement: 'center',
    phoneAnimation: { type: 'moveToSide', to: 'right' },
    overlayAnimation: { type: 'fadeOut' },
  },
  {
    id: 'intro-create',
    name: 'Intro – create memories CTA',
    overlayText: 'Double click to create memories',
    phonePlacement: 'right',
    phoneAnimation: {},
    overlayAnimation: { type: 'fadeIn', position: 'left' },
  },
]

/**
 * Get scene by id.
 * @param {string} id
 * @returns {StoryScene | undefined}
 */
export function getSceneById(id) {
  return storyScenes.find((s) => s.id === id)
}

/**
 * Get all scene ids in order (for ScrollTrigger / refs).
 * @returns {string[]}
 */
export function getSceneIds() {
  return storyScenes.map((s) => s.id)
}
