const amChartBar1 = (chartdivat, chartData) => {
  const root = am5.Root.new(chartdivat);
  root.setThemes([ am5themes_Animated.new(root)]);

  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true,
    paddingLeft:0,
    layout: root.verticalLayout
  }));

  chart.set("colors", am5.ColorSet.new(root, {
  colors: [
      am5.color(0x73556E),
      am5.color(0x9FA1A6),
      am5.color(0xF2AA6B),
      am5.color(0xF28F6B),
      am5.color(0xA95A52),
      am5.color(0xE35B5D),
      am5.color(0xFFA446)
  ]
  }))

  var xRenderer = am5xy.AxisRendererX.new(root, {
  minGridDistance: 50,
  minorGridEnabled: true
  });

  xRenderer.grid.template.setAll({
  location: 1
  })

  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0.3,
  categoryField: "country",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {dy : -30})
  }));

  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  min: 0,
  renderer: am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
  })
  }));

  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  categoryXField: "country",
  
  }));

  series.columns.template.setAll({
  tooltipY: 0,
  tooltipText: "{categoryX}: {valueY}",
  shadowOpacity: 0.1,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowBlur: 1,
  strokeWidth: 2,
  stroke: am5.color(0xffffff),
  shadowColor: am5.color(0x000000),
  cornerRadiusTL: 50,
  cornerRadiusTR: 50,
  fillGradient: am5.LinearGradient.new(root, {
      stops: [
      {}, // will use original column color
      { color: am5.color(0x000000) }
      ]
  }),
  fillPattern: am5.GrainPattern.new(root, {
      maxOpacity: 0.15,
      density: 0.5,
      colors: [am5.color(0x000000), am5.color(0x000000), am5.color(0xffffff)]
  })
  });

  series.columns.template.states.create("hover", {
  shadowOpacity: 1,
  shadowBlur: 10,
  cornerRadiusTL: 10,
  cornerRadiusTR: 10
  })

  series.columns.template.adapters.add("fill", function (fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  xAxis.data.setAll(chartData);
  series.data.setAll(chartData);

  series.appear(1000);
  chart.appear(1000, 100);

};


const amChartBar2 = (chartdiv, dataArr) => {
  var root = am5.Root.new(chartdiv);
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true,
    paddingLeft:0,
    paddingRight:1
  }));
  
  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);
  
  var xRenderer = am5xy.AxisRendererX.new(root, { 
    minGridDistance: 30, 
    minorGridEnabled: true
  });
  
  xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
  });
  
  xRenderer.grid.template.setAll({
    location: 1
  })
  
  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "country",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {dy : -30})
  }));
  
  var yRenderer = am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
  
  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: yRenderer
  }));
  
  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "country",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  }));
  
  series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
  series.columns.template.adapters.add("fill", function (fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });
  
  series.columns.template.adapters.add("stroke", function (stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });
  
  xAxis.data.setAll(dataArr);
  series.data.setAll(dataArr);
  
  series.appear(1000);
  chart.appear(1000, 100);
  
  return chart;
};



//  가로 column 차트
const columnAmChart = (chartdiv, chartData) => {
    var root = am5.Root.new(chartdiv);
    var myTheme = am5.Theme.new(root);

    myTheme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0.1
    });

    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ]);

    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0
      })
    );

    var yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true
    });
    yRenderer.grid.template.set("location", 1);

    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "country",
        renderer: yRenderer
      })
    );

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          visible: true,
          strokeOpacity: 0.1,
          minGridDistance: 80
        })
      })
    );

    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "value",
        sequencedInterpolation: true,
        categoryYField: "country"
      })
    );

    var columnTemplate = series.columns.template;

    columnTemplate.setAll({
      draggable: true,
      cursorOverStyle: "pointer",
      tooltipText: "drag to rearrange",
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      strokeOpacity: 0
    });
    columnTemplate.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    columnTemplate.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    columnTemplate.events.on("dragstop", () => {
      sortCategoryAxis();
    });

    // Get series item by category
    function getSeriesItem(category) {
      for (var i = 0; i < series.dataItems.length; i++) {
        var dataItem = series.dataItems[i];
        if (dataItem.get("categoryY") == category) {
          return dataItem;
        }
      }
    }

    // Axis sorting
    function sortCategoryAxis() {
      // Sort by value
      series.dataItems.sort(function (x, y) {
        return y.get("graphics").y() - x.get("graphics").y();
      });

      var easing = am5.ease.out(am5.ease.cubic);

      // Go through each axis item
      am5.array.each(yAxis.dataItems, function (dataItem) {
        // get corresponding series item
        var seriesDataItem = getSeriesItem(dataItem.get("category"));

        if (seriesDataItem) {
          // get index of series data item
          var index = series.dataItems.indexOf(seriesDataItem);

          var column = seriesDataItem.get("graphics");

          // position after sorting
          var fy =
            yRenderer.positionToCoordinate(yAxis.indexToPosition(index)) -
            column.height() / 2;

          // set index to be the same as series data item index
          if (index != dataItem.get("index")) {
            dataItem.set("index", index);

            // current position
            var x = column.x();
            var y = column.y();

            column.set("dy", -(fy - y));
            column.set("dx", x);

            column.animate({ key: "dy", to: 0, duration: 600, easing: easing });
            column.animate({ key: "dx", to: 0, duration: 600, easing: easing });
          } else {
            column.animate({ key: "y", to: fy, duration: 600, easing: easing });
            column.animate({ key: "x", to: 0, duration: 600, easing: easing });
          }
        }
      });

      yAxis.dataItems.sort(function (x, y) {
        return x.get("index") - y.get("index");
      });
    }

    yAxis.data.setAll(chartData);
    series.data.setAll(chartData);
    series.appear(1000);
    chart.appear(1000, 100);

    return chart;
};