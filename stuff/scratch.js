function getUnis(csvFile) {
  d3.csv(csvFile, function(d) {
    // console.log(d)
    
    return {
      // todo replace by loping over d.categories
      // d
      // low numbers are better
      rank: +d.rank,    // need + to convert string into number
      name: d.name.trim(),
      // nss: d.nss,
      research: parseInt(d.research*100),
      ratio: parseInt(d.ratio * 100),
      // spends: parseInt(d.spends * 100),
      entry: parseInt(d.entry * 100),
      // completion: parseInt(d.completion * 100),
      honours: parseInt(d.honours * 100),
      prospects: parseInt(d.prospects * 100),
      extra attributes
      dom_by: [],       // array of uni keys that dominates this
      dominates: [],    // array of keys that this dominates
      front: -1
    }
  }, (unis) => {
    console.table(unis)
    // findFronts(unis)
    // for (uni of unis) {
    //   console.log(uni)
    // }
  })
}



// shows categories and checkboxes
function showCategories(categories) {
  // build up fieldset contents
  var html = ''
  var j = 0
  for (var c of categories) {
    html += "<div><input type='checkbox' id='cat" + j + "'"
    html += "<label for='" + c + "'>" + c + "</label></div>"
    html += "<div><input type='radio' id='cat" + j + "'"
    j++ 
  }
  document.getElementById('boxes').innerHTML = html
}




// from here george

function findFronts(unis) {
  // console.table(unis)
  var categories = getCategories(unis[1])
  // console.table(categories)
  var front = 1
  var unis = unis

  // main loop

  var nextFront = getNextFrontByNonDomination(unis, categories)

  // while (unis.length > 0) {
  //   console.log("** front: " + front + ' **')

  //   // var nextFront = getNextFrontByBestInCat(unis, categories)
  //   var nextFront = getNextFrontByNonDomination(unis, categories)

  //   // unis = addToFrontandRemove(nextFront, front, unis)
  //   // front++
  // }
  console.table(unis)
}


function getCategories(uni) {
    // get list of categories
    var i = 0
    var categories = []
    // not all categories are measured, eg - name
    for (var category in uni) {
      var measured = 0
      if ((i>1) && (i<10)) {
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


function getNextFrontByNonDomination(unis, categories) {
  // pareto front includes all non-dominated unis
  // for each uni1
  // -> for each other uni2
  //   -> is uni1 dominated by uni2
  //   -> -> yes: record uni1.domBy, record uni2.dominates -> uni1 NOT in pareto
  //   -> -> no:
  // compareUnis(unis[72], unis[84], categories)

  // var unis = unis
  // var cattedUnis = dominator(unis, categories)


  // // big compare loop
  // var u = unis.length
  // // for each uni
  // for (var i=0; i<u-1; i++) {
  //   var uni1 = unis[i]
  //   // then for each other uni in turn
  //   for (var j=i+1; j<u; j++) {
  //     var uni2 = unis[j]
  //     // compare uni1 with uni2
  //     var comparisons = compareUnis(unis[i], unis[j], categories)

  //     // if at least one 1 and no -1's : uni1>uni2
  //     if ((comparisons.indexOf(1) > -1) && (comparisons.indexOf(-1) == -1)) {
  //       // console.log(uni1.name + ' dominates ' + uni2.name + ' ' +  comparisons)
  //       uni1.dominates.push(uni2.rank)
  //       uni2.dom_by.push(uni1.rank)
  //     } else if ((comparisons.indexOf(-1) > -1) && (comparisons.indexOf(1) == -1)) {
  //       // if at least one -1 and no 1's : uni2>uni1
  //       // console.log(uni1.name + ' dominated by ' + uni2.name + ' ' + comparisons)
  //       uni2.dominates.push(uni1.rank)
  //       uni1.dom_by.push(uni2.rank)
  //     } else if ((comparisons.indexOf(1) == -1) && (comparisons.indexOf(-1) == -1)) {
  //       // if all zeroes (ie no 1s or -1s, then equal)
  //       // console.log(uni1.name + ' equal to! ' + uni2.name + ' ' + comparisons)
  //     } else {
  //       // meh - no dominance = better in some criteria, worse in others
  //       // console.log(uni1.name + ' meh ' + uni2.name + ' ' + comparisons)
  //     }
      
  //   }
  // }
  // console.table(unis)

  // start with the first front
  var front = 1
  // get it
  while (unis.length > 0) {
    var cattedUnis = dominator(unis, categories)
    // console.table(cattedUnis)
    var nextFront = getParetoFront(cattedUnis)
    unis = addToFrontandRemove(nextFront, front, unis)
    front++
  }
 
  console.table(unis)


  // find the front
  // var pareto = getParetoFront(unis)

  // now filter/remove non-dominated unis, and add to front
  // rinse and repeat

}

function dominator(unis, categories) {
  // big compare loop
  // var unis = unis
  var u = unis.length
  // for each uni
  for (var i=0; i<u-1; i++) {
    var uni1 = unis[i]
    // then for each other uni in turn
    for (var j=i+1; j<u; j++) {
      var uni2 = unis[j]
      // compare uni1 with uni2
      var comparisons = compareUnis(unis[i], unis[j], categories)

      // if at least one 1 and no -1's : uni1>uni2
      if ((comparisons.indexOf(1) > -1) && (comparisons.indexOf(-1) == -1)) {
        // console.log(uni1.name + ' dominates ' + uni2.name + ' ' +  comparisons)
        uni1.dominates.push(uni2.rank)
        uni2.dom_by.push(uni1.rank)
      } else if ((comparisons.indexOf(-1) > -1) && (comparisons.indexOf(1) == -1)) {
        // if at least one -1 and no 1's : uni2>uni1
        // console.log(uni1.name + ' dominated by ' + uni2.name + ' ' + comparisons)
        uni2.dominates.push(uni1.rank)
        uni1.dom_by.push(uni2.rank)
      } else if ((comparisons.indexOf(1) == -1) && (comparisons.indexOf(-1) == -1)) {
        // if all zeroes (ie no 1s or -1s, then equal)
        // console.log(uni1.name + ' equal to! ' + uni2.name + ' ' + comparisons)
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
    // console.log('name ' + category.name + ' measureable ' + category.measurable)
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
  // console.log(' ')
  return comparisons
}



// find and return non-dominated unis
// function getNextFrontByBestInCat(unis, categories) {
//   // imp - i'm assuming that all pareto members are the best
//   // ie - can't find non-dominated that isn't the best
//   var pareto = []  // contains g_ratings of best unis - todo use 'set'?
    
//   // for each measurable, find the best
//   for (var criterion of categories) {
//     if (criterion.measurable) {
//       var bestRanks = []

//       // map to new 'column' array just holding uni criterion values
//       var column = unis.map(uni => uni[criterion.name])
//       var bestIndex = column.indexOf(Math.min(...column))
//       var bestValue = column[bestIndex]

//       // find keys of best unis in each column, and push to front if not already there
//       for (var i=0, len=column.length; i<len; i++) {
//         if (column[i] == bestValue) {
//           var key = unis[i].rank
//           var name = unis[i].name
//           bestRanks.push(key)
          
//           var pushMessage = ''
//           // check if uni already pushed to front
//           if (pareto.indexOf(key) == -1) {
//             pareto.push(key)
//             pushMessage = ' - pushing #' + key + ' ' + name
//           }
//           console.log('best ' + criterion.name + ': ' + name + pushMessage)
//         }
//       }
//     }
//   }
    
//   // console.table(pareto)
//   return pareto
// }


// add front ranking to front members
function addToFrontandRemove(pareto, frontRank, unis) {
  var newUnis = [] // unis left over, not in front, for next iteration
  // console.log('frontRank ' + frontRank)
  // console.table(pareto)
  
  // for each uni in pareto, add frontRank score
  for (var key of pareto) {
    // find uni with key, and add frontRank
    var uni = unis.find(u => u.rank === key)
    uni.front = frontRank

    // now remove uni from unis
    newUnis = unis.filter(u => u.rank != key)
    // unis = newUnis // ??
  }

  // console.log('front:' + frontRank)
  // console.table(newUnis)
  return newUnis
}



function showCriteriaO(dataRow) {
  console.log('example')
  // console.log(dataRow)
  var crit, prop, data
  var html = ''
  var j = 0
  var data = dataRow['d']
  candidateExample = deepClone(data)
  console.log(data)
  // console.log(dataRow['d'])
  html = "<table><tr>"
  html += "<th>data</th><th>property</th><th>meas?</th>"
  html += "<th>minim?</th><th>use as ID</th><th>use as key?</th>"
  html += "</tr>"

  for (prop in data) {
    // console.log(prop)
    html += "<tr>"
    html += "<td>" + data[prop] + "</td>"
    html += "<td><label for='" + prop + "'>" + prop + "</label></td>"
    html += "<td><input type='checkbox' id='cat" + j + "'></td>"
    html += "<td><input type='checkbox' id='min" + j + "' checked></td>"
    html += "<td><input type='radio' name='id' value=" + prop + "></td>"
    html += "<td><input type='radio' name='key' value=" + prop + "></td>"
    html += "</tr>"
    j++ 
  }
  // html += "<tr><td>from file</td><td>from file</td><td>compare?</td><td>low value good?</td><td>refer to it</td><td>will assign</td></tr>"
  html += "</table>"
  document.getElementById('boxes').innerHTML = html
}
