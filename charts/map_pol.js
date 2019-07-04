(function () {
	//https://github.com/uber/deck.gl/blob/7.1-release/examples/website/map-tile/app.js

	var points = raw.models.geometry();
	//
	var chart = raw.map()
		.title('Polygon map')
		.description("The Polygon map renders filled and/or stroked polygons.")
		.thumbnail("imgs/scatterPlot.png")
		.category('Map')
		.model(points);

	var escale = chart.number()
		.title("Elevation scale")
		.defaultValue(200)
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
		.defaultValue('cr1');


	function agg(points) {
		//console.log(points.length)
		r = 0;
		for (i = 0; i < points.length; i++) {
			r += points[i][2]
		}
		//console.log(r)
		return r
	}

	function getWeight(point) {
		return point[2];
	}

	chart.draw((selection, data) => {

		let da = [];
		var counter = 0;
		var xx = [];
		var yy = [];
		var domain = []

		for (x in data) {
			if (data[x].polygon != null) {
				counter += 1;
				xx.push(eval(data[x].polygon)[0].map(function (i) {
					return i[0][0]
				}));

				yy.push(eval(data[x].polygon)[0].map(function (i) {
					return i[0][1]
				}));
				domain.push(data[x].size);
				JSON.parse(data[x].polygon);
				da.push([JSON.parse(data[x].polygon)[0], data[x].size, data[x].label]);
			}
		}

		xxmin = d3.min(xx);
		xxmax = d3.max(xx);
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
			HexagonLayer,
			OrthographicView,
			BitmapLayer
		} = deck;
		console.log(deck);

		/*
			new deck.OrthographicView({
				controller: true
			}),
			new deck.OrbitView()
			*/

		const deckgl = new DeckGL({
			//			views: [
			////				new MapView({
			////					controller: true
			////				}),
			//
			////				new OrthographicView({
			////					controller: true
			////				})
			//
			//			],
			container: document.getElementById(ID),
			viewState: {
				longitude: xx,
				latitude: yy,
				zoom: parseInt(((xxmax - xxmin) * 80)),
				minZoom: 5,
				maxZoom: 15,
				pitch: 40.5,
			}
		});

		var limits = chroma.limits(domain, 'q', 10);
		var cs = new chroma.scale(eval(colorRamp())).classes(limits);
		//const tileServer = 'https://c.tile.openstreetmap.org/';


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

			const layer = new PolygonLayer({
				//coordinateSystem: deck.COORDINATE_SYSTEM.IDENTITY,
				id: 'polygon-layer',
				data: da,
				extruded: true,
				opacity: 1,
				pickable: true,
				stroked: true,
				filled: true,
				wireframe: true,
				colorRange: eval(colorRamp()),
				lineWidthMinPixels: 1,
				getPolygon: d => d[0], //eval(d[0]), //JSON.parse(d.polygon),
				getElevation: d => d[1] * escale(),
				getFillColor: d => cs(d[1]).rgb(), //[d.population / d.area / 60, 140, 0],
				getLineColor: [80, 80, 80],
				getLineWidth: 1,
				//				onHover: ({
				//					object,
				//					x,
				//					y
				//				}) => {
				//					const tooltip = `${object.zipcode}\nPopulation: ${object.population}`;
				//					/* Update tooltip
				//					   http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
				//					*/
				//				}
			});

			deckgl.setProps({
				layers: [layer, tlayer]
			});
		}

		renderLayer();

	})

})();
