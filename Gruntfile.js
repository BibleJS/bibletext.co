
var util = require('util');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-semver');
  grunt.loadNpmTasks('grunt-exec');

  grunt.initConfig({
    'semver' : {
       'options' : {
         space: '  ',
       },
       'main' : {
        // Target-specific file lists and/or options go here.
        files: [{
            src: "package.json",
            dest: "package.json"
        }]
      },
    },
    'exec' : {
      'commit' : {
        cmd : function() {
          return util.format("git add package.json && git diff --staged && git commit --verbose -m \"bump version\"");
        }
      },
      'tag' : {
        cmd : function() {
          var pkg = require('./package.json');
          var version = util.format("v%s", pkg.version)
          return util.format("git tag %s && git push --tags", version);
          // return 'echo ' + pkg.version;
        }
      }
    }
  });

  grunt.registerTask('default', ['semver']);

  grunt.registerTask('bump', [
    'semver:main:bump:patch',
    'exec:commit',
    // 'exec:tag'
  ]);

};
