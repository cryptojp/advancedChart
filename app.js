angular.module("myApp", [])
  .controller("myController", ['$http', '$scope', 'chartUtil', 'chartIndicators', function($http, $scope, chartUtil, chartIndicators) {
    $scope.currentDataSet = [];
    $scope.chartIndicators = [
      { key: 'NI', name: 'No Indicator', fullName: 'Remove the current indicator', type: 'Clear', period: 0, requiresLogin: false, selected: false, dropdownId: -1 },
      { key: 'SMA5', name: 'SMA 5', fullName: 'Simple Moving Average 5', type: 'SMA', period: 5, requiresLogin: false, selected: false, dropdownId: -1 },
      { key: 'SMA13', name: 'SMA 13', fullName: 'Simple Moving Average 13', type: 'SMA', period: 13, requiresLogin: true, selected: false, dropdownId: -1 },
      { key: 'SMA20', name: 'SMA 20', fullName: 'Simple Moving Average 20', type: 'SMA', period: 20, requiresLogin: true, selected: false, dropdownId: -1 },
      { key: 'SMA30', name: 'SMA 30', fullName: 'Simple Moving Average 30', type: 'SMA', period: 30, requiresLogin: true, selected: false, dropdownId: -1 },
      { key: 'SMA50', name: 'SMA 50', fullName: 'Simple Moving Average 50', type: 'SMA', period: 50, requiresLogin: true, selected: false, dropdownId: -1 },
      { key: 'EMA5', name: 'EMA 5', fullName: 'Exponential Moving Average 5', type: 'EMA', period: 5, requiresLogin: false, selected: false, dropdownId: -1 },
      { key: 'EMA12', name: 'EMA 12', fullName: 'Exponential Moving Average 12', type: 'EMA', period: 12, requiresLogin: true, selected: false, dropdownId: -1 },
      { key: 'EMA26', name: 'EMA 26', fullName: 'Exponential Moving Average 26', type: 'EMA', period: 26, requiresLogin: true, selected: false, dropdownId: -1 },
      { key: 'EMA50', name: 'EMA 50', fullName: 'Exponential Moving Average 50', type: 'EMA', period: 50, requiresLogin: true, selected: false, dropdownId: -1 },
      { key: 'BB5', name: 'BBands 5', fullName: 'Bollinger Bands 5', type: 'BBands', period: 5, requiresLogin: false, selected: false, dropdownId: -1 },
      { key: 'BB13', name: 'BBands 13', fullName: 'Bollinger Bands 13', type: 'BBands', period: 13, requiresLogin: true, selected: false, dropdownId: -1 },
      { key: 'BB20', name: 'BBands 20', fullName: 'Bollinger Bands 20', type: 'BBands', period: 20, requiresLogin: true, selected: false, dropdownId: -1 }
    ];
    $scope.bottomChart = [
      { key: 'VF', name: 'Volume From', fullName: 'Total Volume From', type: 'Volume', period: 1, requiresLogin: false, selected: false },
      { key: 'VT', name: 'Volume To', fullName: 'Total Volume To', type: 'VolumeTo', period: 1, requiresLogin: false, selected: false },
      { key: 'RSI14', name: 'RSI 14', fullName: 'Relative Strength Index 14', type: 'RSI', period: 14, requiresLogin: true, selected: false },
      { key: 'RSI21', name: 'RSI 21', fullName: 'Relative Strength Index 21', type: 'RSI', period: 21, requiresLogin: true, selected: false },
      { key: 'VOLATILITY', name: 'Volatility', fullName: 'Volatility', type: 'VOLATILITY', period: 7, requiresLogin: true, selected: false },
      { key: 'ADL', name: 'ADL', fullName: 'Accumulation Distribution Line', type: 'ADL', period: 1, requiresLogin: false, selected: false },
      { key: 'MACD12269', name: 'MACD 12,26,9', fullName: 'Moving Average Convergence/Divergence Oscillator (12,26,9)', type: 'MACD', period: 35, periodEMA1: 12, periodEMA2: 26, periodEMA3: 9, requiresLogin: false, selected: false },
      { key: 'StochO143', name: 'StochasticO Fast 14,3', fullName: 'Stochastic Oscillator Fast (14,3)', type: 'StochasticO', period: 14, kSMAPeriod: 0, dSMAPeriod: 3, requiresLogin: false, selected: false },
      { key: 'StochO1433', name: 'StochasticO Slow 14,3,3', fullName: 'Stochastic Oscillator Slow (14,3,3)', type: 'StochasticO', period: 14, kSMAPeriod: 3, dSMAPeriod: 3, requiresLogin: true, selected: false },
      { key: 'StochO1033', name: 'StochasticO Full 10,3,3', fullName: 'Stochastic Oscillator Full (10,3,3)', type: 'StochasticO', period: 10, kSMAPeriod: 3, dSMAPeriod: 3, requiresLogin: true, selected: false },
      { key: 'StochO2055', name: 'StochasticO Full 20,5,5', fullName: 'Stochastic Oscillator Full (20,5,5)', type: 'StochasticO', period: 20, kSMAPeriod: 5, dSMAPeriod: 5, requiresLogin: true, selected: false },
      { key: 'Aroon10', name: 'Aroon 10', fullName: 'Aroon 10 Days', type: 'Aroon', period: 10, requiresLogin: false, selected: false },
      { key: 'Aroon25', name: 'Aroon 25', fullName: 'Aroon 25 Days', type: 'Aroon', period: 25, requiresLogin: true, selected: false },
      { key: 'OBV', name: 'On Balance Volume', fullName: 'On Balance Volume (OBV)', type: 'OBV', period: 0, requiresLogin: false, selected: false }
    ];
    $scope.chartIndicatorSelection = [
      { name: 'firstDropdown', type: "dropdown", requiresLogin: false },
      { name: 'secondDropdown', type: "dropdown", requiresLogin: false },
      { name: 'thirdDropdown', type: "dropdown", requiresLogin: true },
    ];
    $scope.selectedIndicators = [0, 0, 0];
    $scope.currentBottomChart = [];

    /*it is the max of the max values of all the peridos of the chartIndicators and bottomChart
    var maxChartIndicatorPeriod = ($scope.chartIndicators.concat($scope.currentBottomChart)).reduce(function(a, b) {
      return { period: Math.max(a.period, b.period) };
    }).period;
    var maxChartIndicatorSubPeriod = 0;
    for (var i = 0; i < $scope.chartPeriod.length; ++i) {
      var indicatorKeys = Object.keys($scope.chartPeriod[i].indicatorPeriods);
      for (var j = 0; j < indicatorKeys.length; ++j) {
        maxChartIndicatorSubPeriod = Math.max(maxChartIndicatorSubPeriod, $scope.chartPeriod[i].indicatorPeriods[indicatorKeys[j]]);
      }
    }
    $scope.maxIndicatorPeriod = Math.max(maxChartIndicatorPeriod, maxChartIndicatorSubPeriod);
    */


    $scope.handleNewIndicator = function(dropId, indicatorId) {
      if ($scope.selectedIndicators[dropId]['name'] == $scope.chartIndicators[indicatorId]['name']) {
        return;
      }
      else {
        $scope.selectedIndicators[dropId] = {
          "key": $scope.chartIndicators[indicatorId]['key'],
          "name": $scope.chartIndicators[indicatorId]['name'],
          "type": $scope.chartIndicators[indicatorId]['type'],
          "period":$scope.chartIndicators[indicatorId]['period']
        };
        $scope.generateNewChart($scope.currentDataSet);
      }
    };

    $scope.handleBottomChart = function(index) {
      if ($scope.currentBottomChart['key'] == $scope.bottomChart[index]['key']) {
        return;
      }
      else {
        $scope.currentBottomChart = {
          "key": $scope.bottomChart[index]['key'],
          "name": $scope.bottomChart[index]['name'],
          "type": $scope.bottomChart[index]['type'],
          "period":$scope.bottomChart[index]['period']
        };
        $scope.generateNewChart($scope.currentDataSet);
      }
    };

    chartUtil.getHistoFromMinApi().then(function(response) {
      $scope.currentDataSet = response.data.Data;
      for (var index in $scope.currentDataSet) {
        $scope.currentDataSet[index]['time'] = new Date($scope.currentDataSet[index]['time'] * 1000);
      }
      $scope.generateNewChart($scope.currentDataSet);
    });


    $scope.generateNewChart = function(data) {
      $scope.chartConfig = {
        type: "stock",
        theme: "none",
        color: "#fff",
        dataSets: [{
          dataProvider: data,
          title: "",
          fieldMappings: [{
            fromField: "open",
            toField: "open"
          }, {
            fromField: "high",
            toField: "high"
          }, {
            fromField: "low",
            toField: "low"
          }, {
            fromField: "close",
            toField: "close"
          }],
          compared: false,
          categoryField: "time"
        }],
        dataDateFormat: "YYYY-MM-DD",
        panels: [{
            title: "CryptoCompare Index:BTC",
            percentHeight: 70,
            stockGraphs: [{
              type: "candlestick",
              id: "g1",
              openField: "open",
              closeField: "close",
              highField: "high",
              lowField: "low",
              valueField: "close",
              lineColor: "#fff",
              fillColors: "#fff",
              negativeLineColor: "#db4c3c",
              negativeFillColors: "#db4c3c",
              fillAlphas: 1,
              comparedGraphLineThickness: 2,
              columnWidth: 0.7,
              useDataSetColors: false,
              comparable: true,
              compareField: "close",
              showBalloon: false,
              proCandlesticks: true
            }],
            stockLegend: {
              valueTextRegular: undefined,
              periodValueTextComparing: "[[percents.value.close]]%"
            }
          },
          {
            title: "Volume",
            percentHeight: 30,
            marginTop:0,
            columnWidth: 0.6,
            showCategoryAxis: false,
            stockGraphs: [{
              openField: "close",
              type: "column",
              valueField: "volumeto",
              showBalloon: false,
              fillAlphas: 1,
              fillColors: "#fff",
              useDataSetColors: false
            }],

            stockLegend: {
              markerType: "none",
              markerSize: 0,
              labelText: "",
              periodValueTextRegular: "[[value.close]]"
            },

            valueAxes: [{
              usePrefixes: true
            }]
          }
        ],

        panelsSettings: {
          //    "color": "#fff",
          plotAreaFillColors: "#333",
          plotAreaFillAlphas: 1,
          marginLeft: 60,
          marginTop: 5,
          marginBottom: 5
        },
        
        

        chartScrollbarSettings: {
          graph: "g1",
          graphType: "line",
          usePeriod: "WW",
          backgroundColor: "#333",
          graphFillColor: "#666",
          graphFillAlpha: 0.5,
          gridColor: "#555",
          gridAlpha: 1,
          selectedBackgroundColor: "#444",
          selectedGraphFillAlpha: 1
        },

        categoryAxesSettings: {
          equalSpacing: true,
          gridColor: "#555",
          gridAlpha: 1
        },

        valueAxesSettings: {
          gridColor: "#555",
          gridAlpha: 1,
          inside: false,
          showLastLabel: true
        },
        chartCursorSettings: {
          pan: true,
          valueLineEnabled: true,
          valueLineBalloonEnabled: true
        },

        legendSettings: {
          //"color": "#fff"
        },

        stockEventsSettings: {
          showAt: "high",
          type: "pin"
        },

        balloon: {
          textAlign: "left",
          offsetY: 10
        },

        periodSelector: {
          position: "top",
          periods: [{
            period: "DD",
            count: 1,
            label: "1D"
          }, {
            period: "DD",
            count: 10,
            label: "10D"
          }, {
            period: "MM",
            count: 1,
            label: "1M"
          }, {
            period: "MM",
            count: 6,
            label: "6M"
          }, {
            period: "YYYY",
            count: 1,
            label: "1Y"
          }, {
            period: "MAX",
            label: "MAX"
          }]
        }
      };
      
      for (var index in $scope.selectedIndicators) {
        switch($scope.selectedIndicators[index]['type']) {
					case "SMA":
						chartUtil.addSimpleMovingAverage($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[0],'close',$scope.selectedIndicators[index].period,data);
					break;
					case "EMA":
						chartIndicators.addExponentialMovingAverage($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[0],'close',$scope.chartIndicators[i].period,$scope.dataSetForIndicators);
					break;
				 	case "BBands":
						chartIndicators.addBollingerBands($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[0],'close',$scope.chartIndicators[i].period,$scope.dataSetForIndicators);
					break;
				}
      }
      

      switch ($scope.currentBottomChart['type']) {
        case "Volume":
          chartUtil.bottomVolume($scope.chartConfig.dataSets[0], $scope.chartConfig.panels[1], "BTC");
          break;
        case "VolumeTo":
          chartUtil.bottomVolumeTo($scope.chartConfig.dataSets[0], $scope.chartConfig.panels[1], "USD");
          break;
        case "RSI":
          console.log('RSI'); //chartIndicators.bottomRSI($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[1],$scope.dataSetForIndicators,$scope.bottomChart[i]);
          break;
        case "VOLATILITY":
          //chartIndicators.bottomVolatility($scope.chartConfig.dataSets[0], $scope.chartConfig.panels[1], $scope.dataSetForIndicators, $scope.currentPeriod, $scope.bottomChart[i]);
          break;
        case "ADL":
          console.log('ADL'); //chartIndicators.bottomADL($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[1],$scope.dataSetForIndicators,$scope.bottomChart[i]);
          break;
        case "MACD":
          console.log('ADL'); //chartIndicators.bottomMACD($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[1],$scope.dataSetForIndicators,$scope.bottomChart[i]);
          break;
        case "StochasticO":
          console.log('ADL'); //chartIndicators.bottomStochasticO($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[1],$scope.dataSetForIndicators,$scope.bottomChart[i]);
          break;
        case "Aroon":
          chartIndicators.bottomAroon($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[1],$scope.dataSetForIndicators,$scope.currentBottomChart);
          break;
        case "OBV":
          console.log('ADL'); //chartIndicators.bottomOBV($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[1],$scope.dataSetForIndicators,$scope.bottomChart[i]);
          break;
      }

      var chart = AmCharts.makeChart("chartdiv", $scope.chartConfig);
      console.log(chart);

    };



  }]);
