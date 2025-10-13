import { parseMetadata } from "./parsers.mjs";

import { 
  getTranscript, 
  transcript as renderTranscript,
  registry as renderRegistry, 
  footnote as renderFootnote 
} from "./render.mjs";
import { renderMenu } from "./menu.mjs";
import { parseIntervals } from "./parsers.mjs";
import { activateScrollTop } from "./widgets.mjs";

async function onLoad() {
  const params = new URLSearchParams(document.location.search);
  const doc = params.get("doc");
  
  // let footnotes = null;
  if (doc) { // This is a document page
  	const source = `/__pages__/${doc}`;
    console.log("loading transcript");
    const { transcript, usedSource } = await getTranscript(source);
    renderTranscript(transcript, usedSource);
  } else { // This is a registry
    const source = "README.md";
    console.log("loading transcript");
    const { transcript, usedSource } = await getTranscript(source);
    renderRegistry(transcript, usedSource);
  }

  // console.log("looking for internal footnotes")
  // if (footnotes) {
  //   const { transcript: footnotes_transcript, usedSource: footnotes_usedSource } = await getTranscript(footnotes);
  //   renderFootnote(footnotes_transcript, usedSource);
  // }

  activateScrollTop();

  // RENDER THE MENU
  await renderMenu();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    onLoad();
  });
} else {
  (async () => {
    await onLoad();
  })();
}
