
window.addEventListener('load', function() {
  utils.waterfall(database, [
    getSources,
    renderOptions, // <-- DOM manipulation
    renderLogo, // <-- DOM manipulation
    getHeadlines,
    renderArticles // <-- DOM manipulation
  ], function(err, res){
    console.log('err',err);
    console.log('res',res);
  });
});

function changeDropDown () {
  utils.waterfall(option_list.value, [
    renderLogo,
    getHeadlines,
    renderArticles
  ], function(err, res) {
    console.log('err',err);
    console.log('res',res);
  });
}

/**
 * In memory database
 * @type {Object}
 *
 * Example:
 * {
 *  'The New York Times': {
 *    id: 'the-new-york-times',
 *    logo: 'http://i.newsapi.org/the-new-york-times-s.png',
 *    name: 'The New York Times',
 *    headlines: [
 *      {
 *        description: '"They said technical difficulties!" Trump tweeted Sunday.',
 *        publishedAt: '2017-02-12T15:18:11Z',
 *        title: 'Trump spreads debunked story about CNN cutting off Sanders for calling the network "fake news"',
 *        url: 'http://www.businessinsider.com/trump-spreads-debunked-story-about-cnn-fake-news-2017-2',
 *        urlToImage: '...'
 *      }
 *    ]
 *  }
 * }
 */
var database = {};

/**
 * Sources are newspapers and journals like CNN or NYT
 * @param  {Object}    database
 * @param  {Function}  cb
 * @return {Undefined}
 */
function getSources (database, cb) {

  var newsUrl = [
    'https://newsapi.org',
    '/v1/sources',
    '?language=en',
    '&country=us',
    '&apikey=' + config.NEWS_KEY
  ].join('');

  utils.request({
    method: 'GET',
    url: newsUrl
  }, function(err, data) {

    if(err) {
      utils.handleError('Error with the sources');
      cb(err, undefined);
      return;
    }

    // save in the db
    data.sources.forEach(utils.buildDb(database));

    cb(undefined, database);
  });
}

/**
 * Creates options HTML and appends it to the `options_container`
 * @param  {Object}    database
 * @param  {Function}  cb
 * @return {Undefined}
 */
function renderOptions (database, cb) {

  var opt = '<option value="{{option}}">{{option}}</option>';
  var select = '<select id="option_list">{{options}}</select>';

  var optionList = Object.keys(database).map(function(elm) {
    return utils.template(opt,{option:elm});
  }).join('');

  // append to DOM
  options_container.innerHTML = utils.template(select,{options:optionList});
  option_list.addEventListener('change', changeDropDown);

  cb(undefined, option_list.value);
}

/**
 * Creates logo HTML and appends it to the `logo_container`
 * @param  {String}    sourceKey key of the database source
 * @param  {Function}  cb
 * @return {Undefined}
 */
function renderLogo (sourceKey, cb) {
  var logoUrl = database[sourceKey]['logo'];
  var imgTmpl = '<img src="{{url}}"/>';

  // append to DOM
  img_container.innerHTML = utils.template(imgTmpl,{url:logoUrl});

  cb(undefined, sourceKey);
}

/**
 * Given a specific sourceKey (newspaper or journal)
 * fetches all the top line articles
 * @param  {String}    sourceKey key of the database source used the get the id
 * @param  {Function}  cb
 * @return {Undefined}
 */
function getHeadlines (sourceKey, cb) {

  var source = database[sourceKey];

  var articleUrl = [
    'https://newsapi.org',
    '/v1/articles',
    '?source=' + source.id,
    '&apikey=' + config.NEWS_KEY
  ].join('');

  utils.request({
    method: 'GET',
    url: articleUrl
  }, function (err, data) {

    if(err) {
      utils.handleError('Error with the articles');
      return;
    }

    utils.addHeadlines(database, source, data.articles);

    cb(undefined, data.articles);
  });
}

/**
 * Constracts the HTML for all the articles and appends it to `articles_container`
 * @param  {Array}     articles array of articles objects
 * @param  {Function}  cb
 * @return {Undefined}
 */
function renderArticles (articles, cb) {

  var articleTmpl = [
    '<article>',
      '<h1>{{title}}</h1>',
      '<img style="width:128px;height:128px;" src="{{urlToImage}}"/>',
      '<a href="{{url}}">Read more...</a>',
    '</article>',
  ].join('');

  articles_container.innerHTML = articles.map(function(elm) {
    return utils.template(articleTmpl,elm);
  });
}
