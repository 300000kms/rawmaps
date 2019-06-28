(function () {
	//https://github.com/uber/deck.gl/blob/7.1-release/examples/website/map-tile/app.js

	var points = raw.models.points();

	//
	var chart = raw.map()
		.title('Iso map')
		.description(
			"A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis. This kind of plot is also called a scatter chart, scattergram, scatter diagram, or scatter graph.")
		.thumbnail("imgs/scatterPlot.png")
		.category('Map')
		.model(points);

	// aquí van las variables de configuración


	var scale = chart.number()
		.title("Radius")
		.defaultValue(1)
		.fitToWidth(true);


	var colors = chart.color()
		.title("Color scale");

	chart.draw((selection, data) => {
		let da = [];


		var counter = 0;
		var xx = [];
		var yy = [];
		for (x in data) {
			if (typeof (data[x].x) == 'number' && typeof (data[x].y) == 'number' && data[x].y < 90 && data[x].y > -90) {
				counter += 1;
				xx.push(data[x].x);
				yy.push(data[x].y);
				da.push([data[x].x, data[x].y, data[x].size]);
			}
		}

		colors.domain(xx, d => {
			return d.color;
		});

		xx = d3.median(xx);
		yy = d3.median(yy);

		ID = 'chart';
		JID = '#' + ID
		$(JID).html('');
		$(JID).width('100%');
		$(JID).height('calc(100vh - 100px)');

		const {
			DeckGL,
			//			HexagonLayer,
			//			ScatterplotLayer,
			ContourLayer
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

		const COLOR_RANGE = [
			[1, 152, 189],
			[73, 227, 206],
			[216, 254, 181],
			[254, 237, 177],
			[254, 173, 84],
			[209, 55, 78]
		];
		//console.log(ContourLayer)

		function renderLayer() {
			const layer = new ContourLayer({
				id: 'deckMap',
				data: da,
				cellsize: 10000,
				getPosition: d => [d[0], d[1]],
				//gpuAggregation: true,
				//contours:[]
				//				color: [0, 0, 0, 1],
				//				strokeWidth: 1,
				contours: [
					{
						threshold: 1,
						color: [255, 0, 0, 255],
						strokeWidth: 1
					}, // => Isoline for threshold 1
					{
						threshold: 5,
						color: [0, 255, 0],
						strokeWidth: 2
					}, // => Isoline for threshold 5
					{
						threshold: [6, 10],
						color: [0, 0, 255, 128]
					} // => Isoband for threshold range [6, 10)
    ],
			});

			deckgl.setProps({
				layers: [layer]
			});
		}




		renderLayer();

	})

})();
