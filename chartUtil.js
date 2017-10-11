angular.module('myApp')
.factory('chartUtil', ['$http', function chartUtilFactory($http) {
    return {
        getHistoFromMinApi: function(type, limit, aggr, from, to) {
            var url = "https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=365";
            return $http.get(url);
        },
        bottomVolume : function(dataSet,panel,from){
			dataSet.fieldMappings.push({fromField: "volumefrom",toField: "volumefrom"});
			panel.title = "Volume "+from;
			panel.stockGraphs[0].valueField = "volumefrom";
		},
		bottomVolumeTo : function(dataSet,panel,to){
			dataSet.fieldMappings.push({fromField: "volumeto",toField: "volumeto"});
			panel.title = "Volume "+to;
			panel.stockGraphs[0].valueField = "volumeto";
		},
        addSimpleMovingAverage: function(dataSet,panel,field,period,dataSetForIndicators){
            var avgField = "SMA"+period;
			var graph={};
			graph.valueField = avgField;
			graph.useDataSetColors= false;
			graph.balloonText = "SMA "+period+":<b>[[value]]</b>";
			graph.lineThickness=1;
			graph.visibleInLegend=false;
			switch(period){
				case 5:
    				graph.lineColor= "yellow";
				break;
				case 13:
					graph.lineColor= "red";
				break;
				case 20:
					graph.lineColor= "blue";
				break;
			}
			dataSet.fieldMappings.push({fromField: avgField,toField: avgField});
			
			var dataSetProvider = dataSet.dataProvider;
			
			dataSetProvider=dataSetForIndicators.concat(dataSetProvider);
			
			//addSimpleMovingAverageDataPoints(dataSetProvider,period,field,avgField);
			
			dataSetProvider=dataSetForIndicators.concat(dataSetProvider);
			
			
			for (var i=0;i<dataSetProvider;i++) {
			    var sum = 0;
			    for(var j=i-(period-1);j<=i;j++){
						sum+= dataSetProvider[j][field];
					}
					dataSetProvider[i][avgField]=(sum/period);
			}
			
			dataSet.dataProvider = dataSetProvider.slice(dataSetForIndicators.length);
			
			panel.stockGraphs.push(graph);
        },
    };
}]);