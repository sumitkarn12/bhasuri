
// Mon Aug 14 16:57:37 2017

const colors = ["w3-red","w3-pink","w3-purple","w3-deep-purple","w3-indigo","w3-blue","w3-light-blue","w3-cyan","w3-aqua","w3-teal","w3-green","w3-light-green","w3-lime","w3-sand","w3-khaki","w3-yellow","w3-amber","w3-orange","w3-deep-orange","w3-blue-gray","w3-brown","w3-light-gray","w3-gray","w3-dark-gray","w3-black","w3-pale-red","w3-pale-yellow","w3-pale-green","w3-pale-blue"];
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
		this.$el.find(".ig-card").each(( i,v )=>{
			this.lazy.observe( v );
			$(v).addClass( colors[Math.floor(Math.random()*colors.length)] );
		});
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


app = new App();
Backbone.history.start({ pushState: true });
$(".bymitthu-goback").click(()=> history.back() );

let pathname = location.pathname;
app.navigate( pathname, { trigger:true });

