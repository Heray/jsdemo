// All the customizable params
var PREBID_TIMEOUT = 500;

var adUnits = [{
    code: 'div-gpt-ad-1438287399331-0',
    sizes: [[300, 250], [300, 600]],
    bids: [{
        bidder: 'appnexus',
        params: {
           placementId: '4799418'
        }
    }]
},{
    code: 'div-gpt-ad-1438287399331-1',
    sizes: [[728, 90], [970, 90]],
    bids: [{
        bidder: 'appnexus',
        params: {
           placementId: '4799418'
        }
    }]
}];

// DO NOT CHANGE BELOW CODE
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

// This has to happen before the publisher actually 
// called googletag.enabledServices. Because this script
// is still loaded asynchronously, hence the unshift.
// If the publisher is willing to load this script sync
// (nothing on this page is blocking), we can just do the
// normal push.
googletag.cmd.unshift(function() {
    googletag.eS = googletag.enableServices;
    googletag.enableServices = function(){};
    console.log('enableServices overwritten.' + new Date().getTime())
});

// Send imps to DFP after the timeout milliseconds.
setTimeout(function() {
    sendDFPRequest();
}, PREBID_TIMEOUT);

function sendDFPRequest() {
    if (pbjs.DfpRequestSent) return;
    googletag.cmd.push(function() {
        pbjs.que.push(function() {
            pbjs.setTargetingForGPTAsync();
        });
        
        googletag.eS();
        var slots = googletag.pubads().getSlots();
        if (slots.length > 0) googletag.display(slots[0].getSlotElementId());
    });
    pbjs.DfpRequestSent = true;
}

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

// Load Prebid.js Asynchronously
(function() {
    var pbjsEl = document.createElement("script"); pbjsEl.type = "text/javascript";
    pbjsEl.async = true; 
    pbjsEl.src = "http://acdn.adnxs.com/prebid/prebid.js";
    var pbjsTargetEl = document.getElementsByTagName("head")[0];
    pbjsTargetEl.insertBefore(pbjsEl, pbjsTargetEl.firstChild);
})();

pbjs.que.push(function() {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        bidsBackHandler: function() {
            sendDFPRequest();
        }
    });
});