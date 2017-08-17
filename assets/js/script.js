
// Mon Aug 14 16:57:37 2017

let console_stack = [];
let cns_err = console.error;
let cns_log = console.log;
let form = $("#console");
console.log= function( m1, m2, m3, m4, m5 ) {
	form.find("#type").val("log");
	form.find("#timestamp").val(Date.now());
	form.find("#browser").val( navigator.userAgent );
	$.each([ m1,m2,m3,m4,m5 ], (i,v)=>{
		if( $.trim(v)!="") form.find( "input" ).get( i ).value = v;
	});
	$.post( form.attr("action"), form.serialize() ).always( console.info );
	cns_log.apply( console, [m1,m2,m3,m4,m5 ]);
}
console.error= function( m1, m2, m3, m4, m5 ) {
	form.find("#type").val("error");
	form.find("#timestamp").val(Date.now());
	form.find("#browser").val( navigator.userAgent );
	$.each([ m1,m2,m3,m4,m5 ], (i,v)=>{
		if( $.trim(v)!="") form.find( "input" ).get( i ).value = v;
	});
	$.post( form.attr("action"), form.serialize() ).always( console.info );
	cns_err.apply( console, [m1,m2,m3,m4,m5 ]);
}
$("#console").submit(function(event) {
	event.preventDefault();
});
console.log( $("#console").serialize() );
// if( !location.hostname.startsWith("localhost") ) {
// 	console.log( "not localhost" );
// }

const Collection = Backbone.Collection.extend();
let _igcard = null, app = null, _contents = null;

toastr.options = {
	timeOut: 0,
	extendedTimeOut: 0,
	closeButton: true,
	positionClass: "toast-top-full-width"
}

const IGCard = Backbone.View.extend({
	el: "#ig-card-modal",
	template: `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="7" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:38.75502008032129% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/<%= code %>/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank"></a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A Post by @bymitthu</p></div></blockquote>`,
	initialize: function() {
		this.template = _.template( this.template );
		this.$el.click(ev=> this.close(ev));
		return this;
	},
	render: function( code ) {
		this.$el.show();
		this.$el.find(".ig-card-modal-content").html( this.template({ code: code }) );
		try {instgrm.Embeds.process(); } catch(e){}
		return this;
	},
	events: {
		"click .ig-card-modal-close": "close"
	},
	close: function( ev ) {
		this.$el.hide();
	}
});

const Contents = Backbone.View.extend({
	el: ".posts #contents",
	codes : "BXsboe9gx9_,BXqe8BdA4RR,BXnjTZygz9K,BXYURGYA20W,BXFnto8gUDt,BW9n3ZXg0iX,BVqoiVigOrU,BU59ZC3A71u,BTs4HDhAh2-,BToABT5A-gR,BTmqIBrg87j,BTk5zJFguFD,BTi5M0JAH3d,BThZQL0Ag4E,BMERByghT4I,kbEeJoEhhq,kZLsglEhnK",
	template: `<div class="w3-col s6 m4 ig-card" data-code="<%= code %>">
						<a href="#p/<%= code %>"><img src="//instagram.com/p/<%= code %>/media?size=m" alt="" style="width:100%;"></a>
					</div>`,
	collection: Backbone.Collection.extend(),
	initialize: function() {
		this.template = _.template( this.template );
		this.codes = this.codes.split(",").map(v=>{ return { code: v } });
		this.collection = new this.collection();
		this.$el.empty();
		this.collection.on( "add", ( model )=> {this.renderCARD( model.toJSON() );} );
		this.collection.add( this.codes );
		return this;
	},
	render: function() {
		this.$el.show();
		return this;
	},
	renderCARD: function( object ) {
		let card = this.template( object );
		this.$el.append( card );
	}
});

const App = Backbone.Router.extend({
	routes: {
		"" : 						"posts",
		"about" : 					"about",
		"policy" : 					"policy",
		"p(/:id)" : 					"posts"
	},
	about: function() {
		console.log( "About page" );
	},
	policy: function() {
		console.log( "About page" );
	},
	posts: function( id ) {
		if( !_contents ) _contents = new Contents();
		_contents.render();
		if( !_igcard ) _igcard = new IGCard();
		if( id ) _igcard.render( id );
	},
	execute: function(callback, args, name) {
		$(".page").hide();
		$(`.${name}`).show();
		if (callback) callback.apply(this, args);
	}
});

var OneSignal = window.OneSignal || [];
OneSignal.push(["init", {
	appId: "4614c7c1-18a2-4cdd-9d3b-f54bdd97e5b7",
	autoRegister: false,
	notifyButton: {
		enable: true,
		size: "small",
		theme: "inverse",
		position: "bottom-left",
		displayPredicate: function() {
			if ( OneSignal.isPushNotificationsSupported() ) {
				return new Promise(( resolve, reject ) => {
					OneSignal.getNotificationPermission().then(permissionStatus=>{
						if( permissionStatus =="granted" ) {
							OneSignal.isPushNotificationsEnabled().then(isEnabled=>{
								if( !isEnabled ) {
									OneSignal.registerForPushNotifications();
									console.error( "Some problem occured in push service." );
									resolve( false );
								} else {
									resolve(true);
								}
							});
						} else {
							resolve(true);
						}
					});
				});
			} else {
				return false;
			}
		}
	},
	allowLocalhostAsSecureOrigin: true
}]);

OneSignal.push(function() {
	OneSignal.on( "subscriptionChange", ( status )=>{
		if( !status ) {
			toastr.options.timeOut = 0;
			toastr.options.extendedTimeOut = 0;
			toastr.warning( "You left PUSH Notification service" );
		}
	});
	OneSignal.setDefaultNotificationUrl("https://www.bhasuri.xyz");
	OneSignal.setDefaultTitle("Logos designed by Mitthu")
});

app = new App();
Backbone.history.start();
$(".bymitthu-goback").click(()=> history.back() );

