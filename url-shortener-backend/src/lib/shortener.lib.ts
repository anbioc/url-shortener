import { customAlphabet } from 'nanoid';

// Recommended: Length 7 or 8
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

// Inside your shorten function
export function createShortLink() {

    return nanoid()
 
    
}