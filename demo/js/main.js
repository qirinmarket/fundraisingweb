
var windowHeight;
var headerMargin;
var firstRowMinHeight;
var secondRowTopPosition;

var timer2;

var orderBookInfoListCount = 20;
var marketHistoryListCount = 40;

var secondColFirstRowInitialHeight;

var lastMaxAskPrice;
var lastMinAskPrice;
var lastAskPrice;
var spread;
var lastMaxBidPrice;
var lastMinBidPrice;
var lastBidPrice;
var askPriceList = [];
var bidPriceList = [];
function initiateOrderBook($root){
  for(var i=0; i<orderBookInfoListCount; i++){
    var $li = $('<li>');
    var $spanBar = $('<span>');
    var $spanBar2 = $('<span>');
    var $spanEmptyAmount = $('<span>');
    var $spanAmount = $('<span>');
    var $spanPrice = $('<span>');
    var $spanEmpty = $('<span>');

    $spanBar.addClass('orderbook__bar');
    $spanBar2.addClass('orderbook__bar__fill');
    $spanBar.append($spanBar2);
    $spanBar.append("&nbsp;");
    $spanEmptyAmount.addClass('empty_amount');
    $spanPrice.addClass('price');
    $spanAmount.addClass('amount');
    $spanEmpty.addClass('empty_bar');
    $spanAmount.text(getPresizeFormatFloat(Math.round(Math.random() * 200000000) / 100000000,10));
    //Math.round(Math.random() * 100000000) / 100000000

    if($root == '#orderBookAskList') {
      $spanPrice.text(getPresizeFormatFloat(askPriceList[i],8));
      $li.append($spanBar);
      $li.append($spanAmount);
      $li.append($spanPrice);
      $li.append($spanEmpty);
    } else {
      $spanPrice.text(getPresizeFormatFloat(bidPriceList[i],8));
      $li.append($spanEmpty);
      $li.append($spanEmptyAmount);
      $li.append($spanPrice);
      $li.append($spanAmount);
      $li.append($spanBar);
    }
    $($root).append($li);
  }
  if($root == '#orderBookAskList') {
    setTimeout(refleshAsk, Math.random() * 800);
  } else {
    setTimeout(refleshBid, Math.random() * 800);
  }
}

function refleshAsk(){
  var $index = Math.round(Math.random()*orderBookInfoListCount);
  $("#orderBookAskList li:nth-child("+$index+") .orderbook__bar__fill").width(Math.random() * 100);
  //$("#orderBookAskList li:nth-child("+$index+")").css('background-color', 'Red');
  //setTimeout(fadeOut, 200, $("#orderBookAskList li:nth-child("+$index+")"));
  setTimeout(refleshAsk, Math.random() * 800);
}

function fadeOut($elm){
  $elm.css('background-color', 'transparent');
}

function refleshBid(){
  var $index = Math.round(Math.random()*orderBookInfoListCount);
  $("#orderBookBidList li:nth-child("+$index+") .orderbook__bar__fill").width(Math.random() * 100);
  //$("#orderBookBidList li:nth-child("+$index+")").css('background-color', 'Red');
  //setTimeout(fadeOut, 200, $("#orderBookBidList li:nth-child("+$index+")"));
  setTimeout(refleshBid, Math.random() * 800);
}

var onrefleshask = false;
function refleshOrderBookAsk(){
  if(onrefleshask)
    return;
  onrefleshask = true;

  var tmpPrice = getRandomRangeFloat(lastMinAskPrice - 0.00001, lastMaxAskPrice);
  tmpPrice = getPresizeFloat(tmpPrice,8)

  if(tmpPrice > lastMaxAskPrice) {
    /*
    lastMaxAskPrice = tmpPrice;
    for(var i=orderBookInfoListCount; i > 1; i--){
      $("#orderBookAskList li:nth-child("+i+") > span.amount").text($("#orderBookAskList li:nth-child("+(i-1)+") > span.amount").text());
      $("#orderBookAskList li:nth-child("+i+") > span.price").text($("#orderBookAskList li:nth-child("+(i-1)+") > span.price").text());
      $("#orderBookAskList li:nth-child("+i+") .orderbook__bar__fill").width($("#orderBookAskList li:nth-child("+(i-1)+") .orderbook__bar__fill").width());
    }
    $("#orderBookAskList li:nth-child(1) > span.amount").text(Math.round(Math.random() * 200000000) / 100000000);
    $("#orderBookAskList li:nth-child(1) > span.price").text(lastMaxAskPrice);
    $("#orderBookAskList li:nth-child(1)").css('background-color', 'Red');
    setTimeout(fadeOut, 200, $("#orderBookAskList li:nth-child(1)"));
    */
  } else if (tmpPrice < lastMinAskPrice) {
    lastMinAskPrice = tmpPrice;
    for(var i=1; i < orderBookInfoListCount; i++){
      $("#orderBookAskList li:nth-child("+i+") > span.amount").text($("#orderBookAskList li:nth-child("+(i+1)+") > span.amount").text());
      $("#orderBookAskList li:nth-child("+i+") > span.price").text($("#orderBookAskList li:nth-child("+(i+1)+") > span.price").text());
      $("#orderBookAskList li:nth-child("+i+") .orderbook__bar__fill").width($("#orderBookAskList li:nth-child("+(i+1)+") .orderbook__bar__fill").width());
    }
    $("#orderBookAskList li:nth-child("+orderBookInfoListCount+") > span.amount").text(getPresizeFormatFloat(Math.round(Math.random() * 200000000) / 100000000,10));
    $("#orderBookAskList li:nth-child("+orderBookInfoListCount+") > span.price").text(getPresizeFormatFloat(lastMinAskPrice,8));
    $("#orderBookAskList li:nth-child("+orderBookInfoListCount+") .orderbook__bar__fill").width(Math.random() * 100);
    $("#orderBookAskList li:nth-child("+orderBookInfoListCount+")").css('background-color', '#005c99');
    setTimeout(fadeOut, 200, $("#orderBookAskList li:nth-child("+orderBookInfoListCount+")"));

    for(var i=orderBookInfoListCount; i > 1; i--){
      $("#orderBookBidList li:nth-child("+i+") > span.amount").text($("#orderBookBidList li:nth-child("+(i-1)+") > span.amount").text());
      $("#orderBookBidList li:nth-child("+i+") > span.price").text($("#orderBookBidList li:nth-child("+(i-1)+") > span.price").text());
      $("#orderBookBidList li:nth-child("+i+") .orderbook__bar__fill").width($("#orderBookBidList li:nth-child("+(i-1)+") .orderbook__bar__fill").width());
    }

    do{
      spread = getPresizeRandomFloat(30, 0.000001, 8);
    }while(spread == 0);

    lastMaxBidPrice = tmpPrice - spread;
    $("#orderBookBidList li:nth-child(1) > span.amount").text(getPresizeFormatFloat(Math.round(Math.random() * 200000000) / 100000000 ,10));
    $("#orderBookBidList li:nth-child(1) > span.price").text(getPresizeFormatFloat(lastMaxBidPrice,8));
    $("#orderBookBidList li:nth-child(1) .orderbook__bar__fill").width(Math.random() * 100);
    $("#orderBookBidList li:nth-child(1)").css('background-color', '#921e07');
    setTimeout(fadeOut, 200, $("#orderBookBidList li:nth-child(1)"));

  } else if(tmpPrice != lastMaxAskPrice && tmpPrice != lastMinAskPrice) {
    for(var i=1; i < orderBookInfoListCount; i++){
      if(parseFloat($("#orderBookAskList li:nth-child("+(i+1)+") > span.price").text()) == tmpPrice) {
        break;
      }
      $("#orderBookAskList li:nth-child("+i+") > span.amount").text($("#orderBookAskList li:nth-child("+(i+1)+") > span.amount").text());
      $("#orderBookAskList li:nth-child("+i+") > span.price").text($("#orderBookAskList li:nth-child("+(i+1)+") > span.price").text());
      $("#orderBookAskList li:nth-child("+i+") .orderbook__bar__fill").width($("#orderBookAskList li:nth-child("+(i+1)+") .orderbook__bar__fill").width());
      if(parseFloat($("#orderBookAskList li:nth-child("+(i+1)+") > span.price").text()) <= tmpPrice) {
        $("#orderBookAskList li:nth-child("+i+") > span.amount").text(getPresizeFormatFloat(Math.round(Math.random() * 200000000) / 100000000, 10));
        $("#orderBookAskList li:nth-child("+i+") > span.price").text(getPresizeFormatFloat(tmpPrice, 8));
        $("#orderBookAskList li:nth-child("+i+") .orderbook__bar__fill").width(Math.random() * 100);
        $("#orderBookAskList li:nth-child("+i+")").css('background-color', '#005c99');
        setTimeout(fadeOut, 200, $("#orderBookAskList li:nth-child("+i+")"));
        //setTimeout(refleshAsk, Math.random() * 800);

        break;
      }
    }
  }
  lastMaxAskPrice = parseFloat($("#orderBookAskList li:nth-child(1) > span.price").text());
  lastMinAskPrice = parseFloat($("#orderBookAskList li:nth-child("+orderBookInfoListCount+") > span.price").text());

  $('.orderBookInfoMiddle_rate').text(getPresizeFloat(lastMinAskPrice - lastMaxBidPrice,8));

  setTimeout(refleshOrderBookAsk, Math.random() * 800);
  onrefleshask = false;
}

var onrefleshbid = false;
function refleshOrderBookBid(){
  if(onrefleshbid)
    return;
  onrefleshbid = true;

  do{
    spread = getPresizeRandomFloat(30, 0.000001, 8);
  }while(spread == 0);

  var max;
  var min;
  var tmpPrice;
  if(lastMinAskPrice - spread < lastMaxBidPrice) {
    max = lastMinAskPrice - spread;
    min = lastMinBidPrice;
  } else {
    max = lastMinAskPrice - spread;
    min = lastMinBidPrice;
  }

  tmpPrice = getRandomRangeFloat(min, max);// + 0.00001);
  tmpPrice = getPresizeFloat(tmpPrice,8);

  if(tmpPrice > lastMaxBidPrice) {
    lastMaxBidPrice = tmpPrice;
    for(var i=orderBookInfoListCount; i > 1; i--){
      $("#orderBookBidList li:nth-child("+i+") > span.amount").text($("#orderBookBidList li:nth-child("+(i-1)+") > span.amount").text());
      $("#orderBookBidList li:nth-child("+i+") > span.price").text($("#orderBookBidList li:nth-child("+(i-1)+") > span.price").text());
      $("#orderBookBidList li:nth-child("+i+") .orderbook__bar__fill").width($("#orderBookBidList li:nth-child("+(i-1)+") .orderbook__bar__fill").width());
    }
    $("#orderBookBidList li:nth-child(1) > span.amount").text(getPresizeFormatFloat(Math.round(Math.random() * 200000000) / 100000000,10));
    $("#orderBookBidList li:nth-child(1) > span.price").text(getPresizeFormatFloat(lastMaxBidPrice,8));
    $("#orderBookBidList li:nth-child(1) .orderbook__bar__fill").width(Math.random() * 100);
    $("#orderBookBidList li:nth-child(1)").css('background-color', '#921e07');
    setTimeout(fadeOut, 200, $("#orderBookBidList li:nth-child(1)"));
  } else if (tmpPrice < lastMinBidPrice) {
  } else if(tmpPrice != lastMaxBidPrice && tmpPrice != lastMinBidPrice) {

    for(var i=orderBookInfoListCount; i > 1; i--){
      $("#orderBookBidList li:nth-child("+i+") > span.amount").text($("#orderBookBidList li:nth-child("+(i-1)+") > span.amount").text());
      $("#orderBookBidList li:nth-child("+i+") > span.price").text($("#orderBookBidList li:nth-child("+(i-1)+") > span.price").text());
      $("#orderBookBidList li:nth-child("+i+") .orderbook__bar__fill").width($("#orderBookBidList li:nth-child("+(i-1)+") .orderbook__bar__fill").width());
      if(parseFloat($("#orderBookBidList li:nth-child("+(i)+") > span.price").text()) >= tmpPrice) {
        $("#orderBookBidList li:nth-child("+i+") > span.amount").text(getPresizeFormatFloat(Math.round(Math.random() * 200000000) / 100000000, 10));
        $("#orderBookBidList li:nth-child("+i+") > span.price").text(getPresizeFormatFloat(tmpPrice,8));
        $("#orderBookBidList li:nth-child("+i+") .orderbook__bar__fill").width(Math.random() * 100);
        $("#orderBookBidList li:nth-child("+i+")").css('background-color', '#921e07');
        setTimeout(fadeOut, 200, $("#orderBookBidList li:nth-child("+i+")"));

        break;
      }
    }
  }
  lastMaxBidPrice = parseFloat($("#orderBookBidList li:nth-child(1) > span.price").text());
  lastMinBidPrice = parseFloat($("#orderBookBidList li:nth-child("+orderBookInfoListCount+") > span.price").text());

  $('.orderBookInfoMiddle_rate').text(getPresizeFloat(lastMinAskPrice - lastMaxBidPrice,8));

  setTimeout(refleshOrderBookBid, Math.random() * 800);
  onrefleshbid = false;
}

var formatDate = function(date, format){
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
}
var lastHistoryDate = new Date();
lastHistoryDate.setMinutes(lastHistoryDate.getMinutes() - (marketHistoryListCount + 1));
var date = new Date();
var buyOrsell = Math.random() > 0.5 ? 'BUY':'SELL';

function initMarketHistory(){
  var price = Math.round(Math.random() * 1000000) / 10000000;
  var amount = Math.round(Math.random() * 100000000) / 100000000;
  $('.orderBookInfoMiddle_amount').text(getPresizeFormatFloat(amount,8));
  for(var $i=0;$i<marketHistoryListCount;$i++) {
    var $li = $('<li>');
    var $spanDate = $('<span>');
    var $spanPrice = $('<span>');
    var $spanAmount = $('<span>');
    $li.addClass(buyOrsell);
    $spanDate.addClass('marketHistory_time');
    $spanPrice.addClass('marketHistory_price');
    $spanAmount.addClass('marketHistory_amount');
    $spanDate.text(formatDate(new Date(lastHistoryDate.toISOString()), 'hh:mm:ss'));
    $spanPrice.text(getPresizeFormatFloat(price,6));
    $spanAmount.text(getPresizeFormatFloat(amount,8));
    $li.append($spanDate);
    $li.append($spanAmount);
    $li.append($spanPrice);
    $('#marketHistoryList').append($li);
    buyOrsell = Math.random() > 0.5 ? 'BUY':'SELL';
    lastHistoryDate.setMinutes(lastHistoryDate.getMinutes() + (Math.round(Math.random() * 10)));
    lastHistoryDate.setSeconds(lastHistoryDate.getSeconds() + (Math.round(Math.random() * 60)));
    price = Math.round(Math.random() * 1000000) / 10000000;
    amount = Math.round(Math.random() * 100000000) / 100000000;
  }
  setTimeout(refleshMarketHistory, Math.random() * 2000);
}

function refleshMarketHistory(){
  var price = Math.round(Math.random() * 1000000) / 10000000;
  var amount = Math.round(Math.random() * 100000000) / 100000000;
  $('.orderBookInfoMiddle_amount').text(getPresizeFormatFloat(amount,8));
  for(var $i=marketHistoryListCount+1;$i>2;$i--){
    lastHistoryDate = new Date();
    //lastHistoryDate.setSeconds(lastHistoryDate.getSeconds() + (Math.round(Math.random() * 60)));

    $("#marketHistoryList li:nth-child("+$i+")").removeClass('BUY');
    $("#marketHistoryList li:nth-child("+$i+")").removeClass('SELL');

    $("#marketHistoryList li:nth-child("+$i+")").addClass($("#marketHistoryList li:nth-child("+($i-1)+")").attr('class'));
    $("#marketHistoryList li:nth-child("+$i+") > span.marketHistory_time").text($("#marketHistoryList li:nth-child("+($i-1)+") > span.marketHistory_time").text());
    $("#marketHistoryList li:nth-child("+$i+") > span.marketHistory_price").text($("#marketHistoryList li:nth-child("+($i-1)+") > span.marketHistory_price").text());
    $("#marketHistoryList li:nth-child("+$i+") > span.marketHistory_amount").text($("#marketHistoryList li:nth-child("+($i-1)+") > span.marketHistory_amount").text());
  }
  $("#marketHistoryList li:nth-child(2)").removeClass('BUY');
  $("#marketHistoryList li:nth-child(2)").removeClass('SELL');
  $("#marketHistoryList li:nth-child(2)").addClass(buyOrsell);
  $("#marketHistoryList li:nth-child(2) > span.marketHistory_time").text(formatDate(new Date(lastHistoryDate.toISOString()), 'hh:mm:ss'));
  $("#marketHistoryList li:nth-child(2) > span.marketHistory_price").text(getPresizeFormatFloat(price,6));
  $("#marketHistoryList li:nth-child(2) > span.marketHistory_amount").text(getPresizeFormatFloat(amount,8));
  if (buyOrsell == 'BUY') {
    $("#marketHistoryList li:nth-child(2)").css('background-color', '#005c99');
  } else {
    $("#marketHistoryList li:nth-child(2)").css('background-color', '#921e07');
  }
  setTimeout(fadeOutMarketHistory, 200, $("#marketHistoryList li:nth-child(2)"));

  buyOrsell = Math.random() > 0.5 ? 'BUY':'SELL';
  lastHistoryDate.setMinutes(lastHistoryDate.getMinutes() + (Math.round(Math.random() * 10)));
  lastHistoryDate.setSeconds(lastHistoryDate.getSeconds() + (Math.round(Math.random() * 60)));

  setTimeout(refleshMarketHistory, Math.random() * 2000);
}
function fadeOutMarketHistory($elm){
  $elm.css('background-color', 'transparent');
}

$(window).on('load', function(){
  secondColFirstRowInitialHeight = $('#secondCol-firstRow').css('height');
});
$(window).on('load resize', function(){
  windowHeight = window.innerHeight ? window.innerHeight: $(window).height();
  headerMargin = $('#firstRow').offset().top
  firstRowMinHeight = parseInt($('#firstRow').css('min-height').replace(/(px)/g, ''));
  secondRowTopPosition = $('#secondRow').offset().top;

});

function getPresizeFormatFloat(value, pos){
  var val = parseFloat((""+value).substring(0,pos));
  if((""+val).length < pos) val+= "0";
  return val;
}
function getPresizeFloat(value, pos){
  return parseFloat((""+value).substring(0,pos));
}
function getPresizeRandomFloat(max, keta, pos){
  return parseFloat((""+Math.floor(Math.random() * max) * keta).substring(0,pos));
}

function getRandomRangeFloat(min, max){
  return Math.random() * (max - min) + min;
}

function initialize(){
  lastAskPrice = 0.08 + (Math.round(Math.random() * 5000) * 0.000001);
  lastMaxAskPrice = getPresizeFloat(lastAskPrice,8);

  var tmpPrice;
  for(var i=0; i<orderBookInfoListCount; i++){
    askPriceList[i] = getPresizeFloat(lastAskPrice,8);
    do{
        tmpPrice = lastAskPrice - Math.round(Math.random() * 10) * 0.000001;
    }while(tmpPrice == lastAskPrice);
    lastAskPrice = tmpPrice;
  }
  lastMinAskPrice = getPresizeFloat(lastAskPrice,8);

  do{
    spread = getPresizeRandomFloat(30, 0.000001, 8);
  }while(spread == 0);

  lastBidPrice = lastAskPrice - spread;
  lastMaxBidPrice =  getPresizeFloat(lastBidPrice,8);
  for(var i=0; i<orderBookInfoListCount; i++){
    bidPriceList[i] = getPresizeFloat(lastBidPrice,8);
    //bidPriceList[i] = lastBidPrice;
    do{
        tmpPrice = lastBidPrice - Math.round(Math.random() * 10) * 0.000001;
    }while(tmpPrice == lastBidPrice);
    lastBidPrice = tmpPrice;
  }
  lastMinBidPrice =  getPresizeFloat(lastBidPrice,8);

  initiateOrderBook('#orderBookAskList');
  initiateOrderBook('#orderBookBidList');
  initMarketHistory();

  refleshOrderBookAsk();
  refleshOrderBookBid();

  //$('.expiryBox').hide();
  //$('.stopLossBox').hide();
  //$('.takeProfitBox').hide();
}

$( function() {
  initialize();

  $('input[name=place__type]').change(function() {
    if ($('input[name=place__type]:checked').val() === 'MARKET') {
      if($('#secondCol-firstRow').css('height') != secondColFirstRowInitialHeight){
      $('#stopLimitOptional').css('height', '0');
      $('.order-limit-lprice').css('height', '0');
      $('.order-limit-lprice').hide();
      $('#secondCol-secondRow').css('height','260px');
        $('#secondCol-firstRow').css('height','calc(100% - 261px)');
      }
      $('.place__price').prop('disabled', true);
      $('.place__price').val("");
      $('.place__price').attr('placeholder','MARKET PRICE');
      $('.place__price').addClass("inputdisabled");
    } else if($('input[name=place__type]:checked').val() === 'LIMIT') {
      if($('#secondCol-firstRow').css('height') != secondColFirstRowInitialHeight){
      $('#stopLimitOptional').css('height', '0');
      $('.order-limit-lprice').css('height', '0');
      $('.order-limit-lprice').hide();
      $('#secondCol-secondRow').css('height','260px');
        $('#secondCol-firstRow').css('height','calc(100% - 261px)');
      }
      $('.place__price').prop('disabled', false);
      $('.place__price').attr('placeholder','PRICE');
      $('.place__price').val(0);
      $('.place__price').removeClass("inputdisabled");
    } else if($('input[name=place__type]:checked').val() === 'STOP-LIMIT') {
      $('#secondCol-firstRow').css('height','calc(100% - 414px)');
      $('#secondCol-secondRow').css('height','413px');
      $('#stopLimitOptional').css('height', '180px');
      $('.order-limit-lprice').show();
      $('.order-limit-lprice').css('height', '47px');
    }
  });

  $('#listTypeHistory').prop('checked', false);
  $('#listTypeOrder').prop('checked', false);
  $('#listTypePosition').prop('checked', true);

  $('input[name=listType]').change(function() {
    if ($('input[name=listType]:checked').val() === 'POSITION') {
      $('#positionList').show();
      $('#orderList').hide();
      $('#historyList').hide();
    } else if ($('input[name=listType]:checked').val() === 'ORDER') {
      $('#orderList').show();
      $('#positionList').hide();
      $('#historyList').hide();
    } else if ($('input[name=listType]:checked').val() === 'HISTORY') {
      $('#historyList').show();
      $('#positionList').hide();
      $('#orderList').hide();
    }
  });

  $( "#rowdevider" ).draggable({
    drag: function( event, ui ) {
      ui.position.left=0;
      if(ui.offset.top < (firstRowMinHeight+headerMargin)) {
        ui.position.top = 0;
        return;
      }
      //console.log(windowHeight + " : " +secondRowTopPosition+ " : "+ui.offset.top);
      //console.log(100 / (windowHeight / ui.offset.top) / 100);
      //$('#secondRow').offset({
      //  top:windowHeight * (100 / (windowHeight / ui.offset.top) / 100) + 6,
      //  left:0});
      $('#firstRow').css('height',"calc(100% - "+Math.floor(windowHeight - (windowHeight * (100 / (windowHeight / ui.offset.top) / 100) + 6))+"px)");
      //$('#firstRow').height(Math.floor(windowHeight * (100 / (windowHeight / ui.offset.top) / 100)-headerMargin)-1);
      $('#secondRow').height(Math.floor(windowHeight - (windowHeight * (100 / (windowHeight / ui.offset.top) / 100) + 6)));
      ui.position.top = 0;
    }
  });

  $('#expiredate').datepicker();

  $('#currentTime').text(formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss'));

  /*timer2 = setInterval(() => {
    $('#currentTime').text(formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss'));
  }, 1000);*/

  $('#pairSelection > .dropdown-item').click(function(){
      var visibleItem = $('.dropdown-toggle', $(this).closest('.dropdown'));
      visibleItem.text($(this).text());
  });

  $('#langSelection > .dropdown-item').click(function(){
      var visibleItem = $('.dropdown-toggle', $(this).closest('.dropdown'));
      visibleItem.text($(this).text());
  });

  /*window.addEventListener('beforeunload', function(e){
    clearInterval(timer2);
  },false);*/
});
