(function(){
  var PREFIX="seduh.";
  var proto=Storage.prototype, rawSet=proto.setItem, rawRemove=proto.removeItem, rawGet=proto.getItem;
  function mine(st,k){return st===window.localStorage&&typeof k==="string"&&k.indexOf(PREFIX)===0}
  function notify(){var S=window.SeduhSync;if(S&&typeof S.onLocalChange==="function")S.onLocalChange()}
  proto.setItem=function(k,v){rawSet.call(this,k,v);if(mine(this,k))notify()};
  proto.removeItem=function(k){rawRemove.call(this,k);if(mine(this,k))notify()};
  window.SeduhSync={
    PREFIX:PREFIX, onLocalChange:null,
    get:function(k){return rawGet.call(localStorage,k)},
    set:function(k,v){rawSet.call(localStorage,k,v)},
    remove:function(k){rawRemove.call(localStorage,k)},
    snapshot:function(){
      var o={};
      try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf(PREFIX)===0)o[k]=rawGet.call(localStorage,k)}}catch(e){}
      return o;
    },
    clearAll:function(){
      try{var ks=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf(PREFIX)===0)ks.push(k)}
      ks.forEach(function(k){rawRemove.call(localStorage,k)})}catch(e){}
    }
  };
})();
