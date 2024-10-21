// needs the "search" permission in the manifest.json

export default class Search {
  search(query: string, disposition: chrome.search.Disposition = "NEW_TAB") {
    chrome.search.query({
      disposition,
      text: query,
    });
  }
}
