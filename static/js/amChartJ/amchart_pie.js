                                                                                      
// let legendParams = {
//     centerY: am5.percent(50),
//     y: am5.percent(50),
//     layout: root.verticalLayout
// };


//inner parameter3
//  설정한 valueField에 맞춰서 작성함. 
let setData =  [
    { country: "Lithuania",sales: 501.9}, 
    { country: "Czechia", sales: 301.9}, 
    { country: "Ireland",sales: 201.1}, 
    { country: "Germany",sales: 165.8}, 
    { country: "Australia", sales: 139.9}];
    
const amChartPie = (chartdiv, dataArr) => {
    let root = am5.Root.new(chartdiv);
        root.setThemes([ am5themes_Animated.new(root) ]);
        
        //inner parameter1
        var chart = root.container.children.push(am5percent.PieChart.new(root, {
            radius: am5.percent(93),
            innerRadius: am5.percent(50),
            layout: root.horizontalLayout
        }));

        //inner parameter2
        var series = chart.series.push(am5percent.PieSeries.new(root, {
            name: "Series",
            valueField: "sales",
            categoryField: "country"
        }));

        //inner parameter3
        series.data.setAll(dataArr);
 
        // Disabling labels and ticks
        series.labels.template.set("visible", false);
        series.ticks.template.set("visible", false);

        // Adding gradients
        series.slices.template.set("strokeOpacity", 0);
        series.slices.template.set("fillGradient", am5.RadialGradient.new(root, {
        stops: [{
            brighten: -0.8
        }, {
            brighten: -0.8
        }, {
            brighten: -0.5
        }, {
            brighten: 0
        }, {
            brighten: -0.5
        }]
        }));

      //  var legend = chart.children.push(am5.Legend.new(root, legendParams));

        // set value labels align to right
      //  legend.valueLabels.template.setAll({ textAlign: "bottom" })
            // set width and max width of labels
        // legend.labels.template.setAll({ 
        //     maxWidth: 80,
        //     width: 80,
        //     oversizedBehavior: "wrap"
        // });

       // legend.data.setAll(series.dataItems);

        return chart;
};



// 이게 pie차트 기본형 인가?
const amChartPie2 = (chartdiv, dataArr) => { 
    var root = am5.Root.new(chartdiv);

    // Set themes
    root.setThemes([ am5themes_Animated.new(root) ]);

    // Create chart
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
    layout: root.verticalLayout
    }));

    // Create series
    var series = chart.series.push(am5percent.PieSeries.new(root, {
    valueField: "value",
    categoryField: "category"
    }));

    // Set data
    series.data.setAll(dataArr);

    // Play initial series animation
    series.appear(1000, 100);
    return chart;
};


// 도넛 차트
const amDonutChart = (chartdiv, chatData) => {
    var root = am5.Root.new(chartdiv);

    root.setThemes([
    am5themes_Animated.new(root)
    ]);

    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
    }));

    var series = chart.series.push(am5percent.PieSeries.new(root, {
    valueField: "value",
    categoryField: "category",
    alignLabels: false
    }));

    series.labels.template.setAll({
    textType: "circular",
    centerX: 0,
    centerY: 0
    });

    series.data.setAll(chatData);

    // var legend = chart.children.push(am5.Legend.new(root, {
    //     centerX: am5.percent(50),
    //     x: am5.percent(50),
    //     marginTop: 15,
    //     marginBottom: 15,
    // }));

    // legend.data.setAll(series.dataItems);
    series.appear(1000, 100);

};