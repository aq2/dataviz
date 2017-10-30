// start point for the app

function preload() {   // eslint-disable-line
  select('#exTableDiv')
    .hide()
  
  select('#chooseViz')
    .hide()
}


function setup() {    // eslint-disable-line
  // setup dropzone  
  select('#dz')
    .position(20,80)
    .drop(gotFile)
    .dragOver(highlight)
    .dragLeave(unhighlight)
}


function highlight(evt) {
  this.class('lightest').addClass('border')
  evt.preventDefault()
}


function unhighlight(evt) {
  this.class('lighter').addClass('border')
  evt.preventDefault()
}


function gotFile(file) {
  var errMsg = ''
  let dz = select('#dz')
           .class('darker')
  
  // check file type and size
  file.type != 'text' ? errMsg='can only accept text files': false
  file.size > 10000 ? errMsg='file too big - max 10kB': false

  // todo file should have at least three lines, header, cand1, cand2

  // if no error, do some css and move on to process = getMeasurables etc
  if (errMsg) {
    dz.html(errMsg)
    // wobble?
  } else {
    // good to go

    dz.html('1 - Data')
      .size(80,30)
      .class('rolledUp')
    
    // todo disable or change dz event handler

    select('#exTableDiv')
      .position(20, 180)
      .show()

    // processFile belongs in process_file.js
    processFile(file.data)            // eslint-disable-line
  }
}
