angular.module('myApp')
.factory('chartUtil', ['$http', function chartUtilFactory($http) {
    return {
        getHistoFromMinApi: function(type, limit, aggr, from, to) {
            var url = "https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=365";
            return $http.get(url);
        },
        
        bottomVolume: function(){
            
        },
        addSimpleMovingAverage: function(dataSet,panel,field,period,dataSetForIndicators,text){
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
			};
			dataSet.fieldMappings.push({fromField: avgField,toField: avgField});
			
			var dataSetProvider = dataSet.dataProvider;
			
			dataSetProvider=dataSetForIndicators.concat(dataSetProvider);
			
			this.addSimpleMovingAverageDataPoints(dataSetProvider,period,field,avgField);
			
			dataSet.dataProvider = dataSetProvider.slice(dataSetForIndicators.length);
			
			panel.stockGraphs.push(graph);
        },
    };
}]);