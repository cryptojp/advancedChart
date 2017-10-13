$(document).ready(function() {
    var currentDataSet = [];
    var chartIndicators = {
        'None': { name: 'No Indicator', fullName: 'Remove the current indicator', type: 'Clear', period: 0, dropdownId: -1 },
        'SMA5': { name: 'SMA 5', fullName: 'Simple Moving Average 5', type: 'SMA', period: 5, dropdownId: -1 },
        'SMA13': { name: 'SMA 13', fullName: 'Simple Moving Average 13', type: 'SMA', period: 13, dropdownId: -1 },
        'SMA20': { name: 'SMA 20', fullName: 'Simple Moving Average 20', type: 'SMA', period: 20, dropdownId: -1 },
        'SMA30': { name: 'SMA 30', fullName: 'Simple Moving Average 30', type: 'SMA', period: 30, dropdownId: -1 },
        'SMA50': { name: 'SMA 50', fullName: 'Simple Moving Average 50', type: 'SMA', period: 50, dropdownId: -1 },
        'EMA5': { key: 'EMA5', name: 'EMA 5', fullName: 'Exponential Moving Average 5', type: 'EMA', period: 5, dropdownId: -1 },
        'EMA12': { key: 'EMA12', name: 'EMA 12', fullName: 'Exponential Moving Average 12', type: 'EMA', period: 12, dropdownId: -1 },
        'EMA26': { key: 'EMA26', name: 'EMA 26', fullName: 'Exponential Moving Average 26', type: 'EMA', period: 26, dropdownId: -1 },
        'EMA50': { key: 'EMA50', name: 'EMA 50', fullName: 'Exponential Moving Average 50', type: 'EMA', period: 50, dropdownId: -1 },
        'BB5': { key: 'BB5', name: 'BB 5', fullName: 'Bollinger Bands 5', type: 'BB', period: 5, dropdownId: -1 },
        'BB13': { key: 'BB13', name: 'BB 13', fullName: 'Bollinger Bands 13', type: 'BB', period: 13, dropdownId: -1 },
        'BB20': { key: 'BB20', name: 'BB 20', fullName: 'Bollinger Bands 20', type: 'BB', period: 20, dropdownId: -1 }
    };
    var bottomChart = [
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
    var chartPeriod = [
        { name: '1 Hour', shortName: '1 H', maxPoints: 60, type: 'minute', aggregation: 1, periodForTable: 10, periodForTableName: '10 min', period: 'mm', valueGridCount: 7, catGridCount: 10, balloonDateFormat: "JJ:NN" },
        { name: '1 Day', shortName: '1 D', maxPoints: 144, type: 'minute', aggregation: 10, periodForTable: 18, periodForTableName: '3 hours', period: '10mm', valueGridCount: 8, catGridCount: 8, balloonDateFormat: "JJ:NN" },
        { name: '1 Week', shortName: '1 W', maxPoints: 168, type: 'hour', aggregation: 1, periodForTable: 24, periodForTableName: 'day', period: 'hh', valueGridCount: 5, catGridCount: 10, balloonDateFormat: "MMM DD, JJ:NN" },
        { name: '1 Month', shortName: '1 M', maxPoints: 120, type: 'hour', aggregation: 6, periodForTable: 12, periodForTableName: '3 days', period: '6hh', valueGridCount: 6, catGridCount: 10, balloonDateFormat: "MMM DD" },
        { name: '3 Months', shortName: '3 M', maxPoints: 90, type: 'day', aggregation: 1, periodForTable: 10, periodForTableName: '10 days', period: 'DD', valueGridCount: 5, catGridCount: 5, balloonDateFormat: "MMM DD" },
        { name: '6 Months', shortName: '6 M', maxPoints: 180, type: 'day', aggregation: 1, periodForTable: 30, periodForTableName: '30 days', period: 'DD', valueGridCount: 6, catGridCount: 10, balloonDateFormat: "MMM DD" },
        { name: '1 Year', shortName: '1 Y', maxPoints: 365, type: 'day', aggregation: 1, periodForTable: 60, periodForTableName: '60 days', period: 'DD', valueGridCount: 5, catGridCount: 10, balloonDateFormat: "MMM DD" }
    ];
    var socialIndicator = [
        { key: 'ND', name: 'No Social Data', fullName: 'Remove the current social indicator', type: 'Clear', available: "Always", isHidden: false, requiresLogin: false, selected: false },
        { key: 'CCFol', name: 'CryptoComp. Followers', fullName: 'CryptoCompare members that have followed the coin', type: 'followers', available: "CryptoCompare", isHidden: false, requiresLogin: false, selected: false },
        { key: 'CCVie', name: 'CryptoComp. Views', fullName: 'CryptoCompare total page views across all the coin tabs', type: 'total_page_views', available: "CryptoCompare", isHidden: false, requiresLogin: true, selected: false },
        { key: 'FBLik', name: 'FB Likes', fullName: 'Facebook Likes', type: 'fb_likes', available: "Facebook", isHidden: false, requiresLogin: false, selected: false },
        { key: 'FBTAbo', name: 'FB Talking About', fullName: 'Facebook users talking about the currency', type: 'fb_talking_about', available: "Facebook", isHidden: false, requiresLogin: true, selected: false },
        { key: 'TWFol', name: 'Twitter Followers', fullName: 'Twitter followers', type: 'twitter_followers', available: "Twitter", isHidden: false, requiresLogin: true, selected: false },
        { key: 'TWSta', name: 'Twitter Statuses', fullName: 'Twitter statuses', type: 'twitter_statuses', available: "Twitter", isHidden: false, requiresLogin: false, selected: false },
        { key: 'RESub', name: 'Reddit Subscribers', fullName: 'Reddit subscribers', type: 'reddit_subscribers', available: "Reddit", isHidden: false, requiresLogin: true, selected: false },
        { key: 'REAUse', name: 'Reddit Active Users', fullName: 'Reddit active users', type: 'reddit_active_users', available: "Reddit", isHidden: false, requiresLogin: false, selected: false },
        { key: 'REPHou', name: 'Reddit Posts/Hour', fullName: 'Reddit posts per hour as an average over the previous 100 posts', type: 'reddit_posts_per_hour', available: "Reddit", isHidden: false, requiresLogin: true, selected: false },
        { key: 'REPDay', name: 'Reddit Posts/Day', fullName: 'Reddit posts per day as an average over the previous 100 posts', type: 'reddit_posts_per_day', available: "Reddit", isHidden: false, requiresLogin: true, selected: false },
        { key: 'RECHou', name: 'Reddit Comments/Hour', fullName: 'Reddit comments per hour as an average over the previous 100 comments', type: 'reddit_comments_per_hour', isHidden: false, available: "Reddit", requiresLogin: true, selected: false },
        { key: 'RECDay', name: 'Reddit Comments/Day', fullName: 'Reddit comments per day as an average over the previous 100 comments', type: 'reddit_comments_per_day', isHidden: false, available: "Reddit", requiresLogin: true, selected: false },
        { key: 'CRSta', name: 'Code Repo Stars', fullName: 'Code repository stars', type: 'code_repo_stars', available: "CodeRepository", isHidden: false, requiresLogin: false, selected: false },
        { key: 'CRFor', name: 'Code Repo Forks', fullName: 'Code repository forks', type: 'code_repo_forks', available: "CodeRepository", isHidden: false, requiresLogin: true, selected: false },
        { key: 'CROPul', name: 'Code Repo Open Pulls', fullName: 'Code repository open pull issues', type: 'code_repo_open_pull_issues', available: "CodeRepository", isHidden: false, requiresLogin: true, selected: false },
        { key: 'CRCPul', name: 'Code Repo Closed Pulls', fullName: 'Code repository closed pull issues', type: 'code_repo_closed_pull_issues', available: "CodeRepository", isHidden: false, requiresLogin: true, selected: false }
    ];
    var selectedIndicators = [0, 0, 0];
    var currentBottomChart = [];
    var currentPeriod = [];
    var chartUtil = {
        bottomVolumeTo: function(dataSet, panel, to) {
            dataSet.fieldMappings.push({ fromField: "volumeto", toField: "volumeto" });
            panel.title = "Volume " + to;
            panel.stockGraphs[0].valueField = "volumeto";
        },
        bottomVolumeFrom: function(dataSet, panel, from) {
            dataSet.fieldMappings.push({ fromField: "volumefrom", toField: "volumefrom" });
            panel.title = "Volume " + from;
            panel.stockGraphs[0].valueField = "volumefrom";
        }
    };
    var addIndicators = {
        addOverlayChart: function(dataSet, panel, settings) {
            dataSet.fieldMappings.push({ fromField: settings.type, toField: settings.type, dataProvider: currentSocialData });
            panel.valueAxes.push({
                id: "a2",
                title: settings.name,
                position: "right",
                gridAlpha: 0,
                axisAlpha: 1,
                axisColor: "white",
                labelsEnabled: true
            });
            var socialDataGraph = {
                valueField: settings.type,
                valueAxis: "a2",
                lineColor: "green",
                lineThickness: 1,
                balloonText: settings.name + ":<b>[[" + settings.type + "]]</b>",
                bullet: "none",
                title: settings.name,
                useDataSetColors: false,
                visibleInLegend: false,
                legendValueText: "[[" + settings.type + "]]"
            };
            panel.stockGraphs.push(socialDataGraph);
        },
        SimpleMovingAverage: function(dataSet, panel, field, period, dataSetForIndicators) {
            var avgField = "SMA" + period;
            var graph = {};
            graph.valueField = avgField;
            graph.useDataSetColors = false;
            graph.balloonText = "SMA " + period + ":<b>[[value]]</b>";
            graph.lineThickness = 1;
            graph.visibleInLegend = false;
            switch (period) {
                case 5:
                    graph.lineColor = "yellow";
                    break;
                case 13:
                    graph.lineColor = "red";
                    break;
                case 20:
                    graph.lineColor = "blue";
                    break;
                case 30:
                    graph.lineColor = "pink";
                    break;
                case 50:
                    graph.lineColor = "orange";
                    break;
            }
            dataSet.fieldMappings.push({ fromField: avgField, toField: avgField });
            var dataSetProvider = dataSet.dataProvider;
            dataSetProvider = dataSetForIndicators.concat(dataSetProvider);
            for (var i = 0; i < dataSetProvider.length; i++) {
                var sum = 0;
                if (i >= period) {
                    for (var j = i - (period - 1); j <= i; j++) {
                        sum += dataSetProvider[j][field];
                    }
                    dataSetProvider[i][avgField] = sum / period;
                }
                else {
                    for (var j = 0; j <= i; j++) {
                        sum += dataSetProvider[j][field];
                    }
                    dataSetProvider[i][avgField] = sum / (i + 1);
                }
            }
            dataSet.dataProvider = dataSetProvider.slice(dataSetForIndicators.length);
            panel.stockGraphs.push(graph);
        },
        ExponentialMovingAverage: function(dataSet, panel, field, period, dataSetForIndicators) {
            var avgField = "EMA" + period;
            var graph = {};
            graph.valueField = avgField;
            graph.useDataSetColors = false;
            graph.balloonText = "EMA " + period + ":<b>[[value]]</b>";
            graph.lineThickness = 1;
            graph.visibleInLegend = false;
            switch (period) {
                case 5:
                    graph.lineColor = "green";
                    break;
                case 12:
                    graph.lineColor = "blue";
                    break;
                case 26:
                    graph.lineColor = "yellow";
                    break;
                case 50:
                    graph.lineColor = "white";
                    break;
            }
            dataSet.fieldMappings.push({ fromField: avgField, toField: avgField });
            var dataSetProvider = dataSet.dataProvider;
            dataSetProvider = dataSetForIndicators.concat(dataSetProvider);
            var sum = 0;
            var totalPoints = 0;
            var emaMultiplier = 2 / (period + 1);
            var firstEMA = 0;
            if (period > dataSetForIndicators.length) {
                if (dataSetForIndicators.length == 0) {
                    sum = dataSetProvider[0][field];
                    totalPoints = 1;
                }
                else {
                    for (var i = 0; i < dataSetForIndicators.length; i++) {
                        sum += dataSetProvider[i][field];
                    }
                    totalPoints = dataSetForIndicators.length;
                }
            }
            else {
                for (var i = dataSetForIndicators.length - period; i < dataSetForIndicators.length; i++) {
                    sum += dataSetProvider[i][field];
                }
                totalPoints = period;
            }

            firstEMA = (sum / totalPoints);
            dataSetProvider[0][avgField] = firstEMA;
            for (var i = 1; i < dataSetProvider.length; i++) {
                dataSetProvider[i][avgField] = (dataSetProvider[i][field] - dataSetProvider[i - 1][avgField]) * emaMultiplier + dataSetProvider[i - 1][avgField];
            }
            dataSet.dataProvider = dataSetProvider.slice(dataSetForIndicators.length);
            panel.stockGraphs.push(graph);
        },
        BollingerBands: function(dataSet, panel, field, period, dataSetForIndicators) {
            var avgFieldUp = "BBands" + period + "Up";
            var avgFieldDown = "BBands" + period + "Down";
            var squaredDifferance = "MediumSquared" + period;
            var sma = "SMABollBands" + period;
            var graphUp = {};
            var graphDown = {};
            var dataSetForIndicatorsLength = dataSetForIndicators.length;

            graphUp.valueField = avgFieldUp;
            graphUp.useDataSetColors = false;
            graphUp.balloonText = "BBand " + period + " Top:<b>[[value]]</b>";
            graphUp.lineThickness = 2;
            graphUp.visibleInLegend = false;

            graphDown.valueField = avgFieldDown;
            graphDown.useDataSetColors = false;
            graphDown.balloonText = "BBand " + period + " Bottom:<b>[[value]]</b>";
            graphDown.lineThickness = 2;
            graphDown.visibleInLegend = false;
            switch (period) {
                case 5:
                    graphUp.lineColor = "orange";
                    graphDown.lineColor = "orange";
                    break;
                case 13:
                    graphUp.lineColor = "red";
                    graphDown.lineColor = "red";
                    break;
                case 20:
                    graphUp.lineColor = "green"
                    graphDown.lineColor = "green";
                    break;
            };
            dataSet.fieldMappings.push({ fromField: avgFieldUp, toField: avgFieldUp });
            dataSet.fieldMappings.push({ fromField: avgFieldDown, toField: avgFieldDown });
            var dataSetProvider = dataSet.dataProvider;
            dataSetProvider = dataSetForIndicators.concat(dataSetProvider);
            for (var i = 0; i < dataSetProvider.length; i++) {
                var sum = 0;
                var sumSqrDiff = 0;
                if (i >= period) {
                    for (var j = i - (period - 1); j <= i; j++) {
                        sum += dataSetProvider[j][field];
                        if (j < i) {
                            sumSqrDiff += dataSetProvider[j][squaredDifferance];
                        }
                    }
                    var sqrDifference = dataSetProvider[i][field] - sum / period;
                    sqrDifference = sqrDifference * sqrDifference;
                    sumSqrDiff += sqrDifference;
                    dataSetProvider[i][squaredDifferance] = sqrDifference;
                    dataSetProvider[i][sma] = sum / period;
                    var deviation = Math.sqrt(sumSqrDiff / period);
                    dataSetProvider[i][avgFieldUp] = dataSetProvider[i][sma] + 2 * deviation;
                    dataSetProvider[i][avgFieldDown] = dataSetProvider[i][sma] - 2 * deviation;
                }
                else {
                    for (var j = 0; j <= i; j++) {
                        sum += dataSetProvider[j][field];
                        if (j < i) {
                            sumSqrDiff += dataSetProvider[j][squaredDifferance];
                        }
                    }
                    var sqrDifference = dataSetProvider[i][field] - sum / (i + 1);
                    sqrDifference = sqrDifference * sqrDifference;
                    sumSqrDiff += sqrDifference;
                    dataSetProvider[i][squaredDifferance] = sqrDifference;
                    dataSetProvider[i][sma] = sum / (i + 1);
                    var deviation = Math.sqrt(sumSqrDiff / (i + 1));
                    dataSetProvider[i][avgFieldUp] = dataSetProvider[i][sma] + 2 * deviation;
                    dataSetProvider[i][avgFieldDown] = dataSetProvider[i][sma] - 2 * deviation;
                }
            }
            dataSet.dataProvider = dataSetProvider.slice(dataSetForIndicators.length);
            panel.stockGraphs.push(graphUp);
            panel.stockGraphs.push(graphDown);
        },
        RSI: function(dataSet, panel, dataSetForIndicators, settings) {
            var lineColor = "lineColor";
            dataSet.fieldMappings.push({ fromField: settings.type, toField: settings.type });
            panel.title = settings.fullName;
            panel.stockGraphs = [{
                id: settings.type,
                valueField: settings.type,
                lineColorField: lineColor,
                lineThickness: 1,
                balloonText: settings.type + ":<b>[[" + settings.type + "]]</b>",
                bullet: "none",
                useDataSetColors: false
            }];
            dataSet.stockEvents = [];
            var dataSetProvider = dataSet.dataProvider;
            dataSetProvider = dataSetForIndicators.concat(dataSetProvider);
            for (var i = 0; i < dataSetProvider.length; i++) {
                var gainSum = 0;
                var lossSum = 0;
                if (i >= settings.period) {
                    for (var j = i - (settings.period - 1); j <= i; j++) {
                        var diffOpenClose = dataSetProvider[j]['close'] - dataSetProvider[j]['open'];
                        if (diffOpenClose > 0) {
                            gainSum += diffOpenClose;
                        }
                        if (diffOpenClose < 0) {
                            lossSum += Math.abs(diffOpenClose);
                        }
                    }
                }
                else {
                    for (var j = 0; j <= i; j++) {
                        var diffOpenClose = dataSetProvider[j]['close'] - dataSetProvider[j]['open'];
                        if (diffOpenClose > 0) {
                            gainSum += diffOpenClose;
                        }
                        if (diffOpenClose < 0) {
                            lossSum += Math.abs(diffOpenClose);
                        }
                    }
                }
                dataSetProvider[i][settings.type] = (100 - 100 / (1 + (gainSum / settings.period) / (lossSum / settings.period)));
            }

            panel.stockLegend.valueTextRegular = "[[" + settings.type + "]] " + settings.type;
            dataSet.dataProvider = dataSetProvider.slice(dataSetForIndicators.length);
            dataSetProvider = dataSet.dataProvider;
            /*add the buy and sell events*/
            var currentIndex = 0;
            var maxLength = dataSetProvider.length;
            while (currentIndex < maxLength - 1) {
                if (dataSetProvider[currentIndex][settings.type] > 70) {
                    var max = dataSetProvider[currentIndex][settings.type];
                    var dateForMax = dataSetProvider[currentIndex]['time'];
                    while (dataSetProvider[currentIndex][settings.type] > 70 && currentIndex < maxLength - 1) {
                        if (dataSetProvider[currentIndex][settings.type] > max) {
                            max = dataSetProvider[currentIndex][settings.type];
                            dateForMax = dataSetProvider[currentIndex]['time'];
                        }
                        dataSetProvider[currentIndex][lineColor] = "red";
                        currentIndex++;
                    }
                    dataSet.stockEvents.push({
                        date: new Date(dateForMax),
                        type: "arrowDown",
                        backgroundColor: "red",
                        borderColor: "red",
                        color: "red",
                        rollOverColor: "pink",
                        graph: settings.type,
                        description: "Sell signal!"
                    });
                }
                else if (dataSetProvider[currentIndex][settings.type] < 30) {
                    var min = dataSetProvider[currentIndex][settings.type];
                    var dateForMin = dataSetProvider[currentIndex]['time'];
                    while (dataSetProvider[currentIndex][settings.type] < 30 && currentIndex < maxLength - 1) {
                        if (dataSetProvider[currentIndex][settings.type] < min) {
                            min = dataSetProvider[currentIndex][settings.type];
                            dateForMin = dataSetProvider[currentIndex]['time'];
                        }
                        dataSetProvider[currentIndex][lineColor] = "green";
                        currentIndex++;
                    }
                    dataSet.stockEvents.push({
                        date: new Date(dateForMin),
                        type: "arrowUp",
                        backgroundColor: "green",
                        borderColor: "green",
                        color: "green",
                        rollOverColor: "cyan",
                        graph: settings.type,
                        description: "Buy signal!"
                    });
                }
                else {
                    dataSetProvider[currentIndex][lineColor] = "black";
                    currentIndex++;
                }
            }
            //add the two RSI limits to mapping and push the charts
            panel.valueAxes = [];
            panel.valueAxes.push({
                guides: [{ value: 70, toValue: 70, dashLength: 5, label: "Overbought", position: "right", fontSize: 9, lineAlpha: 1, lineThickness: 1, color: colorOptions.Red.Hex, lineColor: colorOptions.Red.Hex },
                    { value: 30, toValue: 30, dashLength: 5, label: "Oversold", position: "right", fontSize: 9, lineAlpha: 1, lineThickness: 1, color: colorOptions.Green.Hex, lineColor: colorOptions.Green.Hex }
                ]
            });
        }
    };
    var generateNewChart = function() {
        var chartData = currentDataSet;
        var chartConfig = {
            allLabels: "white",
            type: "stock",
            theme: "none",
            color: "white",
            dataSets: [{
                dataProvider: chartData,
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
            panels: [{
                    title: "CryptoCompare Index: BTC",
                    color: "#fff",
                    fontSize: 8,
                    percentHeight: 65,
                    showCategoryAxis: false,
                    stockGraphs: [{
                        type: "candlestick",
                        id: "g1",
                        autoMargins: false,
                        marginBottom: 0,
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
                        showBalloon: true,
                        proCandlesticks: true
                    }],
                    valueAxes: [{
                        id:"a1",
                        axisColor: "white",
                        autoGridCount: false,
                        gridCount: currentPeriod.valueGridCount,
                    }],
                    stockLegend: {
                        valueTextRegular: undefined,
                        periodValueTextComparing: "[[percents.value.close]]%"
                    }
                },
                {
                    title: "Volume",
                    percentHeight: 35,
                    fontSize: 8,
                    autoMargins: false,
                    marginTop: 1,
                    columnWidth: 0.6,
                    showCategoryAxis: true,
                    stockGraphs: [{
                        openField: "close",
                        type: "column",
                        valueField: "volumeto",
                        showBalloon: false,
                        fillAlphas: 1,
                        fillColors: "#3a89ff",
                        lineColor: "#c4dbff",
                        lineAlpha: 1,
                        useDataSetColors: false
                    }],
                    stockLegend: {
                        markerType: "none",
                        markerSize: 0,
                        labelText: "",
                        periodValueTextRegular: "[[value.close]]"
                    },
                    valueAxes: [{
                        usePrefixes: false
                    }]
                }
            ],
            panelsSettings: {
                color: "#fff",
                plotAreaFillColors: "#333",
                plotAreaFillAlphas: 1,
                marginLeft: 60,
                marginTop: 5,
                marginBottom: 5
            },
            categoryAxesSettings: {
                equalSpacing: true,
                gridColor: "#555",
                gridAlpha: 1,
                axisColor: "white",
                color: "white",
                parseDates: true,
                dateFormats: [
                    { period: 'mm', format: 'JJ:NN' },
                    { period: '10 mm', format: 'JJ:NN DD' },
                    { period: 'hh', format: 'JJ:NN' },
                    { period: 'DD', format: 'DD MMM' },
                    { period: 'WW', format: 'MMM DD' },
                    { period: 'MM', format: 'MMM YY' },
                    { period: 'YYYY', format: 'YYYY' }
                ],
            },
            valueAxesSettings: {
                gridColor: "#555",
                gridAlpha: 1,
                axisColor: "white",
                color: "white",
                inside: true,
                showLastLabel: true,
                autoMargins: false,
                marginTop: 0
            },
            chartCursorSettings: {
                pan: true,
                valueLineEnabled: true,
                valueLineBalloonEnabled: true,
                valueBalloonsEnabled: true,
                categoryBalloonDateFormats: [
                    { period: 'fff', format: 'JJ:NN:SS' },
                    { period: 'ss', format: 'JJ:NN:SS' },
                    { period: 'mm', format: 'JJ:NN' },
                    { period: 'hh', format: 'MMM DD, JJ:NN' },
                    { period: 'DD', format: 'MMM DD' },
                    { period: 'WW', format: 'YYYY MMM DD' },
                    { period: 'MM', format: 'YYYY MMM' },
                    { period: 'YYYY', format: 'YYYY' }
                ]
            },
            chartScrollbarSettings: {
                enabled: false
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
            }
        };

        addIndicators.addOverlayChart(chartConfig.dataSets[0], chartConfig.panels[0], currentSocialIndicator);

        for (var index in selectedIndicators) {
            switch (selectedIndicators[index]['type']) {
                case "SMA":
                    addIndicators.SimpleMovingAverage(chartConfig.dataSets[0], chartConfig.panels[0], 'close', selectedIndicators[index].period, chartData);
                    break;
                case "EMA":
                    addIndicators.ExponentialMovingAverage(chartConfig.dataSets[0], chartConfig.panels[0], 'close', selectedIndicators[index].period, chartData);
                    break;
                case "BB":
                    addIndicators.BollingerBands(chartConfig.dataSets[0], chartConfig.panels[0], 'close', selectedIndicators[index].period, chartData);
                    break;
            }
        }


        switch (currentBottomChart) {
            case "volumeto":
                chartUtil.bottomVolumeTo(chartConfig.dataSets[0], chartConfig.panels[1], "USD");
                break;
            case "volumefrom":
                chartUtil.bottomVolumeFrom(chartConfig.dataSets[0], chartConfig.panels[1], "BTC");
                break;
            case "RSI":
                addIndicators.RSI(chartConfig.dataSets[0], chartConfig.panels[1], chartData, currentBottomChart);
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
                chartIndicators.bottomAroon($scope.chartConfig.dataSets[0], $scope.chartConfig.panels[1], $scope.dataSetForIndicators, $scope.currentBottomChart);
                break;
            case "OBV":
                console.log('ADL'); //chartIndicators.bottomOBV($scope.chartConfig.dataSets[0],$scope.chartConfig.panels[1],$scope.dataSetForIndicators,$scope.bottomChart[i]);
                break;
        }
        var chart = AmCharts.makeChart("chartdiv", chartConfig);
    };
    var getApiData = function(type, limit, aggr) {
        var data = [];
        var url = "https://min-api.cryptocompare.com/data/histo" + type + "?fsym=BTC&tsym=USD&limit=" + limit + "&aggregate=" + aggr;
        $.getJSON(url, function(response) {
            var data = response.Data;
            currentDataSet = data;
            for (var index in currentDataSet) {
                currentDataSet[index]['time'] = new Date(currentDataSet[index]['time'] * 1000);
            }
            generateNewChart();
        });
    };
    var currentSocialData = [];
    var currentSocialIndicator = [];
    var getSocialData = function(type, limit, position) {
        var url = "https://www.cryptocompare.com/api/data/socialstatshisto" + type + "/?id=1182&limit=" + limit;
        $.getJSON(url, function(response) {
            var data = response.Data;
            for (var index in data) {
                data[index]['time'] = new Date(data[index]['time'] * 1000);
            }
            currentSocialData = data;
            decorateWithSocialData();
            generateNewChart();
        });
    };
    var decorateWithSocialData = function() {
        var totalDataPoints = currentDataSet.length;
        var totalSocialDataPoints = currentSocialData.length;
        if (totalDataPoints == 0 || totalSocialDataPoints == 0) {
            return;
        }

        if (totalSocialDataPoints == totalDataPoints) {
            for (var i = 0; i < totalDataPoints; i++) {
                for (var attr in currentSocialData[i]) {
                    currentDataSet[i][attr] = currentSocialData[i][attr];
                }
            }
        }
        else if (totalSocialDataPoints < totalDataPoints) {
            var firstSocialPointTs = currentSocialData[0].time;
            var currentDataTs = currentDataSet[0].time;
            var currentDataIndex = 0;
            while (firstSocialPointTs > currentDataTs && currentDataIndex < totalDataPoints) {
                currentDataIndex = currentDataIndex + 1;
                currentDataTs = currentDataSet[currentDataIndex].time;
            }
            for (var i = currentDataIndex; i < totalDataPoints; i++) {
                var socialIndex = i - currentDataIndex;
                if (currentSocialData[socialIndex].points > 0) {
                    for (var attrname in currentSocialData[socialIndex]) {
                        currentDataSet[i][attrname] = currentSocialData[socialIndex][attrname];
                    }
                }
            }
        } else {
            var firstDataPointTs = currentDataSet[0].time;
            var currentSocialTs = currentSocialData[0].time;
            var indexToStart = 0;
            while (firstDataPointTs>currentSocialTs) {
                indexToStart++;
                currentSocialTs=currentSocialData[indexToStart].time;
            }
            for (var i = 0; i < totalDataPoints; i++) {
                if (currentSocialData[indexToStart].points > 0) {
                    for (var attrname in currentSocialData[indexToStart]) {
                        currentDataSet[i][attrname] = currentSocialData[indexToStart][attrname];
                    }
                    indexToStart++;
                }
            }
        }
    };
    $('.chartIndicator').click(function() {
        var col = $(this).attr('data-col');
        var key = this.id;
        selectedIndicators[col] = chartIndicators[key];
        generateNewChart();
    });
    $('.bottomChart').click(function() {
        if (currentBottomChart == this.id) {
            return;
        }
        currentBottomChart = this.id;
        generateNewChart();
    });
    $('.time-button').click(function() {
        var id = $(this).attr('data-id');
        if (id == 0 || id == 1) {
            $('#socialDropdown').hide();
        }
        else {
            $('#socialDropdown').show();
        }
        var id = $(this).attr('data-id');
        if (currentPeriod == chartPeriod[id]) {
            return;
        }
        else {
            currentPeriod = chartPeriod[id];
            getApiData(currentPeriod.type, currentPeriod.maxPoints, currentPeriod.aggregation);
        }
    });
    $('.socialIndicator').click(function() {
        var socialId = $(this).attr('data-id');
        currentSocialIndicator = socialIndicator[socialId];
        getSocialData(currentPeriod.type, currentDataSet.length);
    });
});