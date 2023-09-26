/**
 * Convert a given string into a URL-friendly slug.
 *
 * @param str - The string to be converted into a slug.
 *
 * @returns The slugified version of the input string.
 *
 * @example
 * slugify("Hello World!"); // Outputs: "hello-world"
 * slugify("söme stüff with áccènts"); // Outputs: "some-stuff-with-accents"
 */
function slugify(str: string): string {
  return String(str)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
}

export default slugify;
