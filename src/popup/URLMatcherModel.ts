/**
 * Generate a URL match/glob pattern.
 * @param {string} url - The URL to be transformed into a pattern.
 * @param {MatchOptions} options - Matching options.
 * @returns {string | null} - The URL pattern or null if an error occurs.
 */
type MatchOptions = {
  matchDomain?: boolean;
  matchPath?: boolean;
  matchExact?: boolean;
};

export class URLMatcherModel {
  static generateUrlPattern(
    url: string,
    options: MatchOptions = {}
  ): string | null {
    const {
      matchDomain = false,
      matchPath = false,
      matchExact = false,
    } = options;

    try {
      const urlObj = new URL(url);

      if (matchExact) {
        return url; // Exact match includes the full URL.
      }

      if (matchDomain) {
        return `${urlObj.protocol}//${urlObj.hostname}/*`; // Match only the domain.
      }

      if (matchPath) {
        return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}*`; // Match domain and path.
      }

      throw new Error(
        "Invalid options: One of the match options must be true."
      );
    } catch (error) {
      console.error("Invalid URL or options provided:", error);
      return null;
    }
  }

  /**
   * Check if a URL matches a given pattern.
   * @param {string} url - The URL to check.
   * @param {string} pattern - The pattern to match against.
   * @returns {boolean} - True if the URL matches the pattern, false otherwise.
   */
  static matches(url: string, pattern: string): boolean {
    try {
      // Handle exact match
      if (!pattern.includes("*")) {
        return url === pattern;
      }

      // Convert pattern to regex
      const regexPattern = pattern
        .replace(/[\.\*\+\?\^\$\{\}\(\)\|\[\]\\]/g, "\\$&") // Escape special regex characters
        .replace(/\*/g, ".*"); // Convert * to regex wildcard

      const regex = new RegExp(`${regexPattern}`);
      return regex.test(url);
    } catch (error) {
      console.error("Error checking URL match:", error);
      return false;
    }
  }
}
