var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: true
});


function makeMarkerLink(text, id) {
  return text
    .replace(/\[([^\[\]]*)\]\[(\d+)\]/g, `<a target="_blank" href="/notes/${id}/places/$2"><i class="fa icon-pin"></i>$1</a>`)
    //.replace(/(.*)\n\n(.*)/g, '<p>$1</p><br/><p>$2</p>')
    //.replace(/(.*)\n(.*)/g, '<p>$1</p><p>$2</p>')
    //.replace(/\s\s/g, '<span></span>');
}

export function render (text, noteId) {

  text = marked(text);
  text = makeMarkerLink(text, noteId);
    
  return text;
}