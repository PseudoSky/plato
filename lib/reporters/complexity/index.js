'use strict';

var escomplex = require('escomplex-js'),
    _         = require('lodash');

exports.process = function(source, options, reportInfo) {
  var report={};

  try{
    report = escomplex.analyse(source, options);
  }catch(e){
    console.log("COMPLEXITY ERROR: ",e.description," FILE: ",reportInfo.file+":"+e.lineNumber);
  }
  // Make the short filename easily accessible
  report.module = reportInfo.fileShort;

  // Munge the new `escomplex-js` format to match the older format of
  // `complexity-report`
  if(report.aggregate){

    report.aggregate.complexity = {
      density    : report.aggregate.cyclomaticDensity,
      params     : report.aggregate.params,
      cyclomatic : report.aggregate.cyclomatic,
      sloc       : report.aggregate.sloc,
      halstead   : report.aggregate.halstead
    };

    if (_.isArray(report.functions)) {
      _.each(report.functions, function (func) {
          func.complexity = {
              density    : func.cyclomaticDensity,
              params     : func.params,
              cyclomatic : func.cyclomatic,
              sloc       : func.sloc,
              halstead   : func.halstead
          };
      });
    }

  }else{
    report.aggregate={complexity: {
      maintainability: -1,
      cyclomatic : -1,
      sloc       : -1,
      halstead   : -1
    }}
  }

  return report;
};
