# Pre-launch audit — 27 September 2026

Status: code and production-build checks pass; full launch sign-off is pending browser/device and real email-delivery verification. No deployment was performed.

## Scope and design preservation

Reviewed the homepage sections, `/card`, six dialogs, navigation, calculator, forms, media, theme handling, metadata and deployment configuration. Existing layout, branding, copy and animations were retained, with targeted accessibility/functional changes: readable muted-text contrast, video play/pause controls, form feedback and mobile-safe dialog spacing. Earlier approved hero font/size changes were preserved. Original media files remain intact. No dependencies were added.

## Issues found and fixed

- Hero form ignored failed sends and opened another request form after already submitting. It now reports actual success/failure inline and prevents accidental repeat submissions.
- Submission requests had no timeout and demo configuration could falsely report success. Added a 15-second timeout, HTTP/API response checks and duplicate-recipient protection; removed successful-submit console logging.
- Main calculator passed outdated field names into booking, lost its calculated total in the dialog, and could retain stale selections. Fixed field mapping, quote handoff, reopening state and the $179/$180 Refresh exotic-vehicle calculation mismatch.
- The booking time default did not match any available option. Fixed it and blocked past preferred dates.
- `/card` links to `#reserve` did not open the homepage booking dialog. They now open it and preserve the selected package.
- Forms lacked correctly associated labels and autocomplete. Added labels, name/phone autocomplete, minimum phone checks and ZIP validation/status feedback.
- Dialogs lacked focus containment, Escape dismissal and focus restoration. Added a shared hook, dialog semantics, body-scroll locking and safe stacking above the header.
- Small-screen booking actions could crowd their price summary; contact inputs could resist shrinking; the sticky mobile bar could cover the footer. Added responsive stacking, shrinkable controls and footer clearance/safe-area support.
- Mobile navigation now supports Escape and scrolls inside short viewports.
- Service expansion on `/card` was mouse-only. Added keyboard activation and expanded-state semantics; selection buttons now expose pressed state.
- Clipboard failures were unhandled, private-mode storage failures could break rendering, and successful card requests automatically opened SMS. Added safe fallbacks and an explicit optional SMS link.
- Added reduced-motion configuration for Motion, paused comparison/marquee animation off-screen, keyboard focus pause for marquees, lazy images and intrinsic logo dimensions.
- Split the `/card` bundle from the homepage, hid the development viewport controller in production, disabled analytics initialization in development, added a not-found view and updated route-specific Twitter metadata.
- Added cache headers for hashed production assets, viewport safe-area support and high-priority hero-poster preload. Existing canonical, favicon, robots and sitemap configuration retained.

## Video changes and measured file sizes

The carousel previously mounted three MP4 sources, including desktop previews hidden on mobile. It now uses poster images for neighboring clips and mounts a source only for the selected clip near the viewport. All backgrounds use the same visibility-aware component.

- No MP4 source in the initial rendered markup; `preload="none"`.
- IntersectionObserver source loading near the viewport, playback only while visible, pause on hidden tabs/off-screen and source release on unmount.
- Hero poster appears first; background video initialization has a short delay to let critical content load.
- Reduced-motion/data-saving visitors get a static poster unless they explicitly press Play. Autoplay rejection is caught and a manual control remains available.
- Existing inline playback, looping, mute/unmute and video audio retained.
- Generated separate 540-pixel-wide H.264/AAC mobile clips at approximately 1.1 Mbps target video bitrate with fast-start MP4 metadata. Desktop sources preserved.
- Added real-frame JPEG posters and reserved existing media aspect ratios.

| Clip | Original MB | Mobile MB |
| --- | ---: | ---: |
| 1 | 14.38 | 7.53 |
| 2 | 13.63 | 7.22 |
| 3 | 8.21 | 4.66 |
| 4 | 4.23 | 2.83 |
| 5 (initial selection) | 13.43 | 5.36 |
| 6 | 8.49 | 4.94 |
| 7 | 8.72 | 4.87 |
| Total | 71.08 | 37.42 |

Mobile video files are 47.4% smaller in total; the initial carousel clip is about 60% smaller. These are file-size measurements, not measured page-transfer or loading-time results. A sample original/mobile frame comparison was visually inspected. All seven desktop clips, all seven mobile clips and the hero background decoded without errors. All mobile clips have `moov` before `mdat` for progressive playback.

## Completed verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed without build errors or bundle-size warnings.
- `npm.cmd run check:launch`: passed. Checks production HTML/JSON-LD/assets, both pages, all six rendered dialogs, form labels, anchors, headings, initial deferred video markup and MP4 fast-start layout.
- Mocked form transport checks: success, failed HTTP status, failed API response, offline, invalid JSON, missing configuration, duplicate keys and timeout. No real customer requests/emails were sent.
- Video lifecycle checks against controlled observer/media doubles: mobile/desktop source selection, initial delay, viewport/tab visibility, reduced motion, data saver, manual play and cleanup.
- Production preview HTTP checks: 39 paths/assets returned success; video MIME types and partial-content streaming verified (`206`, 1,024-byte range).
- Final emitted main JavaScript: approximately 137.8 KB gzip; deferred `/card` chunk: 13.4 KB gzip; CSS: 13.0 KB gzip.

## Outstanding before launch

1. **Browser/device verification:** the browser tool returned no connected browsers; both in-app browser and Chrome creation reported unavailable. No desktop/mobile screenshots, browser-console trace, actual autoplay test, overflow measurement or Lighthouse/Core Web Vitals score was obtained. Static rendering and lifecycle tests do not replace these checks.
2. Test both pages and all dialogs at **320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 px**, in dark/light themes; include real iPhone Safari, Android Chrome and iPad. Check keyboard-open forms, portrait/landscape, focus return, menu scrolling, footer clearance, carousel navigation/audio and before/after dragging. Layout changes were reviewed in code; these viewport results remain unverified.
3. Send a clearly labeled test booking from the production domain and confirm receipt in the intended business inboxes. The existing Web3Forms keys were preserved; key ownership/delivery and spam filtering cannot be confirmed by mocked tests.
4. Closing time resolved: you confirmed **8 PM**, and `/card` now matches the homepage/footer/structured data (7 AM–8 PM daily). Still confirm `/card`'s “9H nano-ceramic coating, multi-year warranty” wording, which is stronger than the main site's package wording.
5. Open the configured Google review, Instagram, Facebook and TikTok destinations manually. Automated fetches were blocked/unavailable, so those links are neither verified live nor proven broken. Phone/email URI formatting was checked without placing calls or sending messages.
6. Verify the actual host honors SPA fallback for `/card`, hashed-asset caching, HTTPS, video range requests and MIME types. `_redirects`/`_headers` are host-specific and local Vite preview does not prove deployed-host configuration. `/card` social tags still depend on JavaScript; non-JavaScript social crawlers may show the homepage metadata.

Production preview: http://127.0.0.1:4173/

**Readiness decision:** the production bundle is build-ready with the safe fixes applied, but a complete production-launch approval is not justified until the outstanding browser, inbox and business-fact checks are completed.

Implementation reference: [web.dev — Lazy loading video](https://web.dev/articles/lazy-loading-video).
