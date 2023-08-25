declare module 'skip32' {
  export class Skip32 {
    /**
     * Creates new instance of Skip32 Cypher.
     *
     * @param key 10 byte key, either a byte array or a string
     */
    constructor(key: Uint8Array | string);

    /**
     * Encrypt an integer
     *
     * @param n 32-bit integer
     * @returns 32-bit integer
     */
    public encrypt(n: number): number;

    /**
     * Decrypt an integer
     *
     * @param n 32-bit integer
     * @returns 32-bit integer
     */
    public decrypt(n: number): number;
  }
}
