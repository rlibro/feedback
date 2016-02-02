function makeMarkerLink(text, id) {
  return text
    .replace(/\[([^\[\]]*)\]\[(\d+)\]/g, `<a target="_blank" href="/notes/${id}/places/$2"><i class="fa icon-pin"></i>$1</a>`)
    .replace(/(.*)\n\n(.*)/g, '<p>$1</p><br/><p>$2</p>')
    .replace(/(.*)\n(.*)/g, '<p>$1</p><p>$2</p>')
    .replace(/\s\s/g, '<span></span>');
}

function makeLink(text) {

  return text
    .replace(/\[([^\[\]]*)\]\((https?:\/\/[^\(\)]*)\)/g, `<a target="_blank" href="$2"><i class="fa icon-pin"></i>$1</a>`)
}

export function render (text, noteId) {

  text = makeMarkerLink(text, noteId);
  text = makeLink(text);


  return text;
}