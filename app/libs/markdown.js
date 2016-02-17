var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: true
});


function makeMarkerLink(text, id) {
  return text
    .replace(/\[([^\[\]]*)\]\[([a-zA-Z0-9]{10})\]/g, `<a target="_blank" href="/notes/${id}/places/$2"><i class="fa icon-pin"></i>$1</a>`)
}

export function render (text, noteId) {

  text = marked(text);
  text = makeMarkerLink(text, noteId);
    
  return text;
}