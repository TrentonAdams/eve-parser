// It's just a-spec.js so that it's loaded first, and changes the reporter
var JasmineConsoleReporter = require('jasmine-console-reporter');
var reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2 
    cleanStack: 1,       // (0|false)|(1|true)|2|3 
    verbosity: 4,        // (0|false)|1|2|(3|true)|4 
    listStyle: 'indent', // "flat"|"indent" 
    activity: false
});

jasmine.getEnv().addReporter(reporter);

