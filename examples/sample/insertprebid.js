var slotsDefined = false;
var bidsReady = false;

var googletag = window.googletag || {};
googletag.cmd = googletag.cmd || [];

googletag.cmd.unshift(function() {
  var res = googletag.pubads().disableInitialLoad();
  googletag.eS = googletag.enableServices;
  googletag.enableServices = function(){
  	slotsDefined = true;
  	writeToGPT();
  };
});

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

var PREBID_TIMEOUT = 500;

var adUnits = [{
    code: '300',
    sizes: [[300, 250], [300, 600]],
    bids: [{
        bidder: 'appnexus',
        params: {
           placementId: '4799418'
        }
    },{
	      bidder: 'sovrn',
	      params: { 
	          tagId: '315045' 
	      }
	  },
	  {
	      bidder: 'yieldbot',
	      psn: '234',
	      slot: '123'
	  },
	  //1 ad unit can also be targeted by multiple bids from 1 bidder
	  {
	      bidder: 'pubmatic',
	      params: {
	          publisherId: 39741,
	          adSlot: '39620189@300x250'
	      }
	  }, {
	      bidder: 'pubmatic',
	      params: {
	          publisherId: 39741,
	          adSlot: '39620189@300x600'
	      }
	  },
	  {
	      bidder: 'rubicon',
	      params: {
	         rp_account : '9707',
	         rp_site: '17955',
	         rp_zonesize : '50983-15',
	         rp_tracking : 'affiliate-1701207318',
	         rp_floor : '0.1'
	      }
	  }]
	}
// ,{
//     code: '/19968336/header-bid-tag1',
//     sizes: [[728, 90], [970, 90]],
//     bids: [{
//         bidder: 'appnexus',
//         params: {
//            placementId: '4799418'
//         }
//     }]
// }
];

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        timeout: 1500,
        bidsBackHandler: function() {
        	bidsReady = true;
        	writeToGPT();
        }
    });
});

(function() {
    var gads = document.createElement('script');
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') +
    '//acdn.adnxs.com/prebid/prebid.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
})();

//setTimeout(writeToGPT, 500);

function writeToGPT() {
	if (!slotsDefined) return;

	if (slotsDefined && (!bidsReady)) return;

  googletag.cmd.push(function() {
      prebidRes = pbjs.getAdserverTargeting();
      console.log(prebidRes);

      var slots = googletag.pubads().getSlots();
      console.log(slots);
      for (var i = 0; i < slots.length; i++) {

      	
          var slot = slots[i];

          slot.addService(googletag.content());
          googletag.eS();
          //googletag.enableServices();

          var adid = pbjs.getAdserverTargeting('300')['300']['hb_adid'];
          
          // var html = '<body>Foo</body><script>window.top.pbjs.renderAd(document, "' + adid + '");</script>';
          // var iframeSrc = 'data:text/html;charset=utf-8,' + encodeURI(html);
          var contentHtml = '<iframe id="post_if' + i + '" FRAMEBORDER="0" SCROLLING="no" MARGINHEIGHT="0" MARGINWIDTH="0" TOPMARGIN="0" LEFTMARGIN="0" ALLOWTRANSPARENCY="true" WIDTH="90" HEIGHT="90"></iframe>';

          //var contentHtml = '<iframe id="post_if"></iframe><script>var ifE = document.getElementById("post_if");ifE.onload = function() {alert();pbjs.renderAd(ifE.contentWindow.document, "' + adid + '")}</script>';
          //var contentHtml = '<iframe id="post_if' + i + '"></iframe>';
          

          //var contentHtml = '<h2>Hey</h2><script>try{ window.top.pbjs.renderAd(document, "' + adid + '"); } catch(e) {/*ignore*/}</script>';
          //var contentHtml = '<iframe src="http://local:4000/examples/sample/salesframe.html" FRAMEBORDER="0" SCROLLING="no" MARGINHEIGHT="0" MARGINWIDTH="0" TOPMARGIN="0" LEFTMARGIN="0" ALLOWTRANSPARENCY="true" WIDTH="90" HEIGHT="90"></iframe>';
          
          googletag.content().setContent(slot, contentHtml);
          var ifE = document.getElementById("post_if" + i);
          pbjs.renderAd(ifE.contentWindow.document, adid);
      }

      //googletag.pubads().refresh();
  });
}

