export const makeSafe = function (str) {
	return str.toLowerCase().replace(/[^a-z0-9]/g, '_');
}
export const chunk = function (arr, size) {
  const groups = [];
  for (let i = 0; i < arr.length; i += size) {
    groups.push(arr.slice(i, i + size));
  }
  return groups;
}
export const zip = function (arr1, arr2) {
  return arr1.map((d, i) => [d, arr2[i]]);
}
export const capitalize = function (str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
export const fixInternalLinks = function (url) {
  // This assumes that url is an absolute path, not a relative one
  const urlObj = new URL(window.location);
  const { origin, hostname, pathname } = urlObj || {};

  let basepath = ''
  if (pathname.length) basepath = pathname.replace(/^\//, '').split('/')[0]

  if (hostname !== 'localhost') {
    return `${origin}/${basepath}/${url.replace(/^\//, '')}`
  } else {
    return url;
  }
}