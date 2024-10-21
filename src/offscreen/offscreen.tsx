/**
 * To use an offscreen document, you first need the "offscreen" permissions
 * enabled in the manifest.
 *
 * Then to use the offscreen document, you need to register it with the offscreen.ts api file.
 *
 * You need to message the offscreen document from a chrome extension process
 *  and then the offscreen document
 * will handle those messages, and will be able to use the DOM.
 */
