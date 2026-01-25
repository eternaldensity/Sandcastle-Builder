/**
 * Unit tests for Base64 encoding/decoding utilities.
 *
 * Tests cover:
 * - UTF-8 encoding/decoding
 * - Base64 encode/decode
 * - Round-trip consistency
 * - Edge cases and special characters
 */

import { describe, it, expect } from 'vitest';
import {
  utf8Encode,
  utf8Decode,
  setUpUsTheBomb,
  belongToUs,
  base64Encode,
  base64Decode,
  AllYourBase,
} from './base64.js';

describe('utf8Encode', () => {
  it('encodes ASCII characters unchanged', () => {
    expect(utf8Encode('hello')).toBe('hello');
    expect(utf8Encode('ABC123')).toBe('ABC123');
    expect(utf8Encode('')).toBe('');
  });

  it('normalizes line endings', () => {
    expect(utf8Encode('a\r\nb')).toBe('a\nb');
    expect(utf8Encode('line1\r\nline2\r\n')).toBe('line1\nline2\n');
  });

  it('encodes 2-byte UTF-8 characters', () => {
    // Characters in range 128-2047 use 2 bytes
    const result = utf8Encode('é'); // Latin small letter e with acute (U+00E9)
    expect(result.length).toBe(2);
    expect(result.charCodeAt(0)).toBe(195); // 0xC3
    expect(result.charCodeAt(1)).toBe(169); // 0xA9
  });

  it('encodes 3-byte UTF-8 characters', () => {
    // Characters >= 2048 use 3 bytes
    const result = utf8Encode('中'); // Chinese character (U+4E2D)
    expect(result.length).toBe(3);
  });
});

describe('utf8Decode', () => {
  it('decodes ASCII characters unchanged', () => {
    expect(utf8Decode('hello')).toBe('hello');
    expect(utf8Decode('ABC123')).toBe('ABC123');
    expect(utf8Decode('')).toBe('');
  });

  it('decodes 2-byte UTF-8 sequences', () => {
    const encoded = String.fromCharCode(195, 169); // UTF-8 for é
    expect(utf8Decode(encoded)).toBe('é');
  });

  it('decodes 3-byte UTF-8 sequences', () => {
    // UTF-8 encoding of 中 (U+4E2D)
    const encoded = String.fromCharCode(228, 184, 173);
    expect(utf8Decode(encoded)).toBe('中');
  });
});

describe('utf8 round-trip', () => {
  it('preserves ASCII strings', () => {
    const input = 'Hello, World! 123';
    expect(utf8Decode(utf8Encode(input))).toBe(input);
  });

  it('preserves strings with special characters', () => {
    const input = 'Héllo Wörld';
    expect(utf8Decode(utf8Encode(input))).toBe(input);
  });

  it('preserves strings with line endings', () => {
    const input = 'line1\nline2';
    expect(utf8Decode(utf8Encode(input))).toBe(input);
  });

  it('preserves Unicode characters', () => {
    const input = '中文字符';
    expect(utf8Decode(utf8Encode(input))).toBe(input);
  });
});

describe('setUpUsTheBomb (base64 encode)', () => {
  it('encodes empty string', () => {
    expect(setUpUsTheBomb('')).toBe('');
  });

  it('encodes simple ASCII strings', () => {
    // Standard base64 test vectors
    expect(setUpUsTheBomb('f')).toBe('Zg==');
    expect(setUpUsTheBomb('fo')).toBe('Zm8=');
    expect(setUpUsTheBomb('foo')).toBe('Zm9v');
    expect(setUpUsTheBomb('foob')).toBe('Zm9vYg==');
    expect(setUpUsTheBomb('fooba')).toBe('Zm9vYmE=');
    expect(setUpUsTheBomb('foobar')).toBe('Zm9vYmFy');
  });

  it('encodes strings with spaces', () => {
    expect(setUpUsTheBomb('hello world')).toBe('aGVsbG8gd29ybGQ=');
  });

  it('encodes strings with numbers', () => {
    expect(setUpUsTheBomb('123')).toBe('MTIz');
  });

  it('handles padding correctly', () => {
    // 1 char = 2 padding chars
    const one = setUpUsTheBomb('a');
    expect(one.endsWith('==')).toBe(true);

    // 2 chars = 1 padding char
    const two = setUpUsTheBomb('ab');
    expect(two.endsWith('=')).toBe(true);
    expect(two.endsWith('==')).toBe(false);

    // 3 chars = no padding
    const three = setUpUsTheBomb('abc');
    expect(three.endsWith('=')).toBe(false);
  });
});

describe('belongToUs (base64 decode)', () => {
  it('decodes empty string', () => {
    expect(belongToUs('')).toBe('');
  });

  it('decodes simple ASCII strings', () => {
    expect(belongToUs('Zg==')).toBe('f');
    expect(belongToUs('Zm8=')).toBe('fo');
    expect(belongToUs('Zm9v')).toBe('foo');
    expect(belongToUs('Zm9vYg==')).toBe('foob');
    expect(belongToUs('Zm9vYmE=')).toBe('fooba');
    expect(belongToUs('Zm9vYmFy')).toBe('foobar');
  });

  it('decodes strings with spaces', () => {
    expect(belongToUs('aGVsbG8gd29ybGQ=')).toBe('hello world');
  });

  it('strips invalid characters before decoding', () => {
    // Newlines and other characters should be stripped
    expect(belongToUs('Zm9v\nYmFy')).toBe('foobar');
    expect(belongToUs('Zm9v YmFy')).toBe('foobar');
  });

  it('requires proper padding', () => {
    // Legacy implementation requires proper padding
    // Without padding, it produces garbage output
    // Properly padded versions work correctly
    expect(belongToUs('Zg==')).toBe('f');
    expect(belongToUs('Zm8=')).toBe('fo');
  });
});

describe('base64 round-trip', () => {
  it('preserves simple strings', () => {
    const testStrings = [
      '',
      'a',
      'ab',
      'abc',
      'Hello, World!',
      'The quick brown fox jumps over the lazy dog',
    ];

    for (const input of testStrings) {
      expect(belongToUs(setUpUsTheBomb(input))).toBe(input);
    }
  });

  it('preserves strings with special characters', () => {
    const input = 'Special: @#$%^&*()_+-=[]{}|;:",.<>?/~`';
    expect(belongToUs(setUpUsTheBomb(input))).toBe(input);
  });

  it('preserves Unicode strings', () => {
    const input = 'Héllo Wörld 中文';
    expect(belongToUs(setUpUsTheBomb(input))).toBe(input);
  });

  it('preserves multiline strings', () => {
    const input = 'line1\nline2\nline3';
    expect(belongToUs(setUpUsTheBomb(input))).toBe(input);
  });

  it('preserves save game-like data', () => {
    // Simulate the kind of data the game would save
    const input = '4.12P1234567890PboostsPbadgesPtools';
    expect(belongToUs(setUpUsTheBomb(input))).toBe(input);
  });
});

describe('aliases', () => {
  it('base64Encode is an alias for setUpUsTheBomb', () => {
    expect(base64Encode).toBe(setUpUsTheBomb);
    expect(base64Encode('test')).toBe(setUpUsTheBomb('test'));
  });

  it('base64Decode is an alias for belongToUs', () => {
    expect(base64Decode).toBe(belongToUs);
    expect(base64Decode('dGVzdA==')).toBe(belongToUs('dGVzdA=='));
  });
});

describe('AllYourBase compatibility object', () => {
  it('has the expected methods', () => {
    expect(typeof AllYourBase.SetUpUsTheBomb).toBe('function');
    expect(typeof AllYourBase.BelongToUs).toBe('function');
    expect(typeof AllYourBase._utf8_encode).toBe('function');
    expect(typeof AllYourBase._utf8_decode).toBe('function');
  });

  it('has the key string', () => {
    expect(AllYourBase._keyStr).toBe(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    );
  });

  it('works like the standalone functions', () => {
    const input = 'test string';
    expect(AllYourBase.SetUpUsTheBomb(input)).toBe(setUpUsTheBomb(input));
    expect(AllYourBase.BelongToUs('dGVzdA==')).toBe(belongToUs('dGVzdA=='));
  });
});

describe('legacy game data compatibility', () => {
  it('decodes actual game data strings', () => {
    // From data.js Molpy.wing0 array - one of the "All Your Base" phrases
    const encoded = 'U29tZWJvZHklMjUyMHNldCUyNTIwdXAlMjUyMHVzJTI1MjB0aGUlMjUyMGJvbWIu';
    const decoded = belongToUs(encoded);
    // The decoded string is URL-encoded, so we check it starts correctly
    expect(decoded).toContain('Somebody');
  });
});
