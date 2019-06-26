(function () {
	//https://github.com/uber/deck.gl/blob/7.1-release/examples/website/map-tile/app.js

	var points = raw.models.points();

	//
	var chart = raw.map()
		.title('Map')
		.description(
			"A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis. This kind of plot is also called a scatter chart, scattergram, scatter diagram, or scatter graph.")
		.thumbnail("imgs/scatterPlot.png")
		.category('Dispersion')
		.model(points);

	// aquí van las variables de configuración
	var radius = chart.number()
		.title("Radius")
		.defaultValue(1000)
		.fitToWidth(true);

	var coverage = chart.range()
		.title("Coverage")
		.min(0)
		.max(1)
		.step(0.1)
		.defaultValue(10)
		.fitToWidth(true);

	var upperPercentile = chart.range()
		.title("Upper percentile")
		.min(0)
		.max(100)
		.step(1)
		.defaultValue(100)
		.fitToWidth(true);

	var colors = chart.color()
		.title("Color scale");

	chart.draw((selection, data) => {
		let da = [];
		console.log(colors.value)
		var counter = 0;
		var xx = [];
		var yy = [];
		for (x in data) {
			if (typeof (data[x].x) == 'number' && typeof (data[x].y) == 'number' && data[x].y < 90 && data[x].y > -90) {
				counter += 1;
				xx.push(data[x].x);
				yy.push(data[x].y);
				da.push([data[x].x, data[x].y]);
			}
		}

		xx = d3.median(xx);
		yy = d3.median(yy);

		ID = 'chart';
		JID = '#' + ID
		$(JID).html('');
		$(JID).width('100%');
		$(JID).height('calc(100vh - 100px)');
		$(JID).after('<div id ="deck" ></div>')

		const {
			DeckGL,
			HexagonLayer
		} = deck;

		const deckgl = new DeckGL({
			container: document.getElementById(ID),
			longitude: xx,
			latitude: yy,
			zoom: 6,
			minZoom: 5,
			maxZoom: 15,
			pitch: 40.5
		});

		var data = null;

		const OPTIONS = ['radius', 'coverage', 'upperPercentile'];

		const COLOR_RANGE = [
			[1, 152, 189],
			[73, 227, 206],
			[216, 254, 181],
			[254, 237, 177],
			[254, 173, 84],
			[209, 55, 78]
		];

		function renderLayer() {
			const hexagonLayer = new HexagonLayer({
				id: 'deckMap',
				colorRange: COLOR_RANGE,
				data: da,
				elevationRange: [0, 1000],
				elevationScale: 250,
				extruded: true,
				getPosition: d => d,
				opacity: 1,
				radius: radius(),
				coverage: coverage(),
				upperPercentile: upperPercentile()
			});

			deckgl.setProps({
				layers: [hexagonLayer]
			});
		}

		renderLayer();

	})

})();
