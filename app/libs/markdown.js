var marked = require('marked');
var _ = require('lodash');

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


function makeMarkerLink(text, id, placeIds, places) {

  // 실제로 등록된 장소만 링크를 걸어준다. 
  _.each(placeIds, function(pid){

    var p = _.find(places, function(pl){ return pl.id === pid});
    if( p ) {
      let regx = RegExp(`\\[([^\\[\\]]*)\\]\\[${pid}\\]`);
      text = text.replace(regx, `<a target="_blank" href="/notes/${id}/places/${pid}"><i class="fa icon-pin"></i>$1</a>`);
    }
  });

  // 장소ID를 잘못 입력하면 그냥 없애준다. 
  return text.replace(/\[([^\[\]]*)\]\[([a-zA-Z0-9]{10})\]/g, `$1`)
}

export function render (text, noteId, placeIds, places) {

  text = marked(text);
  text = makeMarkerLink(text, noteId, placeIds, places);
    
  return text;
}