//  클릭탭 보이는 함수
let tabCnt = 0; // Plots탭 클릭 횟수가 필요하므로.

const showTab = (aObj, num) => {
    const tabArr = document.querySelectorAll('.menu');

    tabArr.forEach((node) => {
        node.classList.remove('on');
    });  

    aObj.parentElement.classList.add('on');
    
    //탭 차트 옵션창 보이기
    const tabMapArr = document.querySelectorAll('.map_box');
    tabMapArr.forEach((node) => {
        node.style.display = 'none';
    });

    document.querySelector(`.map_box${num}`).style.display = 'block flex';

    if (num == '1') { // 싱글셀 유맵데이터 가져오는 함수 호출.
    } else if (num == '2') { // 싱글셀 카운트데이터 가져오는 함수 호출
        if (tabCnt == 0) {
            tabCnt++; // Plots탭 초기 한번만 누를때만 allType 차트 그려줌.
            getUmapCellCounts();
        }
    }
};

const drawCellCountChart = (data) => {
    // Plots 차트 그리는 함수
    const root1 = am5.Root.new("chartdivPlots");
    const myTheme1 = am5.Theme.new(root1);

    root1._logo.dispose(); // amCharts 로고 제거

    myTheme1.rule("Grid", ["base"]).setAll({
        strokeOpacity: 0.1
    });

    // Set themes
    root1.setThemes([
        am5themes_Animated.new(root1),
        myTheme1
    ]);

    let chart;

    const painArr = ['T204','T209','T211','T215','T219','T223','T235','T245','T247','T255','T264','T268','T276','T280','T288','T313','T317','T318','T320'];
    data.forEach((item, i) => {
        // Pain 환자명 필드 추가해줌.
       item['Pain'] = painArr[i]; 
    });              
    
    if (chart) {
        chart.dispose(); // 기존 차트 제거
    }

    // Create chart
    chart = root1.container.children.push(am5xy.XYChart.new(root1, {
        panX: false,
        panY: false,
        wheelX: "panY",
        wheelY: "zoomY",
        paddingLeft: 0,
        layout: root1.verticalLayout
    }));

    // Add scrollbar
  //  chart.set("scrollbarY", am5.Scrollbar.new(root, {
  //  orientation: "vertical"
  //  }));

    // Create axes
    var yRenderer = am5xy.AxisRendererY.new(root1, {
        minGridDistance: 10,
    });

    var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root1, {
        categoryField: "Pain",
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root1, {})
    }));

    yRenderer.grid.template.setAll({
        location: 1
    })

    yAxis.data.setAll(data);

    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root1, {
        min: 0,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererX.new(root1, {
            minGridDistance: 100,
            strokeOpacity: 0.1
        })
    }));

    // Add legend
    var legend = chart.children.push(am5.Legend.new(root1, {
        centerX: am5.p50,
        x: am5.p50
    }));
    
    // Add series
    function makeSeries(name, fieldName) {
        var series = chart.series.push(am5xy.ColumnSeries.new(root1, {
            name: name,
            stacked: true,
            xAxis: xAxis,
            yAxis: yAxis,
            baseAxis: yAxis,
            valueXField: fieldName,
            categoryYField: "Pain"
        }));

        series.columns.template.setAll({
            tooltipText: "{name}, {categoryY}: {valueX}",
            tooltipY: am5.percent(90)
        });
        
        series.data.setAll(data);

        // Make stuff animate on load
        series.appear();

        series.bullets.push(function () {
            return am5.Bullet.new(root1, {
                sprite: am5.Label.new(root1, {
                //   text: "{valueX}", 이게 숫자값 표시되는 부분 안보이도록 주석처리함.
                    fill: root1.interfaceColors.get("alternativeText"),
                    centerY: am5.p50,
                    centerX: am5.p50,
                    populateText: true
                })
            });
        });

    //  legend.data.push(series);
    }

    if($('#plotsCell').val() == 2) { // main_celltype 차트
        makeSeries("B cells", "B cells");
        makeSeries("CD4+ T cells", "CD4+ T cells");
        makeSeries("CD8+ T cells", "CD8+ T cells");
        makeSeries("Dendritic cells", "Dendritic cells");
        makeSeries("Endothelial cells", "Endothelial cells");
        makeSeries("Fibroblasts", "Fibroblasts");
        makeSeries("Mast cells", "Mast cells");
        makeSeries("Monocytes", "Monocytes");
        makeSeries("NK cells", "NK cells");
        makeSeries("Follicular B", "Follicular B");
        makeSeries("GC B", "GC B");
        makeSeries("Plasma B cells", "Plasma B cells");
        makeSeries("TAMs", "TAMs");
        makeSeries("Tumor", "Tumor");                 
    } else if ($('#plotsCell').val() == 1) { // fine_celltype 차트
        makeSeries("CAF", "CAF");
        makeSeries("CD4+ Tfh", "CD4+ Tfh");
        makeSeries("CD4+ Tm", "CD4+ Tm");
        makeSeries("CD4+ Tn", "CD4+ Tn");
        makeSeries("CD4+ Treg", "CD4+ Treg");
        makeSeries("CD8+ Tc", "CD8+ Tc");
        makeSeries("CD8+ Tex", "CD8+ Tex");
        makeSeries("CD16+ TAM", "CD16+ TAM");
        makeSeries("CD16- TAM", "CD16- TAM");
        makeSeries("Capillary EC", "Capillary EC");
        makeSeries("Follicular B", "Follicular B");
        makeSeries("GC B", "GC B");
        makeSeries("MARCO+ TAM", "MARCO+ TAM");
        makeSeries("Mast", "Mast");
        makeSeries("Monocyte", "Monocyte");
        makeSeries("NK", "NK");
        makeSeries("Naive B", "Naive B");
        makeSeries("Plasma B", "Plasma B");
        makeSeries("Proliferating T", "Proliferating T");
        makeSeries("Tumor", "Tumor");
        makeSeries("VSMC Fibroblast", "VSMC Fibroblast");
        makeSeries("Vein EC", "Vein EC");
        makeSeries("cDC1", "cDC1");
        makeSeries("cDC2", "cDC2");
        makeSeries("pDC", "pDC");
    }

    // Make stuff animate on load
    chart.appear(1000, 100);
};

// Plots 비율 차트그리는 함수
const drawCellRateChart = (PlotsArr) => {
    // Create root element
    const root = am5.Root.new("chartdivPlots2");
    var myTheme = am5.Theme.new(root);

    root._logo.dispose(); // amCharts 로고 제거

    myTheme.rule("Grid", ["base"]).setAll({
    strokeOpacity: 1
    });

    // Set themes
    root.setThemes([
        am5themes_Animated.new(root),
        myTheme
    ]);

    let chart2;

    if (chart2) {
        chart2.dispose(); // 기존 차트 제거
    }
    // Create chart
    chart2 = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panY",
        wheelY: "zoomY",
        paddingLeft: 30,
        layout: root.verticalLayout
    }));

    let data = PlotsArr.map((obj, i) => {
        const copyObj = {...obj};
        const valuesArr = Object.values(obj);
        const keysArr = Object.keys(obj);
        let sum = 0; // 총합산 용
        let sum2 = 0; //  소수점 총 합산용 보기위해

        //값 내코드.
        for (let i=0; i < valuesArr.length; i++) {
            if(typeof valuesArr[i] !== 'number'){
               continue;
            }
            sum += valuesArr[i];
        }
        for (let i=0; i < valuesArr.length-1; i++) {
            if(typeof copyObj[keysArr[i]] !== 'number'){
               continue;
            }
            const temp = (copyObj[keysArr[i]] / sum).toFixed(4); 
            copyObj[keysArr[i]] = (temp * 100);
            sum2 += copyObj[keysArr[i]];
        }
        copyObj[keysArr[keysArr.length-1]] = 100 - sum2;
        return copyObj;
    }); 

    const painArr = ['T204','T209','T211','T215','T219','T223','T235','T245','T247','T255','T264','T268','T276','T280','T288','T313','T317','T318','T320'];
    
    data.forEach((item,i) => {
        // Pain 환자명 필드 추가해줌.
       item['Pain'] = painArr[i]; 
    });

    var yRenderer = am5xy.AxisRendererY.new(root, {
        minGridDistance: 10,
    });

    var yAxis = chart2.yAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "Pain",
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {})
    }));

    yRenderer.grid.template.setAll({
        location: 1
    })

    yAxis.data.setAll(data);

    var xAxis = chart2.xAxes.push(am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 40,
            strokeOpacity: 0.1
        })
    }));

    var legend = chart2.children.push(am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
    }));

    function makeSeries(name, fieldName) {
        var series = chart2.series.push(am5xy.ColumnSeries.new(root, {
            name: name,
            stacked: true,
            xAxis: xAxis,
            yAxis: yAxis,
            baseAxis: yAxis,
            valueXField: fieldName,
            categoryYField: "Pain"
        }));

        series.columns.template.setAll({
            tooltipText: "{name}, {categoryY}: {valueX}",
            tooltipY: am5.percent(90)
        });
    
        series.data.setAll(data);
        series.appear();
    
        series.bullets.push(function () {
            return am5.Bullet.new(root, {
                sprite: am5.Label.new(root, {
                // text: "{valueX}", 이게 숫자값 표시되는 부분 안보이도록 주석처리함.
                    fill: root.interfaceColors.get("alternativeText"),
                    centerY: am5.p50,
                    centerX: am5.p50,
                    populateText: true
                })
            });
        });
    }

    if ($('#plotsCell').val() == 2) { // main_celltype 차트
        makeSeries("B cells", "B cells");
        makeSeries("CD4+ T cells", "CD4+ T cells");
        makeSeries("CD8+ T cells", "CD8+ T cells");
        makeSeries("Dendritic cells", "Dendritic cells");
        makeSeries("Endothelial cells", "Endothelial cells");
        makeSeries("Fibroblasts", "Fibroblasts");
        makeSeries("Mast cells", "Mast cells");
        makeSeries("Monocytes", "Monocytes");
        makeSeries("NK cells", "NK cells");
        makeSeries("Follicular B", "Follicular B");
        makeSeries("GC B", "GC B");
        makeSeries("Plasma B cells", "Plasma B cells");
        makeSeries("TAMs", "TAMs");
        makeSeries("Tumor", "Tumor");                 
    //} else if(Object.keys(data[0]).length == 26){
    } else if ($('#plotsCell').val() == 1) { // fine_celltype 차트
        makeSeries("CAF", "CAF");
        makeSeries("CD4+ Tfh", "CD4+ Tfh");
        makeSeries("CD4+ Tm", "CD4+ Tm");
        makeSeries("CD4+ Tn", "CD4+ Tn");
        makeSeries("CD4+ Treg", "CD4+ Treg");
        makeSeries("CD8+ Tc", "CD8+ Tc");
        makeSeries("CD8+ Tex", "CD8+ Tex");
        makeSeries("CD16+ TAM", "CD16+ TAM");
        makeSeries("CD16- TAM", "CD16- TAM");
        makeSeries("Capillary EC", "Capillary EC");
        makeSeries("Follicular B", "Follicular B");
        makeSeries("GC B", "GC B");
        makeSeries("MARCO+ TAM", "MARCO+ TAM");
        makeSeries("Mast", "Mast");
        makeSeries("Monocyte", "Monocyte");
        makeSeries("NK", "NK");
        makeSeries("Naive B", "Naive B");
        makeSeries("Plasma B", "Plasma B");
        makeSeries("Proliferating T", "Proliferating T");
        makeSeries("Tumor", "Tumor");
        makeSeries("VSMC Fibroblast", "VSMC Fibroblast");
        makeSeries("Vein EC", "Vein EC");
        makeSeries("cDC1", "cDC1");
        makeSeries("cDC2", "cDC2");
        makeSeries("pDC", "pDC");
    }

    chart2.appear(1000, 100);
};

let cellPlotsData = {};

// 좌측 finecell type 옵션창 각필드 원에 색상 분리해주는 함수.
const divideFinecellTypeColorFn = (key, ele) => {
    const circlef = document.querySelector(`.${ele}`);
    if (key == "Tumor") { circlef.style.backgroundColor = "#67DADC"; }
    else if (key == "CD4+ Tn") { circlef.style.backgroundColor = "#8067DC"; }
    else if (key == "CD4+ Tm") { circlef.style.backgroundColor = "#6771DC"; }
    else if (key == "CD4+ Tfh") { circlef.style.backgroundColor = "#6794DC"; }
    else if (key == "CD4+ Treg") { circlef.style.backgroundColor = "#A367DC"; }
    else if (key == "CD8+ Tc") { circlef.style.backgroundColor = "#C767DC"; }
    else if (key == "CD8+ Tex") { circlef.style.backgroundColor = "#DC67CE"; }
    else if (key == "Proliferating T") { circlef.style.backgroundColor = "#67DCBB"; }
    else if (key == "NK") { circlef.style.backgroundColor = "#7DDC67"; }
    else if (key == "Plasma B") { circlef.style.backgroundColor = "#67DC98"; }
    else if (key == "Follicular B") { circlef.style.backgroundColor = "#DC8C67"; }
    else if (key == "Naive B") { circlef.style.backgroundColor = "#67DC75"; }
    else if (key == "GC B") { circlef.style.backgroundColor = "#DCAF67"; } 
    else if (key == "Monocyte") { circlef.style.backgroundColor = "#A0DC67"; } 
    else if (key == "MARCO+ TAM") { circlef.style.backgroundColor = "#DCD267"; }
    else if (key == "CD16+ TAM") { circlef.style.backgroundColor = "#DC67AB"; }
    else if (key == "CD16- TAM") { circlef.style.backgroundColor = "#DC6788"; }
    else if (key == "cDC1") { circlef.style.backgroundColor = "#6771DC"; }
    else if (key == "cDC2") { circlef.style.backgroundColor = "#8067DC"; }
    else if (key == "pDC") { circlef.style.backgroundColor = "#A367DC"; }
    else if (key == "Mast") { circlef.style.backgroundColor = "#C3DC67"; }
    else if (key == "Vein EC") { circlef.style.backgroundColor = "#6794DC"; } 
    else if (key == "Capillary EC") { circlef.style.backgroundColor = "#DC6967"; } 
    else if (key == "CAF") { circlef.style.backgroundColor = "#67B7DC"; }
    else if (key == "VSMC Fibroblast") { circlef.style.backgroundColor = "#67B7DC"; }
};

 // maincell type 옵션창 각필드 원에 색상 분리해주는 함수호출.
const divideMaincellTypeColorFn = (key, ele) => {
    const circlem = document.querySelector(`.${ele}`);
    if(key == "B cells"){ circlem.style.backgroundColor = "#67B7DC"; }
    else if(key == "CD4+ T cells"){ circlem.style.backgroundColor = "#6794DC"; }
    else if(key == "CD8+ T cells"){ circlem.style.backgroundColor = "#8067DC"; }
    else if(key == "Dendritic cells"){ circlem.style.backgroundColor = "#8067DC"; }
    else if(key == "Endothelial cells"){ circlem.style.backgroundColor = "#A367DC"; }
    else if(key == "Fibroblasts"){ circlem.style.backgroundColor = "#C767DC"; }
    else if(key == "Mast cells"){ circlem.style.backgroundColor = "#DC67CE"; }
    else if(key == "Monocytes"){ circlem.style.backgroundColor = "#DC67AB"; }
    else if(key == "NK cells"){ circlem.style.backgroundColor = "#DC6788"; }
    else if(key == "Plasma B cells"){ circlem.style.backgroundColor = "#DCAF67"; }
    else if(key == "TAMs"){ circlem.style.backgroundColor = "#DCD267"; }
    else if(key == "Tumor"){ circlem.style.backgroundColor = "#C3DC67"; }
};

// 싱글셀 카운트데이터 가져오는 함수
const getUmapCellCounts = async () => {
    try{
        $.blockUI({
            message : '', 
            });
        $('#spinnerp').show(); // 스피너표시  
        $('#lodingumSP').show(); 
        $('#bgHidep').show();
        $('#chartdivPlots2').hide();
        $('#chartdivPlots').hide();

        const res = await fetch(`/getUmapCellCounts`);
        const result = await res.json();
        cellPlotsData = result;

        // 좌측 cell type 옵션창 각필드 네임 넣어줌.
        const plotsOpArr = document.querySelectorAll('.chk-listP');
        const deleSpans = document.querySelectorAll('.cinput-set');

        // PLOTS 옵션창에 계속해서 배열이 추가 되므로 기존 생성된 테그 먼저 삭제시킴.
        $('.PlotsFrom1').find('.input-set').remove();
        $('.PlotsFrom2').find('.input-set').remove();

        plotsOpArr.forEach((node, i) => {
            if (i == 0) { // fine_celltype
                Object.keys(result.fineCountsList[0]).forEach((key, j) => {
                    const span = document.createElement('span');
                    span.classList.add('input-set');
                    span.innerHTML = `
                        <input type="checkbox" id="ipt2-${j+1}" name="cellTypeSf" value="${key}"> 
                        <label for="ipt2-${j+1}"><span class="ico-color circlef${j+1}"></span>${key}</label>
                    `;
                    node.appendChild(span);
                    // finecell type 옵션창 각필드 원에 색상 분리해주는 함수호출.
                    divideFinecellTypeColorFn(key, `circlef${j+1}`);
                });
            } else if (i == 1) { // main_celltype
                Object.keys(result.mainCountsList[0]).forEach((key,j)=>{
                    const span = document.createElement('span');
                    span.classList.add('input-set');
                    span.innerHTML = `
                        <input type="checkbox" id="ipt3-${j+1}" name="cellTypeSm" value="${key}">
                        <label for="ipt3-${j+1}"><span class="ico-color circlem${j+1}"></span>${key}</label>
                    `;
                    node.appendChild(span);
                    // maincell type 옵션창 각필드 원에 색상 분리해주는 함수호출.
                    divideMaincellTypeColorFn(key, `circlem${j+1}`);
                });
             }
        });

        $('#spinnerp').hide(); // 스피너 숨김
        $('#lodingumSP').hide(); 
        $('#bgHidep').hide();
        // 초기 렌더링시 체크박스가 all체크로 선택되어 있어야함.
        // Fine cell type 부문.
        $("input[name=cellTypeSf]").prop("checked", true);
        $("#fine_chkAllP").prop("checked", true);
        // Main cell type 부문.
        $("input[name=cellTypeSm]").prop("checked", true);
        $("#main_chkAllP").prop("checked", true);
        $('#chartdivPlots2').show();
        $('#chartdivPlots').show();

        // 차트 그리는 함수에 데이터 넘겨줌.
        drawCellCountChart(result.fineCountsList); 
        drawCellRateChart(result.fineCountsList);
    } catch(e) {
        $('#spinnerp').hide(); // 스피너 숨김
        $('#lodingumSP').hide(); 
        $('#bgHidep').hide();
        console.log(e);
    }
    $.unblockUI();
};

// 선택한 cell만 데이터 가져온후 Plots차트그려주는 비동기함수.
const getSelectedCell = async () => {
    const selectedCell = []; 
    // 선택한 체크박스 모두 가져오기.
    let selectCheckBoxs = [];
    if ($('#plotsCell').val() == 1) {
          selectCheckBoxs = document.querySelectorAll('.PlotsFrom1 input[name="cellTypeSf"]:checked');
    } else if ($('#plotsCell').val() == 2) {
          selectCheckBoxs = document.querySelectorAll('.PlotsFrom2 input[name="cellTypeSm"]:checked');
    }

    //필터 체크여부 확인
    if (selectCheckBoxs.length < 1) {
        alert('Please check one more filter.');
        return;
    }

    // 체크한 박스의 값을 arr에 추가함.
    selectCheckBoxs.forEach((ele)=>{
        selectedCell.push(ele.value);
    });

    $('#bgHidep').show();
    $('#spinnerp').show(); // 스피너 표시
    $('#lodingumSP').show(); 
    $('#chartdivPlots2').hide();
    $('#chartdivPlots').hide();

    // CSRF 토큰 가져오기
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    try{
        const res = await fetch('/get_SelectedCellData ',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json', // 요청 본문의 데이터 타입 지정
                'X-CSRFToken': csrfToken,          // CSRF 토큰 추가
            },
            body: JSON.stringify({
              choosedCells: selectedCell,
              cellTypeNum : $('#plotsCell').val(),
            }),
        });
        const cellDataResult = await res.json();
      //  console.log(cellDataResult.choosedCellsData);

         $('#spinnerp').hide(); // 스피너 숨김
         $('#lodingumSP').hide(); 
         $('#bgHidep').hide();
         $('#chartdivPlots2').show();
         $('#chartdivPlots').show();
         // fine_celltype Plots차트 그려줌.
         drawCellCountChart(cellDataResult.choosedCellsData); 
         drawCellRateChart(cellDataResult.choosedCellsData);
    } catch (e) {
       $('#spinnerp').hide(); // 스피너 숨김
       $('#lodingumSP').hide(); 
       $('#bgHidep').hide();   
       console.log(e);
    }
};


 // 선택한 cell만 데이터 가져온후 Umap차트그려주는 비동기함수.
 const getSelectedUmapCell = async () => {
    const selectedCell = []; 
    // 선택한 체크박스 모두 가져오기.
    let selectCheckBoxs = [];
    if ($('#umapCell').val() == 1) {
          selectCheckBoxs = document.querySelectorAll('.cellFrom1 input[name="cellTypef"]:checked');
    } else if ($('#umapCell').val() == 2) {
          selectCheckBoxs = document.querySelectorAll('.cellFrom2 input[name="cellTypem"]:checked');
    }

    //필터 체크여부 확인
    if (selectCheckBoxs.length < 1) {
        alert('Please check one more filter.');
        return;
    }

    $.blockUI({
        message : '', 
        });

    // 체크한박스의 값을 arr에 추가함.
    selectCheckBoxs.forEach((ele)=>{
        selectedCell.push(ele.value);
    });
    console.log(selectedCell);

    $('#bgHidef').show();
    $('#spinnerf').show(); // 스피너 표시  
    $('#lodingumSU').show(); 
    $('#chartdiv').hide();

    // CSRF 토큰 가져오기
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    try{
        const res = await fetch('/get_umapSelectedCellData ',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json', // 요청 본문의 데이터 타입 지정
                'X-CSRFToken': csrfToken,          // CSRF 토큰 추가
            },
            body: JSON.stringify({
              choosedCells: selectedCell,
              cellTypeNum : $('#umapCell').val(),
            }),
        });

        const cellDataResult = await res.json();
       // console.log(cellDataResult.choosedCellsData);

         $('#spinnerf').hide(); // 스피너 숨김
         $('#lodingumSU').hide(); 
         $('#bgHidef').hide();
         $('#chartdiv').show();
         // umap차트 그리는 함수에 데이터 넘겨줌.
         drawSingleCellUmapChart(cellDataResult.choosedCellsData);
    }catch(e){
       $('#spinnerf').hide(); // 스피너 숨김
       $('#lodingumSU').hide(); 
       $('#bgHidef').hide();
       console.log(e);
    }

    $.unblockUI();
};


// Plots cell type선택옵션창 보이는 함수
const showPlotsCellType = (value) => {
    $('#plotsCell').val(value);
    $('#spinnerp').show(); // 스피너표시
    $('#lodingumSP').show(); 
    $('#bgHidep').show();
    $('#chartdivPlots2').hide();
    $('#chartdivPlots').hide();

    //탭 차트 옵션창 보이기
    const cellFromArr = document.querySelectorAll('.PlotsFrom');
    cellFromArr.forEach((node, i) => {
        node.style.display = 'none';
    });
    
    // 체크박스 초기화
    const checkboxArrF = document.getElementsByName('cellTypeSf');
    checkboxArrF.forEach((box) => {
        box.checked = false;
    });
    const checkboxArrM = document.getElementsByName('cellTypeSm');
    checkboxArrM.forEach((box) => {
        box.checked = false;
    });

    // 초기 렌더링시 체크박스가 all체크로 선택되어 있어야함.
    // Fine cell type 부문.
    $("input[name=cellTypeSf]").prop("checked", true);
    $("#fine_chkAllP").prop("checked", true);
    // Main cell type 부문.
    $("input[name=cellTypeSm]").prop("checked", true);
    $("#main_chkAllP").prop("checked", true);

    document.querySelector(`.PlotsFrom${value}`).style.display = 'block';
    if(value == 1){
         // fine_celltype Plots차트 그려줌.
         drawCellCountChart(cellPlotsData.fineCountsList); 
         drawCellRateChart(cellPlotsData.fineCountsList);
    } else if(value == 2){
          // main_celltype Plots차트 그려줌.
          drawCellCountChart(cellPlotsData.mainCountsList); 
          drawCellRateChart(cellPlotsData.mainCountsList); 
    }

    $('#spinnerp').hide({}); // 스피너 숨김
    $('#lodingumSP').hide({}); 
    $('#bgHidep').hide({});
    $('#chartdivPlots2').show();
    $('#chartdivPlots').show();
};


let cellUmapData = [];
// 싱글셀 유맵데이터 가져온는 함수
const getSingleCellUmapData = async () => {
    try {
        $.blockUI({
            message : '', 
            });

        $('#spinnerf').show(); // 스피너 표시
        $('#lodingumSU').show(); 
        $('#bgHidef').show();
        $('#chartdiv').hide();
        const res = await fetch(`/get_singleCellUmap`);
        const result = await res.json();
        cellUmapData = result;
         // PLOTS 옵션창에 계속해서 배열이 추가 되므로 기존 생성된 테그 먼저 삭제시킴.
         $('.cellFrom1').find('.input-set').remove();
         $('.cellFrom2').find('.input-set').remove();

       // console.log(result);
        //  좌측 cell type 옵션창 각필드 네임 넣어줌.
        const fine_celltype = document.querySelectorAll('.chk-listf');
        fine_celltype.forEach((node, i) => {
            if(i == 0){ // fine cell type
                result.fine_celltype.forEach((type, j)=>{
                    const span = document.createElement('span');
                    span.classList.add('input-set');
                    span.innerHTML = `
                        <input type="checkbox" id="ipt4-${j+1}" name="cellTypef" class="fineUmapCell" value="${type.fine_celltype}"> 
                        <label for="ipt4-${j+1}"><span class="ico-color circleUf${j+1}"></span>${type.fine_celltype}</label>
                    `;
                    node.appendChild(span);
                    // finecell type 옵션창 각필드 원에 색상 분리해주는 함수호출.
                    divideFinecellTypeColorFn(type.fine_celltype, `circleUf${j+1}`);
                });
            } else if(i == 1){ // main cell type
                result.main_celltype.forEach((type, j) => {
                    const span = document.createElement('span');
                    span.classList.add('input-set');
                    span.innerHTML = `
                        <input type="checkbox" id="ipt4-${j+1}" name="cellTypem" class="mainUmapCell" value="${type.main_celltype}"> 
                        <label for="ipt4-${j+1}"><span class="ico-color circleUm${j+1}"></span>${type.main_celltype}</label>
                    `;
                    node.appendChild(span);
                    // maincell type 옵션창 각필드 원에 색상 분리해주는 함수호출.
                    divideMaincellTypeColorFn(type.main_celltype, `circleUm${j+1}`);
                });
             }
        });

        $('#spinnerf').hide(); // 스피너 숨김
        $('#lodingumSU').hide(); 
        $('#bgHidef').hide();               
        // 초기 렌더링시 체크박스가 all체크로 선택되어 있어야함.
        // Fine cell type 부문.
        $("input[name=cellTypef]").prop("checked", true);
        $("#fine_chkAll").prop("checked", true);
        // Main cell type 부문.
        $("input[name=cellTypem]").prop("checked", true);
        $("#main_chkAll").prop("checked", true);
        $('#chartdiv').show();

        // umap차트 그리는 함수에 데이터 넘겨줌.
        drawSingleCellUmapChart(result.singleCellUmapList);  
    } catch(e){
        $('#spinnerf').hide(); // 스피너 숨김 
        $('#lodingumSU').hide(); 
        $('#bgHidef').hide();
        $('.chart-area').show()
        console.log(e);
    }                
    $.unblockUI();
};

// Umap cell type 선택옵션창 보이는 함수  스피너다시 해결
const showUmapCellType = (value) => {
    $('#umapCell').val(value);
    $('#spinnerf').show('fast'); // 스피너 표시
    $('#lodingumSU').show('fast'); 
    $('#bgHidef').show('fast');
    $('#chartdiv').hide();

    //탭 차트 옵션창 보이기
    const cellFromArr = document.querySelectorAll('.cellFrom');
    cellFromArr.forEach((node) => {
        node.style.display = 'none';
    }); 
    // 체크박스 초기화
    const checkboxArrF = document.getElementsByName('cellTypef');
    checkboxArrF.forEach((box) => {
        box.checked = false;
    });
    const checkboxArrM = document.getElementsByName('cellTypem');
    checkboxArrM.forEach((box) => {
        box.checked = false;
    });

    // 초기 렌더링시 체크박스가 all체크로 선택되어 있어야함.
    // Fine cell type 부문.
    $("input[name=cellTypef]").prop("checked", true);
    $("#fine_chkAll").prop("checked", true);
    // Main cell type 부문.
    $("input[name=cellTypem]").prop("checked", true);
    $("#main_chkAll").prop("checked", true);

    document.querySelector(`.cellFrom${value}`).style.display = 'block';                
    // umap차트 그리는 함수에 데이터 넘겨줌.
    drawSingleCellUmapChart(cellUmapData.singleCellUmapList);

    $('#spinnerf').hide('sholw'); // 스피너 숨김
    $('#lodingumSU').hide('sholw'); 
    $('#bgHidef').hide('sholw');
    $('#chartdiv').show();
};

// umap차트 그리는 함수.
const drawSingleCellUmapChart = (SingleCellUmapList) => {
    const rootu = am5.Root.new("chartdiv");
    // Set themes
    rootu.setThemes([
        am5themes_Animated.new(rootu)
    ]);

    rootu._logo.dispose();  // amCharts 로고 제거

    let chartu;

    if (chartu) {
        chartu.dispose(); // 기존 차트 제거
    }
    // Create chart
    chartu = rootu.container.children.push(am5xy.XYChart.new(rootu, {
        panX: true,
        panY: true,
        wheelY: "zoomXY",
        pinchZoomX: true,
        pinchZoomY: true
    }));

    // Create axes
    const xAxis = chartu.xAxes.push(am5xy.ValueAxis.new(rootu, {
        renderer: am5xy.AxisRendererX.new(rootu, { minGridDistance: 50 }),
        tooltip: am5.Tooltip.new(rootu, {})
    }));

    var yAxis = chartu.yAxes.push(am5xy.ValueAxis.new(rootu, {
        renderer: am5xy.AxisRendererY.new(rootu, {}),
        tooltip: am5.Tooltip.new(rootu, {})
    }));

    // Create series
    var series = chartu.series.push(am5xy.LineSeries.new(rootu, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "y",
        valueXField: "x",
        valueField: "value",
        tooltip: am5.Tooltip.new(rootu, {
            labelText: "x: {valueX}, y: {valueY}, value: {value}"
        })
    }));

    series.strokes.template.set("visible", false);

    // Add cursor
    chartu.set("cursor", am5xy.XYCursor.new(rootu, {
        xAxis: xAxis,
        yAxis: yAxis,
        snapToSeries: [series]
    }));

    const data = [];
    for (let i = 0; i <SingleCellUmapList.length; i++) {
        if($('#umapCell').val() == 1) { // fine cell type color
            if(SingleCellUmapList[i]['fine_celltype'] == "Tumor"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#67DADC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "CD4+ Tn"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#8067DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "CD4+ Tm"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#6771DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "CD4+ Tfh"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#6794DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "CD4+ Treg"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#A367DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "CD8+ Tc"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#C767DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "CD8+ Tex"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DC67CE"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "Proliferating T"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#67DCBB"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "NK"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#7DDC67"), value: 6.5 });
            }  else if (SingleCellUmapList[i]['fine_celltype'] == "Plasma B"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#67DC98"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "Follicular B"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DC8C67"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "Naive B"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#67DC75"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "GC B"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DCAF67"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "Monocyte"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#A0DC67"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "MARCO+ TAM"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DCD267"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "CD16+ TAM"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DC67AB"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "CD16- TAM"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DC6788"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "cDC1"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#6771DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "cDC2"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#8067DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "pDC"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#A367DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "Mast"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#C3DC67"), value: 6.5 });
            }  else if (SingleCellUmapList[i]['fine_celltype'] == "Vein EC"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#6794DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "Capillary EC"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DC6967"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "CAF"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#67B7DC"), value: 6.5 });
            } else if (SingleCellUmapList[i]['fine_celltype'] == "VSMC Fibroblast"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#67B7DC"), value: 6.5 });
            }
        } else if($('#umapCell').val() == 2) { // main cell type color
            if(SingleCellUmapList[i]['main_celltype'] == "TAMs"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DCD267"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "Tumor"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#C3DC67"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "CD4+ T cells"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#6794DC"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "CD8+ T cells"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#8067DC"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "Dendritic cells"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#8067DC"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "Monocytes"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DC67AB"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "Plasma B cells"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DCAF67"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "Mast cells"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DC67CE"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "Endothelial cells"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#A367DC"), value: 6.5 });
            }  else if(SingleCellUmapList[i]['main_celltype'] == "NK cells"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#DC6788"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "B cells"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#67B7DC"), value: 6.5 });
            } else if(SingleCellUmapList[i]['main_celltype'] == "Fibroblasts"){
                data.push({ x: parseFloat(SingleCellUmapList[i]['umap_1']), y: parseFloat(SingleCellUmapList[i]['umap_2']), color: am5.Color.fromString("#C767DC"), value: 6.5 });
            }
        }
    }

    // add graphics to line series which will contain bullets
    var canvasBullets = series.children.push(am5.Graphics.new(rootu, {}));

    canvasBullets.set("draw", (display) => {
        // loop through all data items 
        am5.array.each(series.dataItems, (dataItem) => {
            // set fill style from data context
            var dataContext = dataItem.dataContext;
            if (dataContext) {
                const point = dataItem.get("point");
            if (point) {
                display.beginPath();
                display.beginFill(dataContext.color);
                display.drawCircle(point.x, point.y, dataContext.value / 5);
                display.endFill();
            }
        }    
        })
    });            

    // user data is set on each redraw, so we use this to mark draw as dirty
    series.strokes.template.on("userData", drawBullets);

    function drawBullets() {
        canvasBullets._markDirtyKey("draw");
    }

    series.data.setAll(data);
};