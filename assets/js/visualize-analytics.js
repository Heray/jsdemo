
var altloadtimes = {
  'appnexus': [71,43,57,41,45,46,218,40,46,43,43,38,62,116,40,42,40,50,85,49,56,33,48,124,43,45,150,50,43,203,33,44,56,52,36,47,137,43,40,140,113,41,42,123,90,63,39,44,50,43,46,42,315,57,30,55,41,41,38,131,61,117,81,51,46,72],
  'rubicon': [206,226,233,300,243,276,203,211,255,262,246,231,178,179,203,201,264,223,378,572,150,214,226,238,226,217,222,226,225,245,382,228,236,212,284,215,210,377,253,196,208,265,209,226,230,174,173,239,219,200,197,226,218],
  'pubmatic': [210,192,240,195,231,207,297,273,269,589,216,217,306,589,235,272,221,247,305,283,221,205,223,223,193,404,238,237,213,209,204,210,549,249,295,242,218,220,270,218,204,244,549,217,230,211,204,166,206,220,238,213,257,225,204,403,205,267,204,233,220,268,269,183],
  'openx': [784,877,585,647,651,721,586,721,782,586,630,789,670,914,830,666,780,608,737,802,899,654,581,732,854,788,794,695,739,619,596,715,850,679,771,626,797,648,705,812]
}

var loadtimes = {
  'appnexus': [],
  'rubicon': [],
  'pubmatic': [],
  'openx': []
}

Parse.initialize("6ZZDyvR3T7JcfxPqRqdkvW6q89IKoSjRJxpDc8gw", "bvzQPaz6EILUCspXr38z2kZDpRXqwhSy9AtBrLrP");

var CPMobj = Parse.Object.extend("demoCPM");
var query = new Parse.Query(CPMobj);
query.descending("updatedAt");
query.exists("loadTime");
query.exists("bidderCode");
query.notEqualTo("bidderCode", "criteo");

query.find({
  success: function(results) {
    //console.log(results);

    for (var r in results) {
      var result = results[r];
      var bidder = result.attributes.bidderCode;
      var loadTime = result.attributes.loadTime;

      //console.log('biidder is: ' + bidder);
      //console.log(loadTime);

      if (bidder in loadtimes) {
        loadtimes[bidder].push(loadTime);  
      }

      
   }

  },
  error: function(error) {
    console.log('Parse error: ' + error);
  }
})


google.load("visualization", "1", {packages:["corechart"]});

//var buckets = ['0ms','100ms','200ms','300ms','400ms','500ms','600ms','800ms','900ms','1000ms'];


var states = {
  'appnexus': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  'rubicon': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  'pubmatic': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  'openx': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
}

var visualizeData;

var chartData = [
    ['Latency', 'AppNexus', 'Rubicon', 'Pubmatic', 'OpenX'],
    ['0ms',  0,0,0,0],
    ['100ms',  0,0,0,0],
    ['200ms',  0,0,0,0],
    ['300ms',  0,0,0,0],
    ['400ms',  0,0,0,0],
    ['500ms',  0,0,0,0],
    ['600ms',  0,0,0,0],
    ['700ms',  0,0,0,0],
    ['800ms',  0,0,0,0],
    ['900ms',  0,0,0,0],
    ['1000ms',  0,0,0,0],
    ['1100ms',  0,0,0,0],
    ['1200ms',  0,0,0,0],
    ['1300ms',  0,0,0,0],
    ['1400ms',  0,0,0,0],
    ['1500ms',  0,0,0,0],
  ]

function loadTimeToState(i) {
  for (var bidder in loadtimes) {
    var bidderLoadtimes = loadtimes[bidder];
    var newVal = bidderLoadtimes[i % bidderLoadtimes.length];
    var bucketIndex = Math.floor(newVal / 100) + 1;
    if (bucketIndex > 14) bucketIndex = 14;
    states[bidder][bucketIndex] += 1;

  }
}

function sumArray(array) {
  return array.reduce(function(pv, cv) { return pv + cv; }, 0);
}

function statesToChartData() {
  var bidderI = 1;
  for (var bidder in states) {
    //chartData[0][bidderI] = bidder;
    //console.log(bidder);
    var bidderStates = states[bidder];
    var arraySum = sumArray(bidderStates);
    for (var j = 0; j<bidderStates.length; j++) {
      var percentage = bidderStates[j] / arraySum;

      //console.log('array sum is: ' + arraySum);

      //chartData[j+1][bidderI] = percentage;
      visualizeData.setValue(j, bidderI, percentage*100);
    }

    bidderI ++;
  }

  //console.log(JSON.stringify(chartData));
}



google.setOnLoadCallback(drawChart);
function drawChart() {
  var options = {
    title: 'Latency by Bidder',
    hAxis: {title: 'Latency',  titleTextStyle: {color: '#333'}},
    vAxis: {minValue: 0, maxValue: 100,format: '#\'%\''},
    animation: {
      duration: 1000,
      easing: 'out'
    }
  };

  visualizeData = google.visualization.arrayToDataTable(chartData);

  var chart = new google.visualization.AreaChart(document.getElementById('appnexus_div'));
  //chart.draw(visualizeData, options);


  // loadTimeToState(1);
  // statesToChartData();
  // var data = google.visualization.arrayToDataTable(chartData);
  // chart.draw(data, options);

  var k = 0;
  setInterval(function() {
    loadTimeToState(k);
    statesToChartData();

    //visualizeData = google.visualization.arrayToDataTable(chartData);
    chart.draw(visualizeData, options);

    k++;
  }, 2000);


}
