// Run app only when DOM is ready
$(function() {
	
	var exports = window;
	
	// A config object for miscellaneous configurations
	var config = {
		rootURL: 'http://localhost/~brunoabrantes/frontend_dev_trends/'
	}
	
	// Create Demo Model - use it to store info about a specific demo.
	var Demo = Backbone.Model.extend({
		
		// These are default values for a new model
		defaults: function() {
			return {
				title: 'A Demo',
				link: '',
				active: false
			};
		},
		
		// All objects created from this Model will have setActive as a method
		setActive: function() {
			this.set( {active: true} );
		},
		
		// All objects created from this Model will have setUnactive as a method
		setUnactive: function() {
			this.set( {active: false} )
		}
		
	});
	
	
	// Create Demo Collection - Keeps track of all Demo models created, sorts them, etc.
	var DemoList = Backbone.Collection.extend({
		
		// We tell the collection to use the variable "Demo" (defined above) as its model.
		model: Demo,
		
		// The comparator function allows the collection to keep the models sorted; in this case, alphabetically.
		comparator: function(demo) {
			return demo.get('title')
		}
		
	});
	
	// Actually create a Demos collection from our DemoList "blueprint"
	var Demos = exports.Demos = new DemoList;
	
	// Create a Demo View - this will render actual HTML from a Demo model, as well as handle events (eg. clicks)
	var DemoView = Backbone.View.extend({
		
		// Choose an HTML tag. Everything is allowed, and the default is a <div>.
		tagName: 'li',
		
		// Use Underscore's templates, grabbed from an HTML element.
		template: _.template( $('#demo-list-template').html() ),
		
		// Tell the view which events we want to be handled by which function. The function must be defined in this view!
		events: {
			'click a': 'setActive'
		},
		
		// Code inside this function is ran when a new View instance is created.
		initialize: function() {
			// Bind events to the view's assigned model. If the model is changed or is destroyed, the view will react appropriately.
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		
		// The render function transforms the models properties into HTML using the template we provided earlier.
		render: function() {
			// The view has an "$el" property, containing a cached jQuery object of its HTML element. You can also access the plain DOM node using "this.el" instead. If you're going to use jQuery functions on the element, always used the cached version.
			this.$el.html(
				// The template we defined is actually a function, which expects an object hash with the models properties. To get this hash, use the model's "toJSON()" function.
				this.template(this.model.toJSON())
			);
			
			if (this.model.get('active')) {
				this.$el.addClass('active');
			} else {
				this.$el.removeClass('active');
			}
			
			// Return "this" to allow chaining: view.render().someOtherViewFunction();
			return this;
		},
		
		setActive: function(evt) {
			// Loop through the collection and call setUnactive on every model
			Demos.invoke('setUnactive');
			
			// Simply call the model's setActive function (the one we defined earlier, in the model itself). Because of event binding, once the model is changed this view will call its render function automatically.
			this.model.setActive();
			
			// Use the Router object to navigate to the demo link			
			Router.navigate(this.model.get('link'), {trigger: true});
			
			// Prevent default browser action
			evt.preventDefault();
		}
	});
	
	// Define a Demo detail view. When we click a demo, we expect a detail view to appear in the main content area of the page.
	var DemoDetailView = Backbone.View.extend({
		
		tagName: 'article',
		
		template: _.template($('#demo-detail-template').html()),
		
		events: {
			'dblclick h1': 'edit',
			'click .submit': 'close'
		},
		
		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		
		render: function() {
			// We need to modify the model data for rendering, because of URLs. We store the data temporarily in an object, alter it and pass that into the template function.
			var data = this.model.toJSON();
			data.link = config.rootURL + data.link;
			
			this.$el.html(this.template(data));
			return this;
		},
		
		// Switch the view into "editing" mode. For simplicity, this just toggles a CSS class and focuses the input
		edit: function(evt) {
			this.$el.addClass('editing');
			this.$el.find('input[type="text"]').focus();
			
			evt.preventDefault();
		},
		
		// Close editing mode and save the new name
		close: function(evt) {
			this.$el.removeClass('editing');
			
			// Grab the new title from the text input
			var value = this.$el.find('input[type="text"]').val();
			
			// If the input is blank assign it the previous title value
			if (!value) {
				value = this.model.get('title');
			}
			
			// Set the 'title' property in the model, triggering changes in views that are using it right now.
			this.model.set({ title: value });
			
			evt.preventDefault();
		}
		
	});
	
	
	// Define the Application View - Renders the contents of the Demo collections, as well as some statistics in the footer.
	var AppView = Backbone.View.extend({
		
		el: $('#app-view'),
		
		// Our templates are simple view properties: they can be named anything!
		countTemplate: _.template($('#app-count-template').html()),
		
		initialize: function() {
		
			// Bind events to the Demos collection - when the collection is changed, its elements are added to the interface.
			Demos.bind('add', this.addOne, this);
			Demos.bind('reset', this.addAll, this);
			Demos.bind('all', this.render, this);
			
			// Cache the footer element for later use
			this.$footer = $(this.$el.find('footer'));
		
		},
		
		render: function() {
			this.$footer.html(this.countTemplate( { demos: Demos.toArray().length } ));
		},
		
		addOne: function(demo) {
			var view = new DemoView({model: demo});
			this.$el.find('#demo-selector ul').append(view.render().el);
		},
		
		addAll: function() {
			// Backbone collections inherit most of Underscore's collection methods, such as each(), pluck(), map(), etc.
			Demos.each(this.addOne, this);
		}
		
	});
	
	
	var AppRouter = Backbone.Router.extend({
		
		routes: {
			"demos/:title": "viewDemo"
		},
		
		viewDemo: function(title) {
			var demo = Demos.where({link: 'demos/' + title})[0];
			// Create the detail view
			var detailView = new DemoDetailView({model: demo});
			App.$el.find('#demo-viewport').html(detailView.render().el);
		}
		
	});
	
	var App = exports.App = new AppView;
	var Router = exports.AppRouter = new AppRouter;
	
	Backbone.history.start({pushState: true, root: config.rootURL});
	
});