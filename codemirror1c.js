//transfer textarea with class "codemirror1c" by CodeMirror
var arrayOfCode = document.getElementsByClassName("codemirror1c");
for (var i = 0; i < arrayOfCode.length; i++) {
	var elem = arrayOfCode[i];
	if( elem.tagName = 'textarea' ){
		var content = elem.innerHTML;
		content = content.replace(/&lt;br \/&gt;/gi, "").replace(/&lt;\/p&gt;/gi, "").replace(/&lt;p&gt;/gi, '\n');
		var editor = CodeMirror.fromTextArea(elem, {
		  viewportMargin: Infinity,
		  lineNumbers: true,
		  indentWithTabs: true,
		  styleActiveLine: false,
		  lineWrapping: true,
		  scrollbarStyle: null,
		  smartIndent: true,
		  electricChars: false,
		  autofocus: false,
		  indentUnit: 4,
		  readOnly: true,
		  highlightSelectionMatches: {showToken: /[0-9a-zA-Zа-яёА-ЯЁ&><]/, annotateScrollbar: false},
		  mode: "text/x-1c",
		  theme: '1c',
		  foldGutter: true,
		  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
		});
		editor.setValue(content);
		for (var j =0; j< editor.lineCount(); j++) { editor.indentLine(j); }
		editor.setSize('100%', '100%');
	    //var list = elem.parentElement.getElementsByClassName("CodeMirror-scroll")[0];
		//if(list){
		//  list.classList.remove("CodeMirror-scroll");
		//  list.classList.add("CodeMirror-scroll-1c");
		//}
		//editor.refresh();
	}
}
