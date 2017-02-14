var utils = {
  /**
   * [waterfall description]
   * @param  {[type]}   arg   [description]
   * @param  {[type]}   tasks [description]
   * @param  {Function} cb    [description]
   * @return {[type]}         [description]
   */
  waterfall: function(arg, tasks, cb) {
    var next = tasks[0];
    var tail = tasks.slice(1);
    if (typeof next !== 'undefined') {
      next(arg, function(error, result) {
        if (error) {
          cb(error);
          return;
        }
        utils.waterfall(result, tail, cb);
      })
      return;
    }
    cb(null, arg);
  },
  /**
   * Abstraction over XHR
   * @param  {Object}    configObj config object
   * @param  {Function}  cb  callback with `error` or `data`
   * @return {Undefined}
   *
   * Where configObj looks like:
   * {
   *  method: 'POST',
   *  url: 'https://api.textrazor.com/',
   *  params: 'text=foo&extractors=topics',
   *  headers: [
   *    'content-type:application/x-www-form-urlencoded',
   *    'X-TextRazor-Key:66a749422373f8fc2ca107aax9g5c38dff2014e05f4e49ba9c782d34'
   *  ]
   * }
   */
  request: function (configObj, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        cb(null, json);
      } else {
        // TODO: handle else branch
      }
    };
    xhr.open(configObj.method, configObj.url, true);

    if(configObj.headers !== undefined) {
      configObj.headers.forEach(function(elm) {
        var header = elm.split(':');
        xhr.setRequestHeader(header[0],header[1]);
      });
    }

    xhr.send(configObj.params);
  },
  /**
   * Small template engine
   * @param  {String} tpl  template e.g. "<h1>{{name}}</name>"
   * @param  {Object} data data to be injected e.g. {name:'Foo'}
   * @return {String}      new substituted template e.g. "<h1>Foo</h1>"
   */
  template: function(tpl, data) {
    Object.keys(data).forEach(function(key){
      tpl = tpl.replace(
        new RegExp('\\{\\{\\s*' + key + '\\s*\\}\\}', 'g'),
        data[key]
      );
    });
    return tpl;
  },
  /**
   * [buildDb description]
   * @param  {[type]} database [description]
   * @return {[type]}          [description]
   */
  buildDb: function (database) {
    return function (source) {
      database[source.name] = {
        name: source.name,
        id: source.id,
        logo: source.urlsToLogos.small
      };
    };
  },
  /**
   * [addHeadlines description]
   * @param {[type]} database [description]
   * @param {[type]} source   [description]
   */
  addHeadlines: function (database, source, articles) {
    database[source.name]['headlines'] = [];
    articles.forEach(function(article) {
      delete article['author'];
      database[source.name]['headlines'].push(article);
    });
  },
  handleError: function (mess) {
    alert(mess);
  }
};
