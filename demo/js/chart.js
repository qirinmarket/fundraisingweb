
var options;
var chart2;
var timer;
var maxBar = 2000;
var lastStartDate;
var lastEndDate;

var tickData =[];
var currentValue;
var lastValue;
var stickRight;

var lastTickId = 1;
// sell
var lastbid = Math.random() * 1000000;
// buy
var lastask = lastbid + Math.random() * 1000;

var lastbiddepth = Math.random() * 10000;
var lastaskdepth = Math.random() * 10000;
var lastvolume = Math.random() * 1000000;
var lastvolumebyproduct = lastvolume / 10;

var lastHistoryDate = new Date();

$( function() {
  stickRight = true;

  var data = proceedRandomHistory(2000);
  for(var i=0;i<2000;i++){
    tickData.push(toHistoricalData(data[i]));
  }

  options = makeOptions();
  chart2 = AmCharts.makeChart('chartdiv2', options);
  //lastStartDate = chart2.startDate;
  chart2.validateData();

  var currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() - 60);
  lastEndDate = chart2.endDate;
  lastStartDate = currentDate;
  chart2.zoom(currentDate, lastEndDate);

  // update
  timer = setInterval(() => {
    var data = proceedRandomTick();
    chart2.preventZoom = true;
    pushTick(data);
    chart2.validateData();
  }, 2000);

  // after initialization
  chart2.addListener("dataUpdated", onUpdateChart);
  chart2.addListener("zoomed", setZoomDate);

  window.addEventListener('beforeunload', function(e){
    clearInterval(timer);
    if (chart2) {
      AmCharts.destroyChart(chart2);
    }
  },false);
});

function onInitChart(event) {
  console.log('onInitChart');
}

function onUpdateChart (event) {
  if(stickRight) {
    var date = new Date(tickData[tickData.length - 1].date);
    date.setMinutes(date.getMinutes() + 1);
    lastEndDate = date;
  }
  chart2.zoom(lastStartDate, lastEndDate);
}

function setZoomDate (event) {
  if(chart2.preventZoom) {
    chart2.preventZoom = false;
    return;
  }
  lastStartDate = event.startDate;
  lastEndDate = event.endDate;

  var dt1 = new Date(chart2.endDate);
  dt1.setSeconds(0);
  dt1.setMilliseconds(0);

  var dt2 = new Date(tickData[tickData.length - 1].date);
  dt2.setSeconds(0);
  dt2.setMilliseconds(0);


  // focuse on current bar
  if(dt1.getTime() == dt2.getTime()) {
    stickRight = true;
  } else {
    stickRight = false;
  }
}

function pushTick(arg) {
  var dt = new Date(arg['timestamp']);
  dt.setSeconds(0);
  dt.setMilliseconds(0);

  var dt1 = new Date(arg['timestamp']);
  dt1.setSeconds(0);
  dt1.setMilliseconds(0);
  var dt2 = new Date(tickData[tickData.length - 1].date);
  dt2.setSeconds(0);
  dt2.setMilliseconds(0);
  if(dt1.getTime() > dt2.getTime()) {
    tickData.shift();
    tickData.push({
    "date": dt1,
    "open": arg['best_bid'],
    "close": arg['best_bid'],
    "high": arg['best_bid'],
    "low": arg['best_bid'],
    "volume": arg['volume'],
    "value":0
    });
  } else {
    var tick = tickData[tickData.length - 1];
    if(tick["high"] < arg['best_bid'])
      tick["high"] = arg['best_bid'];
    if(tick["low"] > arg['best_bid'])
      tick["low"] = arg['best_bid'];

    tick["close"] = arg['best_bid'];
    tick["volume"] = arg['volume'];
    tick["value"] = 0;
    tickData[tickData.length - 1] = tick;
  }


  return {
  "date": dt,
  "open": 0,
  "close": arg['best_bid'],
  "high": 0,
  "low": 0,
  "volume": arg['volume'],
  "value":0
  };
}

function toTickData(arg){
}

function toHistoricalData(arg){
  var dt = new Date(arg['date']);
  dt.setSeconds(0);
  dt.setMilliseconds(0);
  return {
  "date": dt,
  "open": arg['open'],
  "close": arg['close'],
  "high": arg['high'],
  "low": arg['low'],
  "volume": arg['volume'],
  "value":0
  };
}

function initialTickDataProvider() {
  return tickData;
}

function tickDataProvider() {
  return tickData;
}

function makeOptions() {
  return {
    "type": "stock",
    "theme": "dark",
    "mouseWheelZoomEnabled": true,
    "dataSets": [ {
      "fieldMappings": [ {
        "fromField": "open",
        "toField": "open"
      }, {
        "fromField": "close",
        "toField": "close"
      }, {
        "fromField": "high",
        "toField": "high"
      }, {
        "fromField": "low",
        "toField": "low"
      }, {
        "fromField": "volume",
        "toField": "volume"
      } ],
      "color": "#7f8da9",
      "dataProvider": tickData,
      "categoryField": "date"
    } ],


    "panels": [ {
        "percentHeight": 70,
        "showCategoryAxis": true,
        "stockGraphs": [ {
          "type": "candlestick",
          "id": "g1",
          "openField": "open",
          "closeField": "close",
          "highField": "high",
          "lowField": "low",
          "valueField": "close",
          "useDataSetColors": false,
          "comparable": true,
          "compareField": "value",
          "lineColor": "#7f8da9",
          "fillColors": "#7f8da9",
          "negativeFillColors": "#db4c3c",
          "negativeLineColor": "#db4c3c",
          "fillAlphas": 0.9,
          'balloonText': '<b>[[date]]</b><br>Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>',
          "highField": "high",
          "lineAlpha": 0.7
        } ],

        "categoryAxis": {
          "dashLength": 2
        },
      },{
        "titles": [{
    			"text": "",
    			"size": 0
    		}],
        "percentHeight": 30,
        "marginTop": 1,
        "showCategoryAxis": true,
        "stockGraphs": [ {
          "valueField": "volume",
          "type": "column",
          "showBalloon": false,
          "fillAlphas": 1
        } ],
        "categoryAxis": {
          "dashLength": 2
        },
      }
    ],
    "panelsSettings":{
      "marginRight":70
    },
    "categoryAxesSettings": {
      "minPeriod": "mm",
      "dateFormats": [
        {"period":"ss","format":"JJ:NN:SS"},
        {"period":"mm","format":"JJ:NN"},
        {"period":"hh","format":"M/D JJ:NN"},
        {"period":"DD","format":"M/D JJ"}
      ]
    },
    "valueAxesSettings":{
      "dashLength": 2,
      "inside":false,
      "position":"right",
      "autoMargins":true
    },

    "chartScrollbarSettings": {
      "graph": "g1",
      "graphType": "line",
      "dragIcon": "dragIconRectBig",
      "backgroundColor":"yeallow",
      "backgroundAlpha":0.5,
      "graphFillColor":"#0099ff",
      "graphFillAlpha":0.5,
      "graphLineColor":"#0099ff",
      "graphLineAlpha":0.5,
      "selectedBackgroundColor":"#99d6ff",
      "selectedBackgroundAlpha":0.2,
      "selectedGraphFillColor":"#e6f5ff",
      "selectedGraphFillAlpha":0.5,
      "selectedGraphLineColor":"#e6f5ff",
      "selectedGraphLineAlpha":0,
    },

    "chartCursorSettings": {
      "valueLineBalloonEnabled": true,
      "valueLineEnabled": true
    },

    "export": {
      "enabled": false
    }
  };
}



function proceedRandomTick() {
  return generateTick(new Date());
}

function proceedRandomHistory(count) {
  var data = [];

  var date = new Date();
  date.setMinutes(date.getMinutes() - (count-1));
  var lastOpen = lastbid;
  var lastClose = lastOpen + (Math.random() * 20000 - 10000);
  lastvolume = Math.random() * 10000;
  var highMargin = (Math.random() * 10000);
  var lowMargin = (Math.random() * 10000);

  for(var i=0; i<count; i++) {

    data[i] = {
      "date":date.toISOString(),
      "open":lastOpen,
      "close":lastClose,
      "high":(lastOpen > lastClose) ? lastOpen + highMargin : lastClose + highMargin,
      "low":(lastOpen > lastClose) ? lastClose - lowMargin : lastOpen - lowMargin,
      "volume":lastvolume,
    }
    lastOpen = lastClose;
    lastClose = lastOpen + (Math.random() * 20000 - 10000);
    do {
      lastvolume = (Math.random() * 20000 - 10000);
    } while(lastvolume < 100);
    date.setMinutes(date.getMinutes() + 1);
    lastbid= lastClose;
  }
  return data;
}

function generateTick(date){
  lastbid = lastbid + (Math.random() * 2000 - 1000);
  lastask = lastbid + Math.random() * 1000;
  lastbiddepth = lastbiddepth + (Math.random() * 1000 - 500);
  lastaskdepth = lastaskdepth + (Math.random() * 1000 - 500);
  var nextVol;
    nextVol = (Math.random() * 40 - 20);
  lastvolume = lastvolume + nextVol;
  if(lastvolume < 100) lastvolume = 100;
  lastvolumebyproduct = lastvolume / 10;
  return {
    "product_code": "BTC_JPY",
    "timestamp": date.toISOString(),
    "tick_id": lastTickId++,
    "best_bid": lastbid,
    "best_ask": lastask,
    "best_bid_size":Math.random(),
    "best_ask_size":Math.random(),
    "total_bid_depth":lastbiddepth,
    "total_ask_depth":lastaskdepth,
    "ltp":Math.random() * 1000000,
    "volume":lastvolume,
    "volume_by_product":lastvolumebyproduct
  };
}
