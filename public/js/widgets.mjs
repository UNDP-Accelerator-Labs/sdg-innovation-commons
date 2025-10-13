import { d3_extended as d3 } from "./d3.extensions.mjs";

export const setupSVG = function (sel, classname) {
  const {
    clientWidth: cw,
    clientHeight: ch,
    offsetWidth: ow,
    offsetHeight: oh,
  } = sel.node();
  const width = cw ?? ow;
  const height = ch ?? oh;

  const svg = sel.addElems('svg', classname ? classname : null)
    .attr('x', 0)
    .attr('y', 0)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  return { width, height, svg };
}

export const activateScrollTop = function () {
	// ADD THE BACK TO TOP BUTTON INTERACTION
	// When the user clicks on the button, scroll to the top of the document
	const button = d3.select('button#back-to-top')
  .on('click', _ => {
	  document.body.scrollTop = 0; // For Safari
	  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	});

  let pos = document.documentElement.clientHeight || document.documentElement.offsetHeight;

  window.addEventListener('scroll', _ => {
    let moving = window.pageYOffset;
    // Set visibility
    button.classed('hide', pos > moving);
  });
}