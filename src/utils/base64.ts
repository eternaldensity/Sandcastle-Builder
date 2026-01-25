/**
 * Base64 Encoding/Decoding Utilities
 *
 * Pure functions extracted from legacy data.js (AllYourBase object).
 * These handle the base64 encoding used for save game serialization.
 *
 * The naming convention comes from the "All Your Base Are Belong To Us" meme:
 * - SetUpUsTheBomb: encode
 * - BelongToUs: decode
 */

/**
 * Standard Base64 character set.
 */
const KEY_STR =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * Encode a string to UTF-8 byte representation.
 *
 * This handles Unicode characters by converting them to their
 * multi-byte UTF-8 representation.
 *
 * @param input - The string to encode
 * @returns UTF-8 encoded string (each char is a byte value)
 */
export function utf8Encode(input: string): string {
  // Normalize line endings
  const normalized = input.replace(/\r\n/g, '\n');
  let utftext = '';

  for (let n = 0; n < normalized.length; n++) {
    const c = normalized.charCodeAt(n);

    if (c < 128) {
      // Single byte (ASCII)
      utftext += String.fromCharCode(c);
    } else if (c < 2048) {
      // Two bytes
      utftext += String.fromCharCode((c >> 6) | 192);
      utftext += String.fromCharCode((c & 63) | 128);
    } else {
      // Three bytes
      utftext += String.fromCharCode((c >> 12) | 224);
      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
      utftext += String.fromCharCode((c & 63) | 128);
    }
  }

  return utftext;
}

/**
 * Decode a UTF-8 byte string back to a regular string.
 *
 * @param utftext - UTF-8 encoded string (each char is a byte value)
 * @returns Decoded Unicode string
 */
export function utf8Decode(utftext: string): string {
  let result = '';
  let i = 0;

  while (i < utftext.length) {
    const c = utftext.charCodeAt(i);

    if (c < 128) {
      // Single byte (ASCII)
      result += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      // Two bytes
      const c2 = utftext.charCodeAt(i + 1);
      result += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      // Three bytes
      const c2 = utftext.charCodeAt(i + 1);
      const c3 = utftext.charCodeAt(i + 2);
      result += String.fromCharCode(
        ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
      );
      i += 3;
    }
  }

  return result;
}

/**
 * Encode a string to Base64.
 *
 * Named after the meme: "Somebody set up us the bomb"
 *
 * @param input - The string to encode
 * @returns Base64 encoded string
 */
export function setUpUsTheBomb(input: string): string {
  let output = '';
  let i = 0;

  // First encode to UTF-8
  const utf8Input = utf8Encode(input);

  while (i < utf8Input.length) {
    const chr1 = utf8Input.charCodeAt(i++);
    const chr2 = utf8Input.charCodeAt(i++);
    const chr3 = utf8Input.charCodeAt(i++);

    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    let enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output +=
      KEY_STR.charAt(enc1) +
      KEY_STR.charAt(enc2) +
      KEY_STR.charAt(enc3) +
      KEY_STR.charAt(enc4);
  }

  return output;
}

/**
 * Decode a Base64 string.
 *
 * Named after the meme: "All your base are belong to us"
 *
 * @param input - Base64 encoded string
 * @returns Decoded string
 */
export function belongToUs(input: string): string {
  let output = '';
  let i = 0;

  // Strip non-base64 characters
  const cleanInput = input.replace(/[^A-Za-z0-9+/=]/g, '');

  while (i < cleanInput.length) {
    const enc1 = KEY_STR.indexOf(cleanInput.charAt(i++));
    const enc2 = KEY_STR.indexOf(cleanInput.charAt(i++));
    const enc3 = KEY_STR.indexOf(cleanInput.charAt(i++));
    const enc4 = KEY_STR.indexOf(cleanInput.charAt(i++));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    output += String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }

  // Decode UTF-8 back to string
  output = utf8Decode(output);

  return output;
}

/**
 * Alias for setUpUsTheBomb - standard base64 encode.
 */
export const base64Encode = setUpUsTheBomb;

/**
 * Alias for belongToUs - standard base64 decode.
 */
export const base64Decode = belongToUs;

/**
 * AllYourBase object for compatibility with legacy code.
 * Provides the same interface as the original.
 */
export const AllYourBase = {
  _keyStr: KEY_STR,
  SetUpUsTheBomb: setUpUsTheBomb,
  BelongToUs: belongToUs,
  _utf8_encode: utf8Encode,
  _utf8_decode: utf8Decode,
};
