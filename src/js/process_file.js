// process CSV data into more usable form

let rawData,
    alphaField = -1,
    catData = {cats: [], rankables: [], maxis: [], idCat: -1, iDn: ''}
 

function processFile(data) {               // eslint-disable-line
  rawData = data

  // make html for table and stick it in    
  let tableHtml = makeExampleTableHtml(data)  
  
  select('#exTable')
    .html(tableHtml)

  select('#measRow')
    .addClass('light')   
  
  createButton('OK')
    .parent(select('#catBtnPos'))
    .mousePressed(getRankables)

  // control now passed to getrankables()
}


// make example table, inc select rankables
function makeExampleTableHtml(data) {

  let c,                    // looper 
      val,                  // looper value
      myHtml,               // string of html
      candidates = [],      // array containing two example candidates
      categories = [],      // array of category names

  // get first three rows
  exampleData = data.split('\n', 3)
  categories = exampleData[0].split(',')
  catData.cats = categories
  candidates.push(exampleData[1].split(','), exampleData[2].split(','))

  // build up HTML for table
  myHtml = "<tr><th>criteria:</th>"
  // show each category
  for (c of categories) {
    myHtml += '<th>' + c + '</th>'
  }
  myHtml += '<th></th></tr>'

  // show two example candidates
  let i = 0  // yuck!
  for (c of candidates) {    
    myHtml += '<tr class="cand"><td>example data</td>'
    for (val of c) {
      if (isNaN(Number(val))) {
        // it's propably alpha
        alphaField = i
      }
      myHtml += '<td>' + val + '</td>'
    }
    i++
    myHtml += '<th></th></tr>'
  }

  // show rankables row
  myHtml += '<tr id="measRow"><td>select rankable criteria</td>'
  for (c in categories) {
    myHtml += "<td><input type='checkbox' id='cat" + c + "'>"
  }
  myHtml += "<td id='catBtnPos'></td></tr>"

  // make other rows, empty for now
  myHtml += "<tr id='minmaxRow'></tr>"
  myHtml += "<tr id='idRow'></tr>"
  // for instructions and error
  myHtml += "<tr><td colspan='" + (c+2) +"' id='outputCell' class='green'>"
  myHtml += "select categories to rank by - need at least two"
  myHtml += "</td></tr>"

  return myHtml
}


// rankables click handler
function getRankables() {
  let i = 0,
      catLength = catData.cats.length
  
  // check each checkbox, add to rankables[] if checked
  for (i; i<catLength; i++) {
    if (select('#cat' + i).checked()) {
      catData.rankables.push(i)
    } 
  }
  
  // if at least two rankables
  if (catData.rankables.length < 2) {
    // todo error message, wobble button?? 
    return false
  }

  select('#measRow').class('dark')

  getMaxis()
}


function getMaxis() {
  let i = 0,
      length = catData.cats.length,
      html = '<td>high value is better</td>'

  // for each measurable, add checkbox
  for (i; i<length; i++) {
    html += "<td>"
    if (catData.rankables.indexOf(i) != -1) {
      html += "<input type='checkbox' id='max" + i + "'>"
    } 
    html += "</td>"
  }
  html += "<td id='minmaxBtnPos'></td></tr>"

  select('#minmaxRow')
    .html(html)
    .class('light')

  select('#outputCell')
    .html('default is lower values are better')

  createButton('OK')
    .parent(select('#minmaxBtnPos'))
    .mousePressed(getID)
}


function getID() {
  let i = 0,
      length = catData.cats.length,
      html = "<td>select one id field</td>"

  select('#minmaxRow')
    .class('dark')

  select('#idRow')
    .class('light')

  // for each category max checkbox, add to maxis[] if checked, and build iD row
  for (i; i<length; i++) {
    html += "<td><input type='radio' name='iD' value='" + i + "' id=radio" + i + "></td>"
    if (catData.rankables.indexOf(i) != -1) {
      if (select('#max' + i).checked()) {
        catData.maxis.push(i)
      } 
    }
  }

  html += "<td id='idBtnPos'></td></tr>"

  select('#idRow')
    .html(html)

  // check alphafield radio button - choose alpha by default
  document.getElementsByName("iD")[alphaField].checked = true
  
  select('#outputCell')
    .html('choose a category to use as identifier - eg name')

  createButton('OK')
    .parent(select('#idBtnPos'))
    .mousePressed(makeData)
}


function makeData() {
  let i = 1,
      j = 0,
      numb,
      prop,
      rawCand,
      propname,
      candidate = {},
      candidates = [],
      someData = rawData.split('\n'),
      len = someData.length,
      the1 = document.querySelector('input[name="iD"]:checked').value
  
  catData.idCat = the1
  catData.iDn = catData.cats[the1]

  // now make data table - rawData is still one big string

  // todo fugly hacky loops going on in here
  // for each rawCandidate, change into formatted candidate
  for (i; i<len-1; i++) {
    candidate = {}
    candidate['key'] = i - 1
    rawCand = someData[i].split(',')
    
    for (prop of rawCand) {
      propname = catData.cats[j]
     
      // if prop value is alpha, trim it, else just use the numeric val      
      prop = (isNaN(numb=Number(prop))) ? prop.trim() : numb

      // fugling hacky
      j = (j == catData.cats.length - 1) ? -1 : j      
      j++
      // j = (j == catData.cats.length - 1) ? 0 : j++  // why no work

      candidate[propname] = prop
    }
    candidates.push(candidate)
  }
  console.table(candidates)


  // rollup table
  select('#exTable')
  .hide()

  select('#exTableDiv')
    .position(150, 80)
    .size(100, 50)
    .class('darker')
    .html('2 - Criteria')
    // .show()

  getViz()
}


function getViz() {
  let vt,
      vizRadio = createRadio(),
      vizDiv = select('#chooseViz'),
      vizTypes = ['pareto', 'parallel'],
      vizBtn = createButton('ok')
                 // .parent(vizDiv)
                 .mousePressed(vizzed)

  // for each vizType
  for (vt of vizTypes) {
    vizRadio.option(vt)
  }

  // to place button to left of radio
  vizBtn.parent(vizDiv)
  vizRadio.parent(vizDiv)
  
  vizDiv
    .position(280, 80)
    .show()


  function vizzed() {
    let vizType = vizRadio.value()
    // todo - yuck! - vizType() - could use evil eval, but...

    switch (vizType) {
      case 'pareto':
        pareto()
        break
      case 'parallel':
        parallel()
        break
      default: {}
    }
  }

}

function pareto() {
  console.log('pareto')
}

function parallel() {
  console.log('parallel')  
}
