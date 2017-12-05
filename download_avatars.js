var request = require('request');
var getSecrets = require('./secrets');
var http = require("https");

var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + getSecrets.GITHUB_TOKEN


    }
  };
  request(options, function(err, res, body) {
    var ar = JSON.parse(body);
    // console.log(JSON.parse(body);
    ar.forEach((item) => {
      var url = item.avatar_url
      var filePath = './avatars/' + item.login + ".jpg";
      downloadImageByURL(url, filePath);

      // console.log(item.avatar_url);
    });
  });

}

function downloadImageByURL(url, filePath) {
  request.get(url)               // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       .on('response', function (response) {                           // Note 3
         console.log('Response Status Code: ', response.statusCode);
       })
       .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(process.argv[2], process.argv[3], function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

// getRepoContributors('jquery','jquery', console.log);

