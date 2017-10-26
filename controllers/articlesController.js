// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Comment and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");


module.exports = (app) => {
    var title;
    var link;

    app.get('/scrape', function (req, res) {
        // Make a request for the news section of ycombinator
        request("https://news.ycombinator.com/", function (error, response, html) {
            // Load the html body from request into cheerio
            var $ = cheerio.load(html);
            // For each element with a "title" class
            $(".title").each(function (i, element) {
                // Save the text and href of each link enclosed in the current element
                title = $(element).children("a").text();
                link = $(element).children("a").attr("href");

                if (title && link) {
                    updateNews();
                }

            });
            res.redirect('/articles')
        });

    });

    app.get('/articles', function (req, res) {

        Article
            .find({}, function (error, doc) {

                if (error) {
                    console.log(error)
                } else {


                    res.render('home', {
                        result: doc
                    })
                }
            })
            .sort({
                '_id': -1
            });
    })

    app.get('/articles/:id', function (req, res) {

        Article
            .findOne({
                _id: req.params.id
            })

            .populate('note')
            .then(function (dbArticle) {

                res.json(dbArticle)
            })
            .catch(function (err) {

                res.json(err);
            });

    });

    app.post('/articles/:id', function (req, res) {

        Note
            .create(req.body)
            .then(function (dbNote) {


                return Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id
                }, {
                    new: true
                });
            })
            .then(function (dbArticle) {

                res.json(dbArticle)
            })
            .catch(function (err) {

                res.json(err)
            });
    })
    // function used to grab scraped data and insert into database
    function updateNews() {


        var result = {};

        result.title = title;
        result.link = link;
        // Insert the data in the scrapedData db
        Article.update(result, result, {
                upsert: true
            })
            .then(function (doc) {
                console.log(`Inserted: ${doc}`)
            })
            .catch(function (err) {
                console.log(`Error: ${err}`)
            })

    }
    //===========================================================








}