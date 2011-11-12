(function() {
  var stdin;
  stdin = process.openStdin();
  stdin.setEncoding('utf8');
  stdin.on('data', function(input) {
    var name;
    name = input.trim();
    if (name === 'exit') {
      process.exit();
    }
    console.log("Hello " + name);
    return console.log("Enter another name or 'exit' to exit");
  });
  console.log('Enter your name');
}).call(this);
