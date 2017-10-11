angular.module('myApp')
.factory('chartIndicators', ['$http', function chartIndicatorFactory($http) {
    return {
        bottomAroon: function(dataSet,panel,dataSetForIndicators,settings){
			var aroonDown = settings.type+"Down";
			var aroonUp = settings.type+"Up";
			dataSet.fieldMappings.push({fromField: aroonDown,toField: aroonDown});
			dataSet.fieldMappings.push({fromField: aroonUp,toField: aroonUp});
			panel.title = settings.fullName;
			panel.stockGraphs= [{
				valueField: aroonDown,
				lineColor:"red",
				lineThickness: 1,
				balloonText: "Aaron Down:<b>[["+aroonDown+"]]</b>",
				bullet: "none",
				title:"Aroon Down",
				useDataSetColors:false
			},{
				valueField: aroonUp,
				lineColor:"green",
				lineThickness: 1,
				balloonText: "Aaron Up:<b>[["+aroonUp+"]]</b>",
				bullet: "none",
				title:"Aroon Up",
				useDataSetColors:false
			}];
			var dataSetProvider = dataSet.dataProvider;
			dataSetProvider=dataSetForIndicators.concat(dataSetProvider);
			for (var i = 0; i < dataSetProvider.length; i++) {
				var highIndex=i;
				var lowIndex=i;
				var lowValue=dataSetProvider[i]['low'];
				var highValue=dataSetProvider[i]['high'];
				if(i>=settings.period){
					for(var j=i-(settings.period-1);j<=i;j++){
						if(dataSetProvider[j]['low']<=lowValue){
							lowValue=dataSetProvider[j]['low'];
							lowIndex=j;
						}
						if(dataSetProvider[j]['high']>=highValue){
							highValue=dataSetProvider[j]['high'];
							highIndex=j;
						}
					}
				}else{
					for(var j=0;j<=i;j++){
						if(dataSetProvider[j]['low']<=lowValue){
							lowValue=dataSetProvider[j]['low'];
							lowIndex=j;
						}
						if(dataSetProvider[j]['high']>=highValue){
							highValue=dataSetProvider[j]['high'];
							highIndex=j;
						}
					}
				}
				dataSetProvider[i][aroonDown] = util.reduceFloatVal(((settings.period - (i-lowIndex))/settings.period)*100);
				dataSetProvider[i][aroonUp] = util.reduceFloatVal(((settings.period - (i-highIndex))/settings.period)*100);
			}
			dataSet.dataProvider = dataSetProvider.slice(dataSetForIndicators.length);
		}
        
        
    }
}])