/**
 * Created by kwabenaboadu on 8/7/15.
 */
(function () {
    'use strict';

    var appCtrls = angular.module('fireApp.controllers', []);
    appCtrls.controller('MainCtrl', ['$scope', 'fireDataService', 'chartOptionsService',
        function ($scope, fireDataService, chartOptionsService) {
            var chartOptions, chartFormatters;
            chartOptions = chartOptionsService.getChartOptions();
            chartFormatters = chartOptionsService.getFormatters();
            $scope.options = {
                chartType: "PieChart",
                region: "",
                regionNames: []
            };
            $scope.notes = {overallTotal: 0};
            $scope.charts = {
                yearlyRegTotals: {},
                yearlyCatTotals: {},
                regCatTotals: {},
                regMonthlyTotals: {}
            };

            /* Initialization block */
            (function () {
                fireDataService.getRegions().then(function (dataset) {
                    $scope.options.regionNames = dataset;
                    if ($scope.options.region == "")
                        $scope.options.region = dataset.length > 0 ? dataset[0] : "";
                });
                fireDataService.getTotalFireOutbreak().then(function(total) {
                    $scope.notes.overallTotal = total;
                });
                getYearlyRegionalTotals();
                getYearlyCategoryTotals();
                getRegionalCategoryTotals();
                getMonthlyCategoryTotals();
            })();

            function isPieChart() {
                return $scope.options.chartType == 'PieChart';
            }

            function getYearlyRegionalTotals() {
                fireDataService.getYearlyRegionalTotals().then(function (dataset) {
                    setYearlyRegionalTotals(dataset);
                });
            }

            function getYearlyCategoryTotals() {
                fireDataService.getYearlyCategoryTotals().then(function (dataset) {
                    setYearlyCategoryTotals(dataset);
                });
            }

            function getRegionalCategoryTotals() {
                fireDataService.getRegionalCategoryTotals().then(function (dataset) {
                    setRegionalCategoryTotals(dataset);
                });
            }

            function getMonthlyCategoryTotals() {
                fireDataService.getMonthlyRegionalTotals().then(function (dataset) {
                    setRegionalMonthlyTotals(dataset);
                });
            }

            function setYearlyRegionalTotals(dataset) {
                var chOptions = angular.copy(isPieChart() ? chartOptions.pieChart : chartOptions.columnChart);
                $scope.charts.yearlyRegTotals.type = $scope.options.chartType;

                if (isPieChart())
                    $scope.charts.yearlyRegTotals.data = [['Region', 'Total Fire Outbreak for 2011']];
                else {
                    $scope.charts.yearlyRegTotals.data = {
                        cols: [
                            {id: 'region', label: 'Region', type: 'string'},
                            {id: 'outbreak', label: 'Total Outbreak', type: 'number'}
                        ],
                        rows: []
                    };
                }

                angular.forEach(dataset, function (val, key) {
                    if (isPieChart())
                        $scope.charts.yearlyRegTotals.data.push([key.toUpperCase(), val]);
                    else {
                        $scope.charts.yearlyRegTotals.data.rows.push({
                            c: [
                                {v: key.toUpperCase()},
                                {v: val}
                            ]
                        });
                    }
                });

                chOptions.title = 'Total Fire Outbreak by Region (2011)';
                $scope.charts.yearlyRegTotals.options = chOptions;
                $scope.charts.yearlyRegTotals.options.chartArea = {left: isPieChart() ? 20 : 110};
                if (!isPieChart()) {
                    $scope.charts.yearlyRegTotals.options.vAxis = {title: 'Total Fire Outbreak'};
                    $scope.charts.yearlyRegTotals.options.hAxis = {title: 'Region'};
                    $scope.charts.yearlyRegTotals.options.colors = ["#dc3912"];
                    $scope.charts.yearlyRegTotals.options.height = 700;
                }
                $scope.charts.yearlyRegTotals.formatters = chartFormatters.number;
            }

            function setYearlyCategoryTotals(dataset) {
                var chOptions = angular.copy(isPieChart() ? chartOptions.pieChart : chartOptions.columnChart);
                $scope.charts.yearlyCatTotals.type = $scope.options.chartType;
                if (isPieChart())
                    $scope.charts.yearlyCatTotals.data = [['Category', 'Total Fire Outbreak for 2011']];
                else {
                    $scope.charts.yearlyCatTotals.data = {
                        cols: [
                            {id: 'category', label: 'Category', type: 'string'},
                            {id: 'outbreak', label: 'Total Outbreak', type: 'number'}
                        ],
                        rows: []
                    };
                }

                angular.forEach(dataset, function (val, key) {
                    if (isPieChart())
                        $scope.charts.yearlyCatTotals.data.push([key.toUpperCase(), val]);
                    else {
                        $scope.charts.yearlyCatTotals.data.rows.push({
                            c: [
                                {v: key.toUpperCase()},
                                {v: val}
                            ]
                        });
                    }
                });
                //$scope.charts.yearlyCatTotals.title = 'Total Fire Outbreak by Category (2011)';
                chOptions.title = 'Total Fire Outbreak by Category (2011)';
                $scope.charts.yearlyCatTotals.options = chOptions;
                $scope.charts.yearlyCatTotals.options.chartArea = {left: isPieChart() ? 20 : 110};
                if (!isPieChart()) {
                    $scope.charts.yearlyCatTotals.options.vAxis = {title: 'Total Fire Outbreak'};
                    $scope.charts.yearlyCatTotals.options.hAxis = {title: 'Category'};
                }
                $scope.charts.yearlyCatTotals.formatters = chartFormatters.number;
            }

            function setRegionalCategoryTotals(dataset) {
                var chOptions = angular.copy(isPieChart() ? chartOptions.pieChart : chartOptions.columnChart);
                $scope.charts.regCatTotals.type = $scope.options.chartType;
                if (isPieChart())
                    $scope.charts.regCatTotals.data = [['Category', 'Total Fire Outbreak for 2011']];
                else {
                    $scope.charts.regCatTotals.data = {
                        cols: [
                            {id: 'category', label: 'Category', type: 'string'},
                            {id: 'outbreak', label: 'Total Outbreak', type: 'number'}
                        ],
                        rows: []
                    };
                }

                angular.forEach(dataset, function (val, key) {
                    if (isPieChart())
                        $scope.charts.regCatTotals.data.push([key.toUpperCase(), val]);
                    else {
                        $scope.charts.regCatTotals.data.rows.push({
                            c: [
                                {v: key.toUpperCase()},
                                {v: val}
                            ]
                        });
                    }
                });
                if (!angular.isDefined($scope.options.region) || $scope.options.region == '') {
                    $scope.options.region = fireDataService.getFirstRegion();
                }
                chOptions.title = 'Total Fire Outbreak by Category for ' + $scope.options.region.toUpperCase() + ' (2011)';
                $scope.charts.regCatTotals.options = chOptions;
                $scope.charts.regCatTotals.options.chartArea = {left: 50};
                if (!isPieChart()) {
                    $scope.charts.regCatTotals.options.vAxis = {title: 'Total Fire Outbreak'};
                    $scope.charts.regCatTotals.options.hAxis = {title: 'Category'};
                    $scope.charts.regCatTotals.options.colors = ["#990099"];
                }
                $scope.charts.regCatTotals.formatters = chartFormatters.number;
            }

            function setRegionalMonthlyTotals(dataset) {
                var chOptions = angular.copy(isPieChart() ? chartOptions.pieChart : chartOptions.columnChart);
                $scope.charts.regMonthlyTotals.type = $scope.options.chartType;
                if (isPieChart())
                    $scope.charts.regMonthlyTotals.data = [['Month', 'Total Fire Outbreak for 2011']];
                else {
                    $scope.charts.regMonthlyTotals.data = {
                        cols: [
                            {id: 'month', label: 'Month', type: 'string'},
                            {id: 'outbreak', label: 'Total Outbreak', type: 'number'}
                        ],
                        rows: []
                    };
                }

                angular.forEach(dataset, function (val, key) {
                    if (isPieChart())
                        $scope.charts.regMonthlyTotals.data.push([key, val]);
                    else {
                        $scope.charts.regMonthlyTotals.data.rows.push({
                            c: [
                                {v: key},
                                {v: val}
                            ]
                        });
                    }
                });
                if (!angular.isDefined($scope.options.region) || $scope.options.region == '') {
                    $scope.options.region = fireDataService.getFirstRegion();
                }
                chOptions.title = 'Total Monthly Fire Outbreak for ' + $scope.options.region.toUpperCase() + ' (2011)';
                $scope.charts.regMonthlyTotals.options = chOptions;
                $scope.charts.regMonthlyTotals.options.chartArea = {left: 50};
                if (!isPieChart()) {
                    $scope.charts.regMonthlyTotals.options.vAxis = {title: 'Total Fire Outbreak'};
                    $scope.charts.regMonthlyTotals.options.hAxis = {title: 'Month of Year'};
                    $scope.charts.regMonthlyTotals.options.colors = ["#109618"];
                }
                $scope.charts.regMonthlyTotals.formatters = chartFormatters.number;
            }

            $scope.showRegionalCatAndMonthTotals = function () {
                $scope.options.regSelectorDisabled = true;
                fireDataService.getRegionalCategoryTotals($scope.options.region).then(function (dataset) {
                    setRegionalCategoryTotals(dataset);
                }).finally(function () {
                    $scope.options.regSelectorDisabled = false;
                });

                fireDataService.getMonthlyRegionalTotals($scope.options.region).then(function (dataset) {
                    setRegionalMonthlyTotals(dataset);
                });
            }

            $scope.changeChartType = function () {
                getYearlyRegionalTotals();
                getYearlyCategoryTotals();
                getRegionalCategoryTotals();
                getMonthlyCategoryTotals();
            };
        }
    ]);
})();