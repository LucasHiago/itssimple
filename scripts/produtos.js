/**
 * Rotas básicas do Its Simples
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 */

var _ = require("lodash"),
    auto = require('google-autocomplete'),
    ElasticSearch = require("elasticsearch"),
    crc32 = require("crc-32");
    
module.exports = function(dirname, settings, app, io, mongodb, debug){  
    var elasticsearch = new ElasticSearch.Client(settings.elasticsearch);
        
    app.get("/produtos", function(req, res){ res.redirect("/#/produtos") });
    app.get("/get-produtos", function(req, res){ getProdutos(req, res, {}); });
    app.get("/get-produtos/:filter", function(req, res){ getProdutos(req, res, {s: req.params.filter}); });
    app.get("/get-produtos/:filter/:page", function(req, res){ getProdutos(req, res, {s: req.params.filter, p: parseInt(req.params.page)}); });
    app.get("/get-produtos/:filter/:page/:min/:max", function(req, res){ getProdutos(req, res, {s: req.params.filter, p: parseInt(req.params.page), min: parseFloat(req.params.min), max: parseFloat(req.params.max)}); });
    
    app.get("/get-produtos-auto-complete/:filter", function(req, res){ 
        auto.getQuerySuggestions(req.params.filter, function(err, suggestions) {
            var r = [];
            
            for(var i in suggestions)
                if(i < 6)
                    r.push(suggestions[i]["suggestion"]);
            
            res.send(r);
        });
    });
    
    app.get("/stores", function(req, res){ 
        mongodb.collection("stores").find({}, {name: 1, domain: 1, _id: 1}).toArray(function(error, docs){
            if(docs.length <= 0){
                res.send("");
            }
            else{
                var r = {};
                
                for(var key in docs)
                    r[docs[key]["_id"]] = {name: docs[key].name, domain: docs[key].domain} 
                
                res.send(r); 
            }
        });
    });
    
    app.get("/json/group/:id", function(req, res){ 
        mongodb.collection("groups").find({"_id": parseInt(req.params.id)}).limit(1).toArray(function(error, docs){
            if(docs.length <= 0){
                res.send("");
            }
            else{
                mongodb.collection("products").find({"_id": {$in: docs[0]["products"]}}).sort({price: 1}).toArray(function(error, docs2){
                    if(docs.length <= 0){
                        res.send("");
                    }
                    else{                        
                                                
                        res.send({products: docs2, store: docs}); 
                    }
                });
            }
        });
    });
    
    app.get("/group/:id", function(req, res){ 
        mongodb.collection("groups").find({"_id": parseInt(req.params.id)}).limit(1).toArray(function(error, docs){
            if(docs.length <= 0){
                res.send("");
            }
            else{
                mongodb.collection("products").find({"_id": {$in: docs[0]["products"]}}).sort({price: 1}).toArray(function(error, docs2){
                    if(docs.length <= 0){
                        res.send("");
                    }
                    else{
                        var div = "<div class=\"triangle\"></div>\
                                    <div class=\"ns-popover-tooltip\" style=\"width: 450px; min-height: 50px;\" ng-init='produtcs="+JSON.stringify(docs2)+"'>\n\
                                        <ul>\
                                          <li ng-repeat=\"product in produtcs\" style='border-button: 1px solid #CCC; font-size: 15px; padding: 5px;'><div><img src=\"http://www.google.com/s2/favicons?domain={{stores[product.store].domain}}\" style='width: 16px; height: 16px' /> {{stores[product.store]['name']}}<br/> <span style=\"font-size: 20px\">R${{product.price | number}}</span></div> <a class='btn btn-danger' href='{{product | returnlink}}' target='_blank'>Comprar</a></li>\
                                        </ul>\
                                    </div>";                        
                                                
                        res.send(div); 
                    }
                });
            }
        });
    });
    
    function getProdutos(req, res, filters){
        var filtersText = (filters.s) ? filters.s : null;
        var pg = (filters.p > 0) ? filters.p : 1;
        var offset = (pg*8)-8;
        
        if(offset < 0)
            offset = 0;
        
        filter =  {
            $and: [
                {"title": {$exists: true}},
                {"minmax.min": {$gt: 0}}
            ]
        };
        
        auto.getQuerySuggestions(filtersText, function(err, suggestions) {
            var firstSuggestion = "";
                        
            //Fazendo pesquisa por termo
            elasticsearch.ping({requestTimeout: 1000, hello: "elasticsearch!"}, function (error) {
                if(error){
                    console.trace('Elasticsearch Cluster is down!');
                } 
                else{                                        
                    elasticsearch.search({
                        index: 'searchproduct',
                        type: 'groups',
                        body: {
                            "fields" : ["_id"],
                            "size" : 1000,
                            "query": {
                                "match_phrase_prefix": {
                                    "title": {
                                        "query": filtersText,
                                        "max_expansions": 5
                                    }
                                }
                            }
                        }
                    }).then(function(resp){
                        var ids = [];
                        
                        for(var key in resp.hits.hits)
                            ids.push(parseInt(resp.hits.hits[key]._id));
                        
                        elasticsearch.search({
                            index: 'searchproduct',
                            type: 'groups',
                            body: {
                                "fields" : ["_id"],
                                "size" : 1000,
                                "query": {
                                    "match": {
                                        "_all": filtersText
                                    }
                                }
                            }
                        }).then(function(resp2){
                            if(offset+8 > resp.hits.total)
                                for(var key in resp2.hits.hits)
                                    ids.push(parseInt(resp2.hits.hits[key]._id));
                            
                            console.log(ids);

                            mongodb.collection("groups").find({"_id": {$in: ids}, "minmax.min": {$gt: 0}}).sort({"minmax.min": 1}).skip(offset).limit(8).toArray(function(error, docs){ 
                                console.log(docs);
                                                     
                                if(docs.length <= 0){
                                    //searchByProducts(req, res, filter, offset);     
                                    res.send({docs: null, total: 0});
                                }
                                else{
                                    for(var i in docs)
                                        docs[i].type = "group";                                    

                                    res.send({docs: docs, total: (resp.hits.total+ resp2.hits.total)});
                                }
                            });
                        });                        
                    }, function (err) {
                        console.trace(err.message);
                    });
                }
            });                 
        });
    }
    
    /*function searchByProducts(req, res, filter, offset){                
        mongodb.collection("products").count(filter, function(error, numOfDocs){
            if(error){
                res.send({error: error});
            }
            else{                
                mongodb.collection("products").find(filter, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).skip(offset).limit(16).toArray(function(error, docs){
                    for(var i in docs){
                        docs[i]["image"] = docs[i]["images"][0];
                        docs[i].type = "product";
                    }                              

                    if(error)
                        res.send({error: error});
                    else
                        res.send({docs: docs, total: numOfDocs});
                });
            }
        });
    }*/
}; 