// FRAGMENTTEXT.JS
// from http://codereview.stackexchange.com/questions/16081/splitting-text-into-lines-from-a-max-width-value-for-canvas 
function fragmentText(text, maxWidth,font) { 
	ctx.font=font;
	var spacemeasure = ctx.measureText(" ").width;
    if (maxWidth < ctx.measureText("M").width) // To prevent weird looping anamolies farther on.
        throw "Can't fragment less than one character.";

    if (ctx.measureText(text).width < maxWidth) { 
        return [text]; 
    } 

    var words = text.split(' '), 
        metawords = [],
        lines = [];

    // measure first.
    for (var w in words) {
        var word = words[w];
        var measure = ctx.measureText(word).width;

        // Edge case - If the current word is too long for one line, break it into maximized pieces.
        if (measure > maxWidth) {
            // TODO - a divide and conquer method might be nicer.
            var edgewords = (function(word, maxWidth) {
                var wlen = word.length;
                if (wlen == 0) return [];
                if (wlen == 1) return [word];

                var awords = [], cword = "", cmeasure = 0, letters = [];

                // Measure each letter.
                for (var l = 0; l < wlen; l++)
                    letters.push({"letter":word[l], "measure":ctx.measureText(word[l]).width});

                // Assemble the letters into words of maximized length.
                for (var ml in letters) {
                    var metaletter = letters[ml];

                    if (cmeasure + metaletter.measure > maxWidth) {
                        awords.push({ "word":cword, "len":cword.length, "measure":cmeasure });
                        cword = "";
                        cmeasure = 0;
                    }

                    cword += metaletter.letter;
                    cmeasure += metaletter.measure;
                }
                // there will always be one more word to push.
                awords.push({ "word":cword, "len":cword.length, "measure":cmeasure });
                return awords;
            })(word, maxWidth);

            // could use metawords = metawords.concat(edgwords)
            for (var ew in edgewords)
                metawords.push(edgewords[ew]);
        }
        else {
            metawords.push({ "word":word, "len":word.length, "measure":measure });
        }
    }

    // build array of lines second.
    var cline = "";
    var cmeasure = 0;
    for (var mw in metawords) {
        var metaword = metawords[mw];

        // If current word doesn't fit on current line, push the current line and start a new one.
        // Unless (edge-case): this is a new line and the current word is one character.
        if ((cmeasure + metaword.measure > maxWidth) && cmeasure > 0 && metaword.len > 1) {
            lines.push(cline)
            cline = "";
            cmeasure = 0;
        }

        cline += metaword.word;
        cmeasure += metaword.measure;

        // If there's room, append a space, else push the current line and start a new one.
        if (cmeasure + spacemeasure < maxWidth) {
            cline += " ";
            cmeasure += spacemeasure;
        } else {
            lines.push(cline)
            cline = "";
            cmeasure = 0;
        }
    }
    if (cmeasure > 0) {
        lines.push(cline);
	}
    return lines;
} 