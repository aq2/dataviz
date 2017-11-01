// start point for the app

function preload() {   // eslint-disable-line
  select('#exTableDiv')
    .hide()
}


function setup() {    // eslint-disable-line
  // setup dropzone
  select('#dz')
    .drop(gotFile)
    .dragOver(highlight)
    .dragLeave(unhighlight)
}


function highlight(evt) {
  this.style('filter', 'brightness(1.15)')
  evt.preventDefault()
}


function unhighlight(evt) {
  this.style('filter', 'brightness(1.0)')
  evt.preventDefault()
}


function errorMsg(id) {
  // let iid = '#' + id
  select('#' + id)
  .style('background', COL.brown)
}


function gotFile(file) {
  // todo file should have at least three lines, header, cand1, cand2
 
  if (file.type != 'text') {
    errorMsg('dzText')
    return
  }

  if (file.size > 10000) {
    errorMsg('dzSize')
    return
  }
 
  select('#dz')
    .html('file OK')
    .removeClass('wideDz')
    .addClass('narrowDz')
  
  // todo disable or change dz event handler
  
  select('#critBox')
    .style('opacity', '1')

  select('#exTableDiv')
    .position(20, 180)
    .show()

  // processFile belongs in process_file.js
  processFile(file.data)            // eslint-disable-line
}

