import { d3_extended as d3 } from "./d3.extensions.mjs";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { makeSafe, capitalize, fixInternalLinks } from "./helpers.mjs";
import { setupSVG } from "./widgets.mjs";

import {
  tagLookup,
  parseMetadata,
  parseTimestamps,
  convertStringToSeconds,
} from "./parsers.mjs";

function fetchTranscript(path) {
  return fetch(decodeURI(path)).then(async (res) => {
    if (res.ok) return res.text();
    else throw new Error("Could not find file.");
  });
  // WE DO NOT USE CATCH HERE AS WE NEED TO CHECK FOR THE ERROR IN THE getTranscript FUNCTION
}

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const basePath = isLocal ? "" : "/RnD-Archive";

export const getTranscript = async function (path) {
  let transcript = "";
  let usedSource = path;
  try {
    transcript = await fetchTranscript(path);
  } catch (err) {
    if (path.startsWith("./")) {
      try {
	      const upPath = path.replace(/^(.)?\//, "../");
	      transcript = await fetchTranscript(upPath);
	      usedSource = upPath;
	    } catch (err) {
	    	console.log(err);
	    }
    }
  }
  return { transcript, usedSource };
};
export const transcript = function (text, source) {
  const alltags = [...(new Set([...text.matchAll(tagLookup)].map(d => {
    return d[0].replace(/[\[\]]/g, '').split(':')[0];
  })) || [])];

  const { text: parsed_text, ...metadata } = parseMetadata(text, alltags);
  let html = marked.parse(parsed_text);
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

  // The content needs to be set before the title section because h1 is moved out of it below
  const content = d3.select("section.content > div.inner");
  const transcript = content.addElem("div", "transcript").html(html);

  // Add target blank to all hyperlinks
  transcript.selectAll("a").attr("target", "_blank");

  const cartouche = content.addElems("div", "cartouche").addElem("div", "inner")
  const c_sections = cartouche.addElems("div", "c-section", d => {
    const obj = [];
    if (country?.length > 0 || latlng?.length > 0) obj.push({ key: 'Locations', locations: latlng, values: [...(new Set(country) || [])] });
    if (sdgs?.length > 0) obj.push({ key: 'SDGs', values: [...(new Set(sdgs) || [])].sort((a, b) => parseInt(a.match(/\d+/) || 0) - parseInt(b.match(/\d+/) || 0)) });
    if (gender?.length > 0) obj.push({ key: 'Gender of the innovator', values: [...(new Set(gender) || [])] });
    if (year?.length > 0) obj.push({ key: 'Year', values: [...(new Set(year) || [])] });
    for (let k in othertags) {
      obj.push({ key: capitalize(k), values: [...(new Set(othertags[k]) || [])] });
    }
    return obj;
  }).each(function (d) {
    d3.select(this).classed(makeSafe(d.key), true);
  });
  c_sections.addElems("h3", null, d => d.key !== 'Locations' ? [d] : []).html(d => d.key.replace(/_/g, ' '));
  c_sections.each(async function (d) {
    const sel = d3.select(this);
    const { key, locations } = d || {};

    if (key === 'Locations' && locations?.length > 0) {
      // Add a map
      const canvas = sel.addElems('div', 'canvas');
      const { width, height, svg } = setupSVG(canvas, 'map');

      const landmass = await d3.json(fixInternalLinks('/public/data/topo/landmass.topojson'));
      const geolandmass = topojson.feature(landmass, landmass.objects.landmass);

      const points = turf.featureCollection(locations.map(c => {
        return turf.point(c.split(',').map(b => parseFloat(b)).reverse());
      }));

      const proj = d3.geoNaturalEarth1()
      .fitExtent([
        [10, 10],
        [width - 10, height - 10]
      ], geolandmass);

      const path = d3.geoPath(proj);

      svg.addElems('path', 'landmass', [geolandmass])
        .attr('d', path);
      svg.addElems('path', 'buffer', [points])
        .attr('d', path)
        .style('fill', '#000');      
    }
  });
  c_sections.addElems("div", "tags", d => [d.values.map(c => { return { key: d.key, value: c } })])
    .addElems("button", "tag", d => d)
    .each(function (d) {
      d3.select(this).classed(d.key.toLowerCase(), true);
    }).addElem("label")
    .addElem("a")
    // TO DO: MAKE LINKS WORK
    // .attr("href", (d) => `${basePath}/elements/${d.key}/?doc=${d.value}`) // TO DO: REPLACE THIS
    .html((d) => {
      if (d.value.length > 30) return `${d.value.slice(0, 30)}…`;
      else return d.value;
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
  titleSection.addElems("p", "contributors", [[...(new Set(focal_point) || [])]])
  .html(d => {
    return `Documented by ${d.join(', ')}`
  });

  // Add a link to edit the file directly in Github
  titleSection
    .addElem("a", "edit-link")
    .attr("href", (_) => {
      const moveup = source.match(/\.\.\//g)?.length;
      let gitpath = path;
      if (moveup) gitpath = path.slice(0, moveup * -1);
      // TO DO: REPLACE THIS URL
      return `https://github.com/UNDP-Accelerator-Labs/RnD-Archive/edit/main/${source.replace(
        "../",
        ""
      )}`;
    })
    .attr("target", "_blank")
    .html("Edit this page");

  const chips = titleSection.addElems("div", "tags")
    .addElems("button", "tag", thematic_areas.map(c => { return { key: 'thematic_areas', value: c } }))
      .each(function (d) {
        d3.select(this).classed(d.key, true);
      })
    .addElem("label")
    .addElem("a")
    .attr("href", d => fixInternalLinks(`/registries/${d.key}/${makeSafe(d.value)}`))
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

  const levels = transcript.selectAll("h2")
  .each(function () {
    d3.select(this).attr("id", makeSafe(this.textContent.trim()));
  });

  const cartouche = content.addElems("div", "cartouche")
  .addElems("menu", "registry")
  .addElems("li", "level", [...levels.nodes()].map(d => d.textContent.trim()))
  .addElems("a")
    .attr("href", d => `#${makeSafe(d)}`)
  .html(d => d);
  
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
      const moveup = source.match(/\.\.\//g)?.length;
      let gitpath = path;
      if (moveup) gitpath = path.slice(0, moveup * -1);
      // TO DO: REPLACE THIS URL
      return `https://github.com/UNDP-Accelerator-Labs/RnD-Archive/edit/main/${source.replace(
        "../",
        ""
      )}`;
    }).attr("target", "_blank")
    .html("Edit this page");

  transcript.selectAll("h2")
  .each(function () {
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
	const transcript = d3.select("section.content")
	.addElem("div", "footnote")
	.html(html);
}
