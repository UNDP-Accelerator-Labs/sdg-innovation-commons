import { renderMenu } from "./menu.mjs";
import { activateScrollTop } from "./widgets.mjs";
import { fixInternalLinks } from "./helpers.mjs";

// renderer (render.mjs) is imported dynamically inside onLoad to avoid module
// resolution errors at initial parsing time if render.mjs has transient issues.
// This also prints a clear error if the module fails to load.

async function onLoad() {
  let renderModule;
  try {
    renderModule = await import("./render.mjs");
  } catch (e) {
    console.error("Failed to import render.mjs:", e);
    throw e;
  }
  const { getTranscript, transcript: renderTranscript, registry: renderRegistry, footnote: renderFootnote } = renderModule;
  const params = new URLSearchParams(document.location.search);
  const doc = params.get("doc");

  // let footnotes = null;
  if (doc) {
    // This is a document page
    const source = `/pages/${doc}`;
    console.log("loading transcript");
    const { transcript, usedSource } = await getTranscript(source);
    renderTranscript(transcript, usedSource);
  } else {
    // This is a registry
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
