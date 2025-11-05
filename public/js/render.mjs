import { d3_extended as d3 } from "./d3.extensions.mjs";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { makeSafe, capitalize, fixInternalLinks } from "./helpers.mjs";
import { setupSVG } from "./widgets.mjs";

import {
  tagLookup,
  parseMetadata,
  parseTimestamps,
  convertStringToSeconds,
  parseIntervals,
} from "./parsers.mjs";

import {
  setupAudio,
  getAudio,
  filterAudioData,
  normalizeAudioData,
  audioElement,
  playAudio,
} from "./audio.mjs";

import { visualizeAudio } from "./visualization.mjs";

function fetchTranscript(path) {
  return fetch(decodeURI(path)).then(async (res) => {
    if (res.ok) return res.text();
    else throw new Error("Could not find file.");
  });
  // WE DO NOT USE CATCH HERE AS WE NEED TO CHECK FOR THE ERROR IN THE getTranscript FUNCTION
}

// THIS IS NOT USED
// const isLocal =
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1";
// const basePath = isLocal ? "" : "/RnD-Archive";

export const getTranscript = async function (path) {
  let transcript = "";
  let usedSource = path;

  // Helper to attempt fetch and return text or throw
  const tryFetch = async (p) => {
    try {
      const res = await fetch(decodeURI(p));
      if (res.ok) return res.text();
      throw new Error(`Could not find file at ${p}`);
    } catch (e) {
      throw e;
    }
  };

  // If the path appears to reference something in the pages folder, normalize to the
  // server-root absolute /pages/<file> path first — this avoids producing
  // /registries/pages/... when client-side helpers prepend the current registry path.
  const pagesMatch = String(path).match(/pages\/(.+)$/);
  if (pagesMatch) {
    const file = pagesMatch[1];
    // On GitHub Pages the site can be served under a repo subpath (e.g. /<repo>/).
    // Derive first path segment and include it so absolute URL points to the deployed repo root.
    const firstSegment =
      window.location.pathname.split("/").filter(Boolean)[0] || "";
    const prefix = firstSegment ? `/${firstSegment}` : "";
    const absolutePages = `${window.location.origin}${prefix}/pages/${file}`; // absolute URL to pages on deployed site
    try {
      transcript = await tryFetch(absolutePages);
      usedSource = `/pages/${file}`;
      return { transcript, usedSource };
    } catch (err) {
      // fall through to other fallbacks
      // try relative paths as last resort
    }
  }

  try {
    transcript = await tryFetch(path);
  } catch (err) {
    // If the path started with './', try one level up as before
    if (path.startsWith("./")) {
      try {
        const upPath = path.replace(/^(.)?\//, "../");
        transcript = await tryFetch(upPath);
        usedSource = upPath;
      } catch (err) {
        console.log(err);
      }
    } else {
      // If the first fetch failed and the path was a plain filename (e.g., README.md),
      // try fetching from the current directory and from the server root pages folder
      try {
        // try current directory
        transcript = await tryFetch(path);
      } catch (e1) {
        try {
          // last resort: check root /pages/
          const file = path.replace(/^.*\//, "");
          const abs = `${window.location.origin}/pages/${file}`;
          transcript = await tryFetch(abs);
          usedSource = `/pages/${file}`;
        } catch (e2) {
          console.log(e2);
        }
      }
    }
  }
  return { transcript, usedSource };
};
export const transcript = function (text, source) {
  // Build metadata tag list only from tags that include a ':' and whose key contains a letter
  // This avoids treating timestamp-only tags like [[00:19]] as metadata keys.
  const alltags = [
    ...(new Set(
      [...text.matchAll(tagLookup)]
        .map((d) => d[0].replace(/[\[\]]/g, ""))
        .filter((token) => {
          if (!token.includes(":")) return false;
          const key = token.split(":")[0];
          // only treat as metadata when the key contains at least one letter (avoid numeric timestamps)
          return /[A-Za-z]/.test(key);
        })
        .map((token) => token.split(":")[0])
    ) || []),
  ];

  const { text: parsed_text, ...metadata } = parseMetadata(text, alltags);
  let html = marked.parse(parsed_text);

  // Replace timestamp markers like [[00:19]] inside the rendered HTML with jump buttons
  // so users can click to jump to that time in the audio (consistent with transcript.mjs)
  const timestamps = parseTimestamps(html);
  if (timestamps?.length) {
    for (let i = 0; i < timestamps.length; i++) {
      const ts = timestamps[i];
      const str = ts[0];
      const sec = convertStringToSeconds(ts[0]);
      html = html.replace(
        str,
        `<button class='play'>&#9205;</button><button class='jump-to-ts' id='ts-${sec}' data-ts='${sec}'><label>${str.replace(/[[\]]*/g, "")}</label></button>&nbsp;`
      );
    }
  }

  const {
    thematic_areas,
    sdgs,
    continent,
    country,
    latlng,
    gender,
    year,
    focal_point,
    ...othertags
  } = metadata || {};

  const content = d3.select("section.content > div.inner");
  const transcript = content.addElem("div", "transcript").html(html);

  // If there's an audio tag in the metadata, set up audio UI and visualization (non-blocking)
  if (metadata?.audio && metadata.audio.length) {
    try {
      const rawAudio = metadata.audio[0];
      // Avoid mangling absolute URLs (fixInternalLinks is for internal paths)
      const audioUrl = /^https?:\/\//.test(rawAudio)
        ? rawAudio
        : fixInternalLinks(rawAudio);

      // create the audio controls and svg immediately
      setupAudio();

      // create or select the audio element and then decode the audio buffer
      audioElement(audioUrl).then(([audioEl, duration]) => {
        try {
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          getAudio(audioUrl, audioCtx).then((audioBuffer) => {
            try {
              const audioData = normalizeAudioData(
                filterAudioData(audioBuffer)
              );
              const intervals = parseIntervals(text, audioBuffer.duration);
              visualizeAudio(
                audioData,
                audioEl,
                audioBuffer.duration,
                intervals
              );
            } catch (e) {
              console.log("error while preparing audio visualization", e);
            }
          });
        } catch (e) {
          console.log("audio decoding/setup failed", e);
        }
      });
    } catch (e) {
      console.log("audio setup error", e);
    }
  }

  // Add target blank to all hyperlinks
  transcript.selectAll("a").attr("target", "_blank");

  const cartouche = content
    .addElems("div", "cartouche")
    .addElem("div", "inner");

  // Build cartouche data synchronously to avoid ReferenceError inside d3 callbacks
  const cartoucheData = (function () {
    const obj = [];
    if ((country && country.length > 0) || (latlng && latlng.length > 0)) {
      obj.push({
        key: "Locations",
        locations: latlng,
        values: [...(new Set(country || []) || [])],
      });
    }
    if ((sdgs || []).length > 0) {
      obj.push({
        key: "SDGs",
        values: [...(new Set(sdgs || []) || [])].sort(
          (a, b) =>
            parseInt(a.match(/\d+/) || 0) - parseInt(b.match(/\d+/) || 0)
        ),
      });
    }
    if ((gender || []).length > 0)
      obj.push({
        key: "Gender of the innovator",
        values: [...(new Set(gender || []) || [])],
      });
    if ((year || []).length > 0)
      obj.push({ key: "Year", values: [...(new Set(year || []) || [])] });

    for (let k in othertags) {
      const kl = k.toLowerCase();
      if (["audio"].includes(kl)) continue; // skip raw audio
      const values = [...new Set(othertags[k] || [])];
      const filtered = values.filter((v) => {
        if (v === null || v === undefined) return false;
        const s = String(v).trim();
        if (!s.length) return false;
        // skip pure digits or mm:ss timestamp-like tokens
        if (/^\d+$/.test(s)) return false;
        if (/^\d+[:.]\d+$/.test(s)) return false;
        // skip urls
        if (/^https?:\/\//.test(s)) return false;
        return true;
      });
      if (filtered.length) {
        // displayKey: map ai/ai_summary to 'AI Summary', otherwise capitalize
        const displayKey =
          kl === "ai_summary" || kl === "ai" ? "AI Summary" : capitalize(k);
        obj.push({ key: displayKey, values: filtered });
      }
    }
    return obj;
  })();

  const c_sections = cartouche
    .addElems("div", "c-section", cartoucheData)
    .each(function (d) {
      d3.select(this).classed(makeSafe(d.key), true);
    });

  c_sections
    .addElems("h3", null, (d) => (d.key !== "Locations" ? [d] : []))
    .html((d) => d.key.replace(/_/g, " "));

  c_sections
    .addElems("div", "tags", (d) => [
      d.values.map((c) => ({ key: d.key, value: c })),
    ])
    .addElems("button", "tag", (d) => d)
    .each(function (d) {
      const btn = d3.select(this);
      // always add a class derived from the metadata key
      btn.classed(d.key.toLowerCase(), true);
      // use a special class for AI summary entries, otherwise keep the normal 'tag' class
      const normalizedKey = String(d.key).replace(/\s+/g, "_").toLowerCase();
      if (normalizedKey === "ai_summary") {
        btn.classed("tag_ai_summary", true).classed("tag", false);
      } else {
        btn.classed("tag", true).classed("tag_ai_summary", false);
      }
    })
    .addElem("label")
    .each(function (d) {
      const container = d3.select(this);
      const normalizedKey = String(d.key).replace(/\s+/g, "_").toLowerCase();
      const value = d.value;
      const text =
        normalizedKey === "ai_summary"
          ? value
          : value.length > 30
            ? `${value.slice(0, 30)}…`
            : value;
      if (
        ["tactics", "principles", "tools", "skills"].includes(normalizedKey)
      ) {
        container
          .addElem("a")
          .attr("href", () =>
            fixInternalLinks(`/what_we_used/?doc=${encodeURIComponent(value)}`)
          )
          .html(text);
      } else {
        container.addElem("span").html(text);
      }
    });

  // Attach click handlers to timestamp buttons (jump to audio)
  d3.selectAll("button.jump-to-ts").on("click", function () {
    let { ts } = this.dataset;
    ts = parseFloat(ts * 100); // convert seconds to centiseconds
    if (typeof playAudio === "function") playAudio(ts);
  });

  const url = new URL(document.location);
  let path = url.pathname.split("/").filter((d) => d.length);

  const titleSection = d3.select("section.title > div.inner");
  titleSection
    .addElems("button", "chip breadcrumb", path)
    .addElem("label")
    .addElem("a")
    .attr("href", (d, i) => `/${path.slice(0, i + 1).join("/")}`)
    .html((d) => d);
  transcript.select("h1").moveTo(titleSection.node());

  // Add credit for original documentation
  titleSection
    .addElems("p", "contributors", [[...(new Set(focal_point) || [])]])
    .html((d) => {
      return `Documented by ${d.join(", ")}`;
    });

  // Add a link to edit the file directly in Github
  titleSection
    .addElem("a", "edit-link")
    .attr("href", (_) => {
      // `source` is provided by getTranscript and may be like '/pages/File.md', 'README.md', '../pages/File.md', etc.
      // Normalize it to a repository-relative path and point to the correct repo.
      let src = String(source || "");
      // remove any parent-directory references and leading slashes
      src = src.replace(/\.\.\//g, "").replace(/^\//, "");
      // Fallback: if empty, point to repo root README
      if (!src) src = "README.md";
      return `https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons/edit/gh-pages/${encodeURIComponent(
        src
      )}`;
    })
    .attr("target", "_blank")
    .html("Edit this page");

  const chips = titleSection
    .addElems("div", "tags")
    .addElems(
      "button",
      "tag",
      (thematic_areas || []).map((c) => {
        return { key: "thematic_areas", value: c };
      })
    )
    .each(function (d) {
      d3.select(this).classed(d.key, true);
    })
    .addElem("label")
    .addElem("a")
    .attr("href", (d) =>
      fixInternalLinks(`/registries/${d.key}/${makeSafe(d.value)}`)
    )
    .html((d) => {
      if (d.value.length > 30) return `${d.value.slice(0, 30)}…`;
      else return d.value;
    });

  /*
  transcript.selectAll("p").each(function () {
    const sel = d3.select(this);
    const txt = this.textContent.trim();
    const { text, ...metadata } = parseMetadata(txt, [
      "sdgs",
      "thematic_areas",
      "continent",
      "country",
    ]);

    if (Object.keys(metadata).length) {
      const div = d3
        .select(this.parentNode)
        .insertElem(
          (_) => this.nextElementSibling,
          "div",
          "annotated-paragraph"
        );

      sel.moveTo(div.node()).html(text);

      const chips = div.addElem("div", "chips");
      for (let key in metadata) {
        chips
          .addElems("button", `chip ${key.replace("-")}`, ["continent", "country"].includes(key) ? [] : metadata[key]) // THE CONTINENT AND COUNTRY TAGS ARE PLACED ABOVE IN THE TITLE SECTION
          .addElem("label")
          .addElem("a")
          .attr("href", (d) => `${basePath}/elements/${key}/?doc=${d}`)
          .html((d) => {
            if (d.length > 30) return `${d.slice(0, 30)}…`;
            else return d;
          });
      }
    }
  });
  */
};
export const registry = function (text, source) {
  let html = marked.parse(text);
  // The content needs to be set before the title section because h1 is moved out of it below
  const content = d3.select("section.content > div.inner");
  const transcript = content.addElem("div", "transcript").html(html);

  const levels = transcript.selectAll("h2").each(function () {
    d3.select(this).attr("id", makeSafe(this.textContent.trim()));
  });

  const cartouche = content
    .addElems("div", "cartouche")
    .addElems("menu", "registry")
    .addElems(
      "li",
      "level",
      [...levels.nodes()].map((d) => d.textContent.trim())
    )
    .addElems("a")
    .attr("href", (d) => `#${makeSafe(d)}`)
    .html((d) => d);

  const url = new URL(document.location);
  let path = url.pathname.split("/").filter((d) => d.length);

  const titleSection = d3.select("section.title > div.inner");
  titleSection
    .addElems("button", "chip breadcrumb", path)
    .addElem("label")
    .addElem("a")
    .attr("href", (d, i) => `/${path.slice(0, i + 1).join("/")}`)
    .html((d) => d);
  transcript.select("h1").moveTo(titleSection.node());

  // Add a link to edit the file directly in Github
  titleSection
    .addElem("a", "edit-link")
    .attr("href", (_) => {
      // `source` is provided by getTranscript and may be like '/pages/File.md', 'README.md', '../pages/File.md', etc.
      // Normalize it to a repository-relative path and point to the correct repo.
      let src = String(source || "");
      // remove any parent-directory references and leading slashes
      src = src.replace(/\.\.\//g, "").replace(/^\//, "");
      // Fallback: if empty, point to repo root README
      if (!src) src = "README.md";
      return `https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons/edit/gh-pages/${encodeURIComponent(
        src
      )}`;
    })
    .attr("target", "_blank")
    .html("Edit this page");

  transcript.selectAll("h2").each(function () {
    const txt = this.textContent.trim();
  });

  /*
  transcript.selectAll("p").each(function () {
    const sel = d3.select(this);
    const txt = this.textContent.trim();
    const { text, ...metadata } = parseMetadata(txt, [
      "sdgs",
      "thematic_areas",
      "continent",
      "country",
    ]);

    if (Object.keys(metadata).length) {
      const div = d3
        .select(this.parentNode)
        .insertElem(
          (_) => this.nextElementSibling,
          "div",
          "annotated-paragraph"
        );

      sel.moveTo(div.node()).html(text);

      const chips = div.addElem("div", "chips");
      for (let key in metadata) {
        chips
          .addElems("button", `chip ${key.replace("-")}`, ["continent", "country"].includes(key) ? [] : metadata[key]) // THE CONTINENT AND COUNTRY TAGS ARE PLACED ABOVE IN THE TITLE SECTION
          .addElem("label")
          .addElem("a")
          .attr("href", (d) => `${basePath}/elements/${key}/?doc=${d}`)
          .html((d) => {
            if (d.length > 30) return `${d.slice(0, 30)}…`;
            else return d;
          });
      }
    }
  });
  */
};

export const footnote = function (text, source) {
  const html = marked.parse(text);
  const transcript = d3
    .select("section.content")
    .addElem("div", "footnote")
    .html(html);
};
