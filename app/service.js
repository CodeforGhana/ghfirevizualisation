/**
 * Created by kwabenaboadu on 8/7/15.
 */
(function () {
    'use strict';

    angular.module('fireApp.services', [])
        .factory('fireDataService', [
            '$q', '$http',
            function ($q, $http) {
                var totals, rawData, yearlyOutbreakTotals, firstRegion, regions;

                function getOutbreakTotals() {
                    var deferred;
                    deferred = $q.defer();

                    if (angular.isDefined(yearlyOutbreakTotals)) {
                        deferred.resolve(yearlyOutbreakTotals);
                    } else {
                        $http.get('dataset/outbreaktotals.json')
                            .success(function (dataset) {
                                yearlyOutbreakTotals = dataset.yearlyTotals;
                                calculateOverallTotal();
                                deferred.resolve(yearlyOutbreakTotals);
                            })
                            .error(function (resp) {
                                deferred.reject(resp);
                            });
                    }

                    return deferred.promise;
                }

                function calculateOverallTotal() {
                    var regTotal;
                    if (!angular.isDefined(totals))
                        totals = {};
                    totals.overallTotal = 0;
                    angular.forEach(yearlyOutbreakTotals, function (obj) {
                        regTotal = parseInt(obj.totalOutbreak);
                        if (!isNaN(regTotal))
                            totals.overallTotal += regTotal;
                    });
                }

                function getFirstRegion() {
                    if (angular.isDefined(firstRegion)) {
                        return firstRegion;
                    }

                    angular.forEach(yearlyOutbreakTotals, function (obj, key) {
                        if (!angular.isDefined(firstRegion))
                        firstRegion = key;
                    });
                    return firstRegion;
                }

                function isEmptyString(val) {
                    return angular.isString(val) && val == '';
                }

                return {
                    getYearlyRegionalTotals: function () {
                        var deferred, regTotal;
                        deferred = $q.defer();

                        if (angular.isDefined(totals) && angular.isDefined(totals.yearlyRegTotals)) {
                            deferred.resolve(totals.yearlyRegTotals);
                        } else {
                            getOutbreakTotals().then(function () {
                                if (!angular.isDefined(totals))
                                    totals = {};
                                totals.yearlyRegTotals = {};
                                /* Set the overall year total for each region */
                                angular.forEach(yearlyOutbreakTotals, function (obj, regName) {
                                    regTotal = parseInt(obj.totalOutbreak);
                                    if (!isNaN(regTotal))
                                        totals.yearlyRegTotals[regName] = regTotal;
                                });
                                //console.log('regional totals: ');
                                //console.log(totals.yearlyRegTotals);
                                deferred.resolve(totals.yearlyRegTotals);
                            });
                        }
                        return deferred.promise;
                    },
                    /* Returns category totals */
                    getYearlyCategoryTotals: function () {
                        var deferred, intCatVal;
                        deferred = $q.defer();

                        if (angular.isDefined(totals) && angular.isDefined(totals.yearlyCatTotals)) {
                            deferred.resolve(totals.yearlyCatTotals);
                        } else {
                            getOutbreakTotals().then(function () {
                                if (!angular.isDefined(totals))
                                    totals = {};
                                totals.yearlyCatTotals = {};

                                angular.forEach(yearlyOutbreakTotals, function (obj, regName) {
                                    if (!angular.isDefined(totals.reg))
                                        angular.forEach(obj.categories, function (catVal, catName) {
                                            if (!angular.isDefined(totals.yearlyCatTotals[catName]))
                                                totals.yearlyCatTotals[catName] = 0;
                                            intCatVal = parseInt(catVal);

                                            if (!isNaN(intCatVal)) {
                                                totals.yearlyCatTotals[catName] += intCatVal;
                                            }
                                        });
                                });
                                //console.log('yearly category totals: ');
                                //console.log(totals.yearlyCatTotals);
                                deferred.resolve(totals.yearlyCatTotals);
                            });
                        }

                        return deferred.promise;
                    },
                    /* Returns the category totals by region */
                    getRegionalCategoryTotals: function (region) {
                        var deferred;
                        deferred = $q.defer();

                        if (angular.isDefined(totals) && angular.isDefined(totals.regionalCatTotals)) {
                            if (isEmptyString(region) || !totals.monthlyRegTotals.hasOwnProperty(region)) {
                                region = getFirstRegion();
                            }
                            deferred.resolve(totals.regionalCatTotals[region]);
                        } else {
                            if (!angular.isDefined(totals))
                                totals = {};
                            totals.regionalCatTotals = {};

                            getOutbreakTotals().then(function () {
                                angular.forEach(yearlyOutbreakTotals, function (obj, regName) {
                                    totals.regionalCatTotals[regName] = obj.categories;
                                });
                                if (isEmptyString(region) || !totals.monthlyRegTotals.hasOwnProperty(region)) {
                                    region = getFirstRegion();
                                }
                                //console.log('regional cat totals: ');
                                //console.log(totals.regionalCatTotals[firstRegion]);
                                deferred.resolve(totals.regionalCatTotals[region]);
                            });
                        }

                        return deferred.promise;
                    },
                    getMonthlyRegionalTotals: function (region) {
                        var deferred;
                        deferred = $q.defer();

                        if (angular.isDefined(totals) && angular.isDefined(totals.monthlyRegTotals)) {
                            if (isEmptyString(region) || !totals.monthlyRegTotals.hasOwnProperty(region)) {
                                region = getFirstRegion();
                            }
                            deferred.resolve(totals.monthlyRegTotals[region]);
                        } else {
                            if (!angular.isDefined(totals))
                                totals = {};
                            totals.monthlyRegTotals = {};

                            getOutbreakTotals().then(function () {
                                angular.forEach(yearlyOutbreakTotals, function (obj, regName) {
                                    totals.monthlyRegTotals[regName] = obj.months;
                                });
                                if (isEmptyString(region) || !totals.monthlyRegTotals.hasOwnProperty(region)) {
                                    region = getFirstRegion();
                                }
                                deferred.resolve(totals.monthlyRegTotals[region]);
                            });
                        }
                        return deferred.promise;
                    },
                    getFirstRegion: function() {
                        return getFirstRegion();
                    },
                    getRegions: function() {
                        var deferred = $q.defer();

                        if (angular.isDefined(regions) && angular.isArray(regions)) {
                            deferred.resolve(regions);
                        } else {
                            regions = [];
                            getOutbreakTotals().then(function() {
                                angular.forEach(yearlyOutbreakTotals, function(obj, regName) {
                                   regions.push(regName);
                                });
                                deferred.resolve(regions);
                            })
                        }

                        return deferred.promise;
                    },
                    getTotalFireOutbreak: function() {
                        var deferred = $q.defer();

                        getOutbreakTotals().then(function() {
                            deferred.resolve(totals.overallTotal);
                        }, function(resp) {
                            deferred.reject(resp);
                        });

                        return deferred.promise;
                    }
                }
            }
        ])
        .factory('chartOptionsService', [
            function() {
                return {
                    getChartOptions: function() {
                        return {
                            pieChart: {
                                displayExactValues: true,
                                width: '100%',
                                height: 450,
                                is3D: true,
                                legend: {alignment: 'center', position: 'right'},
                                chartArea: {left: 30, top: 10, bottom: 0, height: "100%"}
                            },
                            columnChart: {
                                width: '100%',
                                height: 520
                            }
                        };
                    },
                    getFormatters: function() {
                        return {
                            number: [{
                                columnNum: 1,
                                pattern: "#,##0"
                            }],
                            currency: [{
                                columnNum: 1,
                                pattern: "GHS #,##0.00"
                            }]
                        };
                    }
                }
            }
        ]);
})();