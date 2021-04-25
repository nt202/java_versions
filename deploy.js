//cinnamon-session-quit

var fs = require('fs');

const scriptTemplate = `
export JAVA_HOME="$HOME/java_versions/jdk$N$/bin"
export PATH=$PATH:$JAVA_HOME

# uncomment whatever you need:
cinnamon-session-quit 
#gnome-session-quit
`;

const javaMin = 7;
const javaMax = 20;

var i;
for (i = javaMin; i <= javaMax; i++) {
    var dir = './jdk' + i;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        console.log('Directory ' + dir + ' created.');
    }
    var script = './j' + i + '.sh';
    if (!fs.existsSync(script)){
        fs.writeFile(script, scriptTemplate.replace('$N$', i), function (err) {
            if (err) return console.log(err);
            console.log('File ' + script + ' created.');
        });
    }
}


var aliases = '# Java switch aliases:\n';
var aliasTemplate = "alias j$N$='source ~/java_versions/j$N$.sh'\n";
for (i = javaMin; i <= javaMax; i++) {
    aliases += aliasTemplate.replace('$N$', i).replace('$N$', i);
}

var html = './index.html';
var htmlTemplate = `
<!DOCTYPE html>
<html>
<style>
.border {
 border-style:solid;
 border-color:#287EC7;
 padding: 20px
}
</style>
<body>
<h3>Put this into your ~/.profile file:</h3>
</br>
<p class="border" style="white-space: pre-wrap">$ALIASES$</p>
</body>
</html>
`;
if (!fs.existsSync(html)){
    fs.writeFile(html, htmlTemplate.replace('$ALIASES$', aliases), function (err) {
        if (err) return console.log(err);
        console.log(html + ' created.');
    });
}

var url = 'file://' + process.cwd() + '/index.html';
var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
require('child_process').exec(start + ' ' + url);
