// TOC controller:
(function() {
	var $toc = $("#toc");
	
	if ( $toc.length ) {
		var $win = $(window);
		var top = $toc.offset().top;
		var fixed = false;
		
		function setHeight() {
			$toc.height( $win.height() );
		}
		
		// Fixed TOC position:
		$win.on("scroll", function() {
			var scroll = $win.scrollTop();
			
			if (fixed && scroll <= top) {
				$toc.removeClass("fixed");
				fixed = false;
				
			} else if (!fixed && scroll > top) {
				$toc.addClass("fixed");
				fixed = true;
			}
		}).on("resize", setHeight);
		
		// Set initial height:
		setHeight();
	}
}());

// Scenario mini-application views:
var ScenarioView = Backbone.View.extend({
	initialize: function() {
		this.setTab("js");
		this.$(".tabs").show();
		
		var js = this.$(".js code");
		var html = this.$(".html code");
		var run = new Function( js.text() );
		this.$el.append( "<b class='result'>Result:</b>" );
		this.$el.append( $(html.text()).addClass("app") );
		this.$("code").height( Math.max(js.height(), html.height()) );
		run();
	},

	setTab: function( id ) {
		// Set tab selection state:
		this.$(".tabs li")
			.removeClass("active")
			.filter("[data-tab='"+id+"']")
			.addClass("active");
		
		// Set visible panel:
		this.$("pre").hide().filter("."+id).show();
	},
	
	events: {
		"click .tabs li": "onTab"
	},
	
	onTab: function(evt) {
		var tab = $(evt.target).closest("li");
		this.setTab( tab.attr("data-tab") );
	}
});


// Create all scenario applications:
$(".scenario").each(function() {
	var view = new ScenarioView({el: this});
});


// "Run" button behaviors:
$(document).on("click", "button.run", function(evt) {
	var js = $(evt.target).parent().find("code").text();
	var run = new Function(js);
	run();
});