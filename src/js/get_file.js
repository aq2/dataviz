// start point for the app

function preload() {   // eslint-disable-line
  select('#exTableDiv')
    .hide()
  
  select('#chooseViz')
    .hide()
}


function setup() {    // eslint-disable-line
  // setup dropzone

  let dzHtml = `<p>drop data file here</p>
                <p id='dzError'>must be text (eg csv) and less than 10kB</p>`

  // createP(dzHtml)
  //   .id('dz')
  //   .drop(gotFile)
  //   .position(20,80)
  //   .addClass('border')
  //   .addClass('lighter')
  //   .dragOver(highlight)
  //   .dragLeave(unhighlight)


    let bQ = new Qdiv('barQ', 10, 10, 200, 100, 'foo')

    let bD = select('#barQ')
              .html('<p>bazbaz</p>')
    // rollup('#barQ', 10, 10, 100, 100, 'rolledup')

    bQ.roller(10, 205, 'tits')
    let fh = bQ.finalHTML
    console.log('fh ' + fh)
    

    // let bq = select('#barQ')
    // console.log('bg.fH ' + fh)


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

    // // qq- new stuff!
    // need a method here for divs or see boook!
    // dz.rollup(newX, newY, newW, newH, newHTML)

    // old-skool stylee
    // rollup(dz, newX, newY, etc)
    rollup('#dz', 10, 10, 100, 100, 'foo')

    

    // original G
    // dz.html('1 - Data')
    //   .size(80,30)
    //   .class('rolledUp')
    
    // var dz2 = select('#dz')

    console.log('orig is ' + dz.origHTML)
    // console.log(dz2.html())


    // todo disable or change dz event handler

    select('#exTableDiv')
      .position(20, 180)
      .show()

    // processFile belongs in process_file.js
    processFile(file.data)            // eslint-disable-line
  }
}



// function rollup(divID,x,y,w,h,newHTML) {
//   var thisDiv = select(divID)
//   // console.log('rU: thisDiv.html = ' + thisDiv.html())
  
//   this.finalHTML = thisDiv.html()
//   // thisDiv.origHTML = thisDiv.html()
//   console.log('rU: thisDiv.finalHtml = ' + this.finalHTML)

//   thisDiv.size(w,h)
//                 .position(x,y)
//                 .html(newHTML)
//                 .class('rolledUp')

//   // this.origHTML = thisDiv.innerHTML

//   return this
// }


var Qdiv = function (name, ox, oy, ow, oh, oHTML) {
  this.name = name
  this.ox = ox
  this.oy = oy
  this.ow = ow
  this.oh = oh
  this.oHTML = oHTML
  this.fHTML = ''

  //define roller here without prototype?

  createDiv(oHTML)
      .id(name)
      .drop(gotFile)
      .position(20,180)
      .addClass('border')
      .addClass('lighter')
}

Qdiv.prototype.roller = function(x, y, ht) {
  var thisDiv = select('#' + this.name)
  this.finalHTML = thisDiv.html()

  select('#' + this.name)
  .size(x,y) 
  .html(ht)

  return this
}
