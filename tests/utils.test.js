QUnit.test('Set up tests "utils"', function(t) {
  t.equal(1,1,'it works');
});

QUnit.test('utils:waterfall -> ', function(t) {

  var done = t.async();
  var initalInput = '5';

  function multiply_two (n,cb) {
    t.equal(typeof n, 'number', 'got number input');
    t.equal(n, 5, 'got right number');
    setTimeout(function(){cb(null,n * 2)},200);
  }
  function start (n,cb) {
    t.equal(n, initalInput, 'got right initalInput');
    setTimeout(function(){cb(null,parseInt(n))},200);
  }

  utils.waterfall(initalInput, [start,multiply_two], function(err,res) {
    t.equal(res,10,'got right result')
    done();
  });
});

QUnit.test('utils:request -> should return right data', function(t) {

  var done = t.async();

  var configReq = {
    method: 'GET',
    url: 'https://newsapi.org/v1/sources?country=it&apikey=' + config.NEWS_KEY
  };

  utils.request(configReq, function(err,res){
    t.equal(res.status,'ok','got ok response');
    done();
  });
});

QUnit.test('utils:template -> should return right data', function(t) {

  var tmpl = '<h1>{{name}}</h1>';
  var data = {name:'Bes'};
  var res = utils.template(tmpl,data);

  t.equal(res,'<h1>Bes</h1>','given {name:"Bes"} returned "<h1>Bes</h1>"');
});