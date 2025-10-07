import Jasmine from 'jasmine'

const jasmine = new Jasmine({
    verbose: true,
});
jasmine.loadConfigFile('spec/support/jasmine.json')

jasmine.execute()