
// Mon Aug 14 16:57:37 2017

let console_stack = [];
let cns_err = console.error;
let cns_log = console.log;

console.log= function( value ) {
	update("log", value );
	cns_log.call( console, value);
}
console.error= function( value ) {
	update("log", value );
	cns_err.call( console, value);
}
function update( type, data ) {
	try {
		OneSignal.getUserId().then( id=> {
			let json = {
				type: type,
				browser: navigator.userAgent,
				player: id,
				value: data
			};
			_LTracker.push( json );
		});
	} catch( e ) {
		let json = {
			type: type,
			browser: navigator.userAgent,
			player: id,
			value: data
		};
		_LTracker.push( json );
	}
}

const Collection = Backbone.Collection.extend();
let _igcard = null, app = null, _contents = null, _contact = null;

toastr.options = {
	timeOut: 0,
	extendedTimeOut: 0,
	closeButton: true,
	positionClass: "toast-bottom-full-width"
}

const Contents = Backbone.View.extend({
	el: ".posts #contents",
	initialize: function() {
		this.lazy = new IntersectionObserver( 	entries => this.lazyLoad( entries ), {threshold: 0.1});
		this.$el.find(".ig-card").each(( i,v )=>this.lazy.observe( v ));
		this.$el.find(".ig-card").each(( i,v )=>{
			let t = $( v );
			t.find("img").attr( "src", t.find("img").data("src") );
			this.lazy.unobserve( v );
			if( i > 5 ) return false;
		});
	},
	lazyLoad: function( entries ) {
		if( entries.length > 4 ) return;
		entries.forEach(v=>{
			let t = $( v.target );
			t.find("img").attr( "src", t.find("img").data("src") );
			this.lazy.unobserve( v.target );
		});
	},
	render: function() {
		this.$el.show();
		return this;
	}
});

const Contact = Backbone.View.extend({
	el: ".contact",
	render: function() {
		this.$el.show();
		return this;
	},
	events: {
		"submit form" : "submit"
	},
	submit: function(event) {
		event.preventDefault();
		let form = $( event.currentTarget ).serialize();
		console.log( $( event.currentTarget ).serializeArray() );
		$(event.currentTarget).find(".w3-input").val("");
		let info = toastr.info( "Submitting, Please wait" );
		$.post( $(event.currentTarget).attr("action"), form ).done(( res )=>{
			toastr.success( "Thanks", "You will be contacted shortly." );
		}).fail((err)=>{
			toastr.error( "Sorry", "Something happend. Please try again." );
			console.error( err );
		}).always(()=> info.remove());
	}
});

const Links = Backbone.View.extend({
	el: ".links",
	events: {
		"click a": "show"
	},
	show: function( ev ) {
		ev.preventDefault();
		app.navigate( $(ev.currentTarget).attr("href"), {trigger: true});
		return;
	},
});
let _links = new Links();

const App = Backbone.Router.extend({
	routes: {
		"" : 						"posts",
		"about" : 					"about",
		"policy" : 					"policy",
		"contact" : 				"contact"
	},
	about: function() {},
	policy: function() {},
	contact: function() {
		if( !_contact ) _contact = new Contact();
	},
	posts: function( id ) {
		if( !_contents ) _contents = new Contents();
		_contents.render();
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
									console.error({
										isPushNotificationsSupported: true,
										isPushNotificationsEnabled: false,
										message: "Some problem occured in push service",
										permissionStatus: "granted"
									});
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
Backbone.history.start({ pushState: true });
$(".bymitthu-goback").click(()=> history.back() );

let pathname = location.pathname;
app.navigate( pathname, { trigger:true });

