FilePond.registerPlugin(FilepondPluginFileEncode);
const inputElemant = document.querySelctor('input[type="file"]');

const filepond = FilePond.create(
          inputElemant,
          {


          }
);

FilePond.setOptions({
          server: localhost:3000
})


const http = require('http');
const fs = require('fs');

const file = fs.createWriteStream("file.jpg");
const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
  response.pipe(file);
});
