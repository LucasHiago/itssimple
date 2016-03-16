# It's Simple

O It's Simple é a ferramenta mais simples de consulta de preços da internet, a proposta é mostrar o produtos que o usuário deseja comprar de forma mais rápida e simple possível, sem a necessidade de filtros complexos, ou poluição visual como é o caso das lojas e comparadores de preço, a idéia é ser um 'Google' das buscas de preço

## Instalando MongoDB

```bash
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
$ echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```

## Instalando Elastic Search

```bash
$ sudo apt-get install openjdk-7-jre
$ wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.7.2.deb
$ sudo dpkg -i elasticsearch-1.7.2.deb
$ sudo update-rc.d elasticsearch defaults
$ sudo service elasticsearch start
$ cd /usr/share/elasticsearch
$ sudo bin/plugin --install com.github.richardwilly98.elasticsearch/elasticsearch-river-mongodb/1.6.0
$ sudo bin/plugin --install elasticsearch/elasticsearch-mapper-attachments/1.6.0
$ sudo bin/plugin --install mobz/elasticsearch-head
$ sudo bin/plugin --install lukas-vlcek/bigdesk
$ sudo service elasticsearch restart
```

## Criando Indíce no Elastic Search

```bash
curl -XPUT http://itssimple.com.br:9200/searchproduct -d '{
    "mongodb": {
      "servers": [
        { "host": "127.0.0.1", "port": 27017 }
      ],
      "db": "itssimple",
      "collection": "groups",
      "options": { "secondary_read_preference": true },
      "gridfs": false
    },
    "settings":{
        "index":{
            "number_of_shards" : 5,
            "number_of_replicas" : 1,
            "analysis":{
                "analyzer":{
                    "analyzer_startswith":{
                        "tokenizer":"keyword",
                        "filter":"lowercase"
                    }
                }
            }
        }
    },
    "mappings":{
        "groups":{
            "properties":{
                "title":{
                    "search_analyzer":"analyzer_startswith",
                    "index_analyzer":"analyzer_startswith",
                    "type":"string"
                }
            }
        }
    } 
}'
```

## Instalações diversas

```bash
$ sudo apt-get install cpulimit
$ sudo npm install -g pm2
```

## Baixando base de testes

```bash
$ mkdir migrate
$ cd migrate
$ git clone https://github.com/andrehrf/itssimple-migration.git migrate
$ node createdatabase.js
$ cd ../
$ wget http://itssimple.com.br/itssimple16-02-2016.zip
$ mkdir dump
$ unzip itssimple16-02-2016.zip ./dump
$ mongorestore  --db itssimple --dir ./dump/itssimple
```

## Criando índices do Elastic Search

```bash
$ cd migrate
$ node --max-old-space-size=1024 --expose-gc elasticsearch.js --index=searchproduct/groups
```

## Iniciando o servidor It's Simple

```bash
$ npm install
$ pm2 start app.js
```


### License

  MIT
  
  Copyright (C) 2016 André Ferreira

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.