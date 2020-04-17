const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('Access Token');
const fs  =  require('fs');


async function example(url) {
    const response = await bitly.shorten(url);
    writeCsv("Url.csv",url,response.link);
}

function writeCsv(filepath,... vars){
    var i;
    for(i=0;i<vars.length-1;i++){
        fs.appendFileSync(filepath, vars[i]+",", 'utf8', function (err) {
            if (err) throw err;
        })
    }
    fs.appendFileSync(filepath, vars[i] + "\n", 'utf8', function (err) {
        if (err) throw err;
    })
}
urlArray = [    
    "http://sousmonarbre.com/qphj/bd963843d2239ed78aa6f7b0a36b537d/qdp/shapely-table-mat-design-office-bay-decoration-mes-at-work-decorating-ideas-office-decoration-mes-design-ideas-cream-wall-paint-decoration-messroom-wooden-laminate-ing-tosca-color__office-decorating-ideas.jpg",
    "https://doodleart.redbull.com/assets/managed/entries/processed/sm/367010617181759_36211000.jpg",
    "https://www.justcolor.net/wp-content/uploads/sites/1/nggallery/doodle-art-doodling/coloring-page-adults-doodle-art-rachel.jpg",
    "http://canhotopazelite.info/wp-content/uploads/2018/08/office-bay-decoration-themes-with-office-bay-decoration-themes-elegant-yet-fun-office-bay-decoration-14.jpg",
    "https://i.pinimg.com/originals/e5/55/a3/e555a39ca5457a079a9bcce59f61f8d5.jpg",
    "https://static.vecteezy.com/system/resources/previews/000/107/464/non_2x/huge-doodle-vector-pack.jpg",
    "https://media.glassdoor.com/l/e9/c1/7a/84/independence-day-celebration.jpg",
    "https://i.ytimg.com/vi/O5u1apUkYV0/maxresdefault.jpg"
]

for(var i in urlArray){
    example(urlArray[i]);
}