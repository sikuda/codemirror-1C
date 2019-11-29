// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
// adopted for 1C - Aleksandr Kolesnikov

(function (mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.registerHelper("fold", "1c", function (cm, start) {
    var line = start.line, lineText = cm.getLine(line);
    var tokenType;

    function findOpening(openCh) {
      for (var at = start.ch, pass = 0; ;) {
        var found = at <= 0 ? -1 : lineText.toLowerCase().lastIndexOf(openCh, at - 1);
        if (found == -1) {
          if (pass == 1) break;
          pass = 1;
          at = lineText.length;
          continue;
        }
        if (pass == 1 && found < start.ch) break;
        tokenType = cm.getTokenTypeAt(CodeMirror.Pos(line, found + 1));
        if (!/^(comment|string)/.test(tokenType)) return found + 1;
        at = found - 1;
      }
    }
    const startTokens = [
      'процедура', 'функция'
    ]
    const startTokensEn = [
      'procedure', 'function'
    ]
    const endTokens = [
      'конецпроцедуры', 'конецфункции'
    ]
    const endTokensEn = [
      'endprocedure', 'endfunction'
    ]
    var startCh = null
    for (let k = 0; k < startTokens.length; k++) {
      let startLenght = 0;
      startCh = findOpening(startTokens[k]);
      if (startCh != null) {
        startLenght = startTokens[k].length;
      } else {
        startCh = findOpening(startTokensEn[k]);
        startLenght = startTokensEn[k].length;
      }
      if (startCh != null) {
        startCh += startLenght;
        let lLine = cm.lastLine();
        let openbrackets =0;
        let closebrackets=0;
          for (let j = line; j <= lLine; j++) {
            let curText = cm.getLine(j), pos = j == line ? startCh : 0;
            for (let l = pos; l < curText.length; l++) {
              if (l < curText.length && curText[l+1] === '/' && curText[l] === '/') {
                break; // comment!
              }
              openbrackets += curText[l] == '(' ? 1 : 0;
              closebrackets += curText[l] == ')' ? 1 : 0;
              if (openbrackets == closebrackets && openbrackets > 0) {
                startCh = l+1;
                break;
              }
            }
            if (openbrackets == closebrackets  && openbrackets > 0) {
              line = j;
              break;
            }
          }
      }


     if (startCh != null) {
        var count = 1, lastLine = cm.lastLine(), end, endCh;
        outer: for (var i = line; i <= lastLine; ++i) {
          var text = cm.getLine(i), pos = i == line ? startCh : 0;
          for (; ;) {
            var nextOpen = text.toLowerCase().indexOf(startTokens[k], pos);
            if (nextOpen < 0) nextOpen = text.toLowerCase().indexOf(startTokensEn[k], pos)
            var nextClose = text.toLowerCase().indexOf(endTokens[k], pos);
            if (nextClose < 0) nextClose = text.toLowerCase().indexOf(endTokensEn[k], pos)
            if (nextOpen < 0) nextOpen = text.length;
            if (nextClose < 0) nextClose = text.length;
            pos = Math.min(nextOpen, nextClose);
            if (pos == text.length) break;
            if (cm.getTokenTypeAt(CodeMirror.Pos(i, pos + 1)) == tokenType) {
              if (pos == nextOpen)++count;
              else if (!--count) { end = i; endCh = pos; break outer; }
            }
            ++pos;
          }
      }
        if (end == null || line == end) return;
        return {
          from: CodeMirror.Pos(line, startCh),
          to: CodeMirror.Pos(end, endCh)
        };
      }
    }
    if (startCh == null) return;
  });

});
