import crypto from "crypto";

export function generateSalt() {}
//Fetches salt from db or creates it if not there
export async function initSalt() {}
//Invalidates old salts and creates a new one. However all data salted with previous salts will still need the old salt
export function rotateSalt() {}
