(function () {
	//https://github.com/uber/deck.gl/blob/7.1-release/examples/website/map-tile/app.js

	var points = raw.models.points();

	//
	var chart = raw.map()
		.title('Scatter map')
		.description(
			"The Scatterplot map takes in paired latitude and longitude coordinated points and renders them as circles with a certain radius.")
		.thumbnail("imgs/scatterPlot.png")
		.category('Map')
		.model(points);

	// aquí van las variables de configuración

	var scale = chart.number()
		.title("Radius")
		.defaultValue(1)
		.fitToWidth(true);



	var cr1 = chroma.scale(['rgb(250, 250, 110)', 'rgb(255, 0, 235)', 'rgb(0,0,0)']).mode('rgb').colors(6).map(function (x) {
		return chroma(x).rgb();
	});

	var cr2 = chroma.scale(['rgb(255, 255, 255)', 'rgb(0, 226, 255)', 'rgb(0,0,0)']).mode('rgb').colors(6).map(function (x) {
		return chroma(x).rgb();
	});

	var cr3 = chroma.scale(['rgb(255, 255, 0)', 'rgb(0, 226, 255)', 'rgb(0, 0, 255)', 'rgb(0,0,0)']).mode('rgb').colors(6).map(function (x) {
		return chroma(x).rgb();
	});

	var cr4 = chroma.scale(['rgb(255, 0, 0)', 'rgb(255, 255, 255)', 'rgb(0, 226, 255)']).mode('rgb').colors(6).map(function (x) {
		return chroma(x).rgb();
	});

	var colorRamp = chart.list2()
		.title("Colors")
		.values([
            ['cr1', 'ramp1'],
            ['cr2', 'ramp2'],
			['cr3', 'ramp2'],
			['cr4', 'ramp2'],
    ])



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

		xx = d3.median(xx);
		yy = d3.median(yy);

		ID = 'chart';
		JID = '#' + ID
		$(JID).html('');
		$(JID).width('100%');
		$(JID).height('calc(100vh - 100px)');

		const {
			DeckGL,
			HexagonLayer,
			ScatterplotLayer
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

		function renderLayer() {

			const tileServer = 'http://d.tile.stamen.com/toner-lines/';
			const tlayer = new TileLayer({
				pickable: true,
				opacity: 0.8,
				minZoom: 0,
				maxZoom: 19,
				getTileData: ({
					x,
					y,
					z
				}) => {
					const mapSource = `${tileServer}/${z}/${x}/${y}.png`;
					return fetch(mapSource)
						.then(response => {
							return mapSource
						})
				},

				renderSubLayers: props => {
					const {
						bbox: {
							west,
							south,
							east,
							north
						}
					} = props.tile;

					return new BitmapLayer(props, {
						data: null,
						image: props.data, //props.data,
						bounds: [west, south, east, north]
					});
				}
			});

			const layer = new ScatterplotLayer({
				id: 'deckMap',
				data: da,
				pickable: true,
				opacity: 0.8,
				stroked: true,
				filled: true,
				radiusScale: scale(),
				radiusMinPixels: 1,
				radiusMaxPixels: 1000,
				lineWidthMinPixels: 1,
				getPosition: d => [d[0], d[1]],
				getRadius: d => d[2],
				getFillColor: d => [255, 140, 0],
				getLineColor: d => [0, 0, 0],
				//				onHover: ({
				//					object,
				//					x,
				//					y
				//				}) => {
				//					const tooltip = `${object.name}\n${object.address}`;
				//				}
			});



			deckgl.setProps({
				layers: [layer, tlayer]
			});
		}




		renderLayer();

	})

})();
