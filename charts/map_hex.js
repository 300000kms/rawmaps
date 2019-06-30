(function () {
    //https://github.com/uber/deck.gl/blob/7.1-release/examples/website/map-tile/app.js

    var points = raw.models.pointslite();
    console.log(raw.model());

    //
    var chart = raw.map()
        .title('Hex map')
        .description(
            "A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis. This kind of plot is also called a scatter chart, scattergram, scatter diagram, or scatter graph.")
        .thumbnail("imgs/scatterPlot.png")
        .category('Map')
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

    var escale = chart.number()
        .title("Elevation scale")
        .defaultValue(200)
        .fitToWidth(true);

    //        var aggregation = chart.list()
    //            .title("Aggregation")
    //            .values(['SUM', 'MEAN', 'MAX', 'MIN'])
    //            .defaultValue('SUM');

    var aggregation = chart.list2()
        .title("Colors")
        .values([['SUM', 'summatory'], ['MEAN', 'mean'], ['MAX', 'maximun'], ['MIN', 'minimun']])
        .defaultValue('SUM');


    var upperPercentile = chart.range()
        .title("Upper percentile")
        .min(0)
        .max(100)
        .step(1)
        .defaultValue(100)
        .fitToWidth(true);

    //    var colors = chart.color()
    //        .title("Color scale");

    var colorRamp = chart.list2()
        .title("Colors")
        .values([
                        ['[[255, 255, 255], [0, 0, 0]]', 'ramp1'],
            ['[[255, 255, 255], [255, 255, 0], [255, 0, 0], [0, 0, 0]]', 'ramp2']
    ])
        .defaultValue('[[255, 255, 255], [0, 0, 0]]');


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
        for (x in data) {
            if (typeof (data[x].x) == 'number' && typeof (data[x].y) == 'number' && data[x].y < 90 && data[x].y > -90) {
                counter += 1;
                xx.push(data[x].x);
                yy.push(data[x].y);
                da.push([data[x].x, data[x].y, data[x].size]);
            }
        }

        //        colors.domain(da, d => {
        //            return d[0];
        //        });

        //        console.log(colors)
        //        console.log(colors().domain())
        //        console.log(colors().listColors)
        //        console.log(colors().colorScale)

        //		for (c in colors) {
        //			console.log(c, colors[c])
        //		}


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

        //        const COLOR_RANGE = [
        //			[1, 152, 189],
        //			[73, 227, 206],
        //			[216, 254, 181],
        //			[254, 237, 177],
        //			[254, 173, 84],
        //			[209, 55, 78]
        //		];

        function renderLayer() {
            //console.log(colorRamp(), aggregation())
            const layer = new HexagonLayer({
                id: 'deckMap',
                colorRange: eval(colorRamp()), //COLOR_RANGE,
                data: da,
                elevationRange: [0, 1000],
                elevationScale: escale(),
                extruded: true,
                pickable: true,
                getPosition: d => [d[0], d[1]],
                //getElevationValue: agg,
                getElevationWeight: getWeight,
                elevationAggregation: aggregation()[0],
                opacity: 1,
                radius: radius(),
                coverage: coverage(),
                upperPercentile: upperPercentile(),
                //				onHover: ({
                //					object,
                //					x,
                //					y
                //				}) => {
                //					console.log(object);
                //					const tooltip = `density: ${object.mean}`;
                //
                //				}
            });

            deckgl.setProps({
                layers: [layer]
            });
        }

        renderLayer();

    })

})();
