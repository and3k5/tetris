import Jasmine from 'jasmine'

var jasmine = new Jasmine({
    verbose: true,
});
jasmine.loadConfigFile('spec/support/jasmine.json')

jasmine.execute()