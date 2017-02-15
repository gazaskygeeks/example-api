QUnit.test('Set up tests "main"', function(t) {
  t.equal(1,1,'it works');
});

QUnit.test('main:getSources -> should save in the database all the news', function(t) {

  var done = t.async();
  var dataStore = {};
  
  t.equal(Object.keys(dataStore).length, 0, 'dataStore starts empty');

  getSources(dataStore,function(err,modifiedDataStore) {
    t.ok(Object.keys(dataStore).length > 0, 'dataStore is updated with sources');
    done();
  });
});
