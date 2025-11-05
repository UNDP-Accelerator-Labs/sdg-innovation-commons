import { chunk, zip } from "./helpers.mjs";

// REGEX LOOKUP [[]]
export const tagLookup = /\[\[[\w:.\-\/\d\s…&\(\)\"'_,@%~#=]*\]\]/g;
const typeLookup = /\[\[type:[\w:.\-\/\d\s…&\(\)\"'_,@%~#=]*\]\]/g;

export const parseMetadata = function (text, metafields) {
  if (!Array.isArray(metafields)) metafields = [metafields];
  // Return ids with hyperlinks
  let matches = [...text.matchAll(tagLookup)].filter((d) => {
    return metafields.some((c) => d[0].replace(/[\[\]]/g, "").startsWith(c));
  });

  // Splice the text to remove the metadata
  matches.forEach((d) => {
    text = text.replace(d[0], "");
  });
  const typeMatches = [...text.matchAll(typeLookup)];
  typeMatches.forEach((d) => {
    text = text.replace(d[0], "");
  });

  const metadata = {};
  matches.forEach((d) => {
    const [key, ...rest] = d[0].replace(/[\[\]]/g, "").split(":");
    const value = rest.join(":");
    if (metadata[key]) metadata[key].push(value);
    else metadata[key] = [value];
  });

  if (Object.keys(metadata).length)
    return { ...metadata, text }; // Return a flat object
  else return { text };
};

// The functions below are not needed here
export const parseTimestamps = function (text) {
  // REGEX LOOKUP [[]]
  // AND RETURN ids WITH HYPERLINKS
  const lookup = /\[\[\d+[:.]?(\d+)?(:\d+)?\]\]/g;
  return [...text.matchAll(lookup)];
};
export const convertStringToSeconds = function (str) {
  return str
    .replace(/[\[\]]+/g, "")
    .split(/[:.]/g)
    .reverse()
    .map((d, i) => +d * Math.pow(60, i))
    .reduce((accumulator, value) => accumulator + value); // CONVERT EVERYTHING TO SECONDS
};
export const parseIntervals = function (text, audioDuration) {
  let timestamps = parseTimestamps(text);
  timestamps = timestamps.map((d) => {
    return convertStringToSeconds(d[0]);
  });
  timestamps = zip(timestamps, timestamps.slice(1))
    .flat()
    .filter((d) => d !== undefined && d < audioDuration);
  timestamps.push(audioDuration);
  return chunk(timestamps, 2);
};
