getData("/data/miniergug2009.csv")

function parseCsv(csvFile) {
  d3.csv(csvFile, (d) => {
    return { 
      d
    }
  }, (csvData) => {
    console.table(csvData)
    var headers = getHeaders(csvFile)
  })
}

function getData(csvFile) {
  d3.csv(csvFile, function(d) {
    // yy this bit loops over each row as d
    console.log(d)

    return {
      // yy then this makes a new object, with custom props

      // todo replace by looping over d.categories
      // low numbers are better
      
      // rank: +d.rank,    // need + to convert string into number
      // name: d.name.trim(),
      // // nss: d.nss,
      // research: parseInt(d.research*100),
      // ratio: parseInt(d.ratio*100),
      // // spends: parseInt(d.spends*100),
      // entry: parseInt(d.entry*100),
      // // completion: parseInt(d.completion*100),
      // honours: parseInt(d.honours*100),
      // prospects: parseInt(d.prospects*100),
      // // extra attributes
      // dom_by: [],       // array of uni keys that dominates this
      // dominates: [],    // array of keys that this dominates
      // front: -1
    }
  }, (csvUnis) => {
    // console.table(csvUnis)
    // var uniData = buildUniData(csvUnis)  // include categories and dom data
    // findAllFronts(uniData)
  })
}



// get uni list from csv file
function getUnis(csvFile) {
  d3.csv(csvFile, function(d) {
    return {
      // todo replace by looping over d.categories
      // low numbers are better
      rank: +d.rank,    // need + to convert string into number
      name: d.name.trim(),
      // nss: d.nss,
      research: parseInt(d.research*100),
      ratio: parseInt(d.ratio*100),
      // spends: parseInt(d.spends*100),
      entry: parseInt(d.entry*100),
      // completion: parseInt(d.completion*100),
      honours: parseInt(d.honours*100),
      prospects: parseInt(d.prospects*100),
      // extra attributes
      dom_by: [],       // array of uni keys that dominates this
      dominates: [],    // array of keys that this dominates
      front: -1
    }
  }, (csvUnis) => {
    console.table(csvUnis)
    var uniData = buildUniData(csvUnis)  // include categories and dom data
    findAllFronts(uniData)
  })
}


// create uniData object which contains domination data and cat/measurables
function buildUniData(csvUnis) {
  // build categories/measurables only once and store it in uniData obj
  var categories = getCategories(csvUnis[1])
  // var domUnis = contest(csvUnis, categories) 
  var uniData = { 
    unis: csvUnis,
    categories: categories
  }
  // todo? include new measurables array as new property
  return uniData
}


// main loop - recieves all uniData including dominance
function findAllFronts(uniData) {
  var categories = uniData.categories
  var currentFront = 0

  var unis = uniData.unis                   // ALL unis - no dom data yet
  
  var domUnis = contest(deepClone(unis), categories) // All unis + dom
  
  var unisLeft = deepClone(unis)                  // TEMP uni + dom - we'll trim it away

  // main loop
  while (unisLeft.length) {
    currentFront++
    // console.log('front:' + currentFront)
    var paretoUnis = getParetoFront(unisLeft)

    for (var paretoUni of paretoUnis) {
      // update front data -> get uni from key and update?
      var frontUni = domUnis.find(u => u.rank === paretoUni)
      // console.log(frontUni.name)
      frontUni.front = currentFront
      
      // remove from unisLeft
      unisLeft = unisLeft.filter(u => u.rank != paretoUni)
      
      for (var uni of unisLeft) {
        // if pareto uni exists in dom_by, remove it
        if (uni.dom_by.indexOf(paretoUni) != -1) {
          uni.dom_by = uni.dom_by.filter(u => u != paretoUni)
          // console.log(uni.name + ' has had ' + frontUni.name + ' removed. new array is ' + uni.dom_by)
        }
      }
    }
    console.log(' ')
  }
  // all done
  // console.table(domUnis)

  // start building graphic
  buildGraphic(domUnis)
}


// get list of categories
// todo - programmatically with UI
function getCategories(uni) {
    var i = 0
    var categories = []
    // not all categories are measured, eg - name
    for (var category in uni) {
      var measured = 0
      if ((i>1) && (i<7)) {
        measured = 1
      }
      var cat = {
        name: category,
        measurable: measured
      }
      categories.push(cat)
      i++
    }
    // console.table(categories)
    return categories
}


function contest2(unis, measurables) {
  // we add data to uniFinalData and return it, whilst popping unis
  var uniFinalData = deepClone(unis)
  var length = unis.length
  while (length--) {
    var uni1 = unis.pop()
    for (uni2 of unis) {
      /* 
      bestUni = compare(uni1, uni2) -> returns uni1, uni2, equal or none
        // OR return comparisons array? not if we don't need to store it
        // OR return pass it newUNIS object {uni1, uni2} -> return uni.ranks
        // no - too much, just send it u1,u2 -> return key - no point returning uni, as we need to update uni in other copy!
        // return 1,2,0,-1 => equals an enum or summat!
        // surely there's a simpler way!
      update unis dom and dom_by in uniFinalData
        but how?
        if compare.typeOf = object
          -> update dom and dom_by - can still refer to uni1,2
          // err, need to refer to ranks
          // aagh more complicated than needs be!
          //
        else
          -> equal or meh
          -> equal extreme corner case 
         



      */ 
    }
  }
}



// mega 'tournament' between unis - who dominates who
function contest(unis, categories) {
  console.log('****** DOING CONTEST *****')
  // big compare loop
  var u = unis.length
  // for each uni
  for (var i=0; i<u-1; i++) {
    var uni1 = unis[i]
    // then for each other uni in turn
    for (var j=i+1; j<u; j++) {
      var uni2 = unis[j]
      // compare uni1 with uni2
      // console.log(i, j)
      var comparisons = compareUnis(unis[i], unis[j], categories)

      // todo - too much pushing
      // if at least one 1 and no -1's : uni1>uni2
        // console.log(comparisons)
      if ((comparisons.indexOf(1) > -1) && (comparisons.indexOf(-1) === -1)) {
        // console.log(uni1.name + ' dominates ' + uni2.name + ' ' +  comparisons)
        // console.log(uni2.name + ' dominated by ' + uni1.name + ' ' + comparisons)
        uni1.dominates.push(uni2.rank)
        uni2.dom_by.push(uni1.rank)
      } else if ((comparisons.indexOf(-1) > -1) && (comparisons.indexOf(1) === -1)) {
        // if at least one -1 and no 1's : uni2>uni1
        // console.log(uni2.name + ' dominates ' + uni1.name + ' ' +  comparisons)
      
        // console.log(uni1.name + ' dominated by ' + uni2.name + ' ' + comparisons)
        // uni2.dominates.push(uni1.rank)
        // uni1.dom_by.push(uni2.rank)
      } else if ((comparisons.indexOf(1) === -1) && (comparisons.indexOf(-1) === -1)) {
        // if all zeroes (ie no 1s or -1s, then equal)
        console.log(uni1.name + ' equal to! ' + uni2.name + ' ' + comparisons)
      } else {
        // meh - no dominance = better in some criteria, worse in others
        // console.log(uni1.name + ' meh ' + uni2.name + ' ' + comparisons)
      }      
    }
  }
  return unis
}


function getParetoFront(unis) {
  var pareto = []
  // iterate through unis, finding non-dominated
  for (var uni of unis) {
    if (uni.dom_by.length == 0) {
      pareto.push(uni.rank)
    }
  }
  // console.table(pareto)
  return pareto
}


// return comparison array [1,0,0,-1 etc]
function compareUnis(uni1, uni2, categories) {
  var comparisons = []
  for (var category of categories) {
    if (category.measurable) {
      var catName = category.name
      // console.log(catName + ' for ' + uni1.name + ':' + uni1[catName] + ' and for ' + uni2.name + ':' + uni2[catName] )
      if (uni1[catName] < uni2[catName]) {
        comparisons.push(1)
      } else if (uni1[catName] == uni2[catName]) {
        comparisons.push(0)
      } else {
        comparisons.push(-1)
      }
    }
  }
  // console.log('comp ' + comparisons)
  return comparisons
}


// pinched from interwebs
function deepClone(o) {
   var output, v, key
   output = Array.isArray(o) ? [] : {}
   for (key in o) {
       v = o[key]
       output[key] = (typeof v === "object") ? deepClone(v) : v
   }
   return output
}


function buildGraphic(unis) {
  // make new array of objects containing only needed data
  var gfxData = getGfxData(unis)

  // set up canvas etc
  // for each shell,
  // -> draw nodes evenly spaced across canvas
  // -> for each node
  // -> -> does it dominate one below (or vv)
  // -> -> -> if so, draw edge 

}



// extract useful info for d3 'tree'
function getGfxData(unis) {
  // what do we need?
  // for each uni: name, dom_by, dominates, front
  // todo imp oh no, we need a new fronts object
  // {front: 1, unis[{key: 0, name:'Oxford', domInNext:[x,y,z]}], n_nextShell: 7}
  // calculate these all only once, and access as necess
  // from this data: x,y of nodes in this shell and below can be calculated
  // and necessary domLinks drawn
  var gfxData = []
  var u = 0
  var l = unis.length
  for (u=0; u<l; u++) {
    var oldUni = unis[u]
    var newUni = {
      name: oldUni.name,
      dom_by: oldUni.dom_by,
      dominates: oldUni.dominates,
      front: oldUni.front
    }
    gfxData.push(newUni)
  }
  console.table(gfxData)
  return gfxData
}



