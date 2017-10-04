function Transfer1CJS(string, lang){
 
 	var openingKeywordsJS = ['if(',  'while(', 'for(', 'function', 'function', 'try{', ];
    var openingKeywords = new Object;
 	openingKeywords.en    = ['If',   'While', 'For', 'Procedure', 'Function', 'Try'];
	openingKeywords.ru    = ['Если', 'Пока',  'Для', 'Процедура', 'Функция',  'Попытка'];

	var middleKeywordsJS =  ['}else{', 'elseif(', 'except'];
	var middleKeywords = new Object;
	middleKeywords.en    = ['else',  'elsif',   'except'];
	middleKeywords.ru    = ['Иначе', 'ИначеЕсли', 'Исключение'];

	var doubleClosingJS  = ['}',         '}',          '}',             '}',           '}'];
    var doubleClosing = new Object; 
	doubleClosing.en     = ['EndIf;',    'EndDo;',     'EndProcedure',  'EndFunction', 'ЕndTry'];
	doubleClosing.ru     = ['КонецЕсли;','КонецЦикла;','КонецПроцедуры','КонецФункции','КонецПопытки'];

	var commonKeywordsJS =  ['new',  'each',   'from','do',  'false','true',  'return', '){',    'export', 'undefined',  'continue',  'break',   'goto',   'to', 'null'];
	var commonKeywords = new Object;
	commonKeywords.en    = ['New',  'Each',   'From','Do',  'False','True',  'Return', 'Then', 'Export', 'Undefined',   'Continue',  'Break',   'Goto',   'To', 'Null'];
	commonKeywords.ru    = ['Новый','Каждого','Из',  'Цикл','Ложь', 'Истина','Возврат','Тогда','Экспорт','Неопределено','Продолжить','Прервать','Перейти','По', 'Null'];

	var commontypesJS = ['var'];
	var commontypes = new Object;
	commontypes.en    = ['Var'];
	commontypes.ru    = ['Перем'];

	var operatorKeywordsJS = ['&&', '||', 'not','~',  'in'];
	var operatorKeywords = new Object;
	operatorKeywords.en    = ['and','or', 'not','xor','in'];
	operatorKeywords.ru    = ['И',  'ИЛИ','НЕ', 'xor','В'];

	var KeywordsJS  = openingKeywordsJS.concat(middleKeywordsJS).concat(doubleClosingJS).concat(commonKeywordsJS).concat(commontypesJS).concat(operatorKeywordsJS);
	var KeywordsEng = openingKeywords.en.concat(middleKeywords.en).concat(doubleClosing.en).concat(commonKeywords.en).concat(commontypes.en).concat(operatorKeywords.en);
	var KeywordsRus = openingKeywords.ru.concat(middleKeywords.ru).concat(doubleClosing.ru).concat(commonKeywords.ru).concat(commontypes.ru).concat(operatorKeywords.ru);

    var LetterRus = ['А','Б','В','Г','Д','Е','Ё' ,'Ж' ,'З','И','Й' ,'К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х' ,'Ц','Ч' ,'Ш' ,'Щ'  ,'Ъ','Ы','Ь','Э' ,'Ю' ,'Я' ,'а','б','в','г','д','е','ё' ,'ж' ,'з','и','к','л','м','н','о','п','р','с','т','у','ф','х' ,'ш' ,'щ'  ,'ъ','ы','ь','э' ,'ю' ,'я'];
	var LetterEng = ['A','B','V','G','D','E','JO','ZH','Z','I','JJ','K','L','M','N','O','P','R','S','T','U','F','KH','C','CH','SH','SHH','' ,'Y','' ,'EH','YU','YA','a','b','v','g','d','e','jo','zh','z','i','k','l','m','n','o','p','r','s','t','u','f','kh','sh','shh','' ,'y','' ,'eh','yu','ya'];
	
	function wordRegexp(words) {
		return new RegExp("^((" + words.join(")|(") + "))([ ;\\/\\n\\t]|$)", "i"); 
	}	

	var singleOperators = new RegExp("^[\\+\\-\\*/%&<>=]");
	var singleDelimiters = new RegExp("^[\\(\\)\\[\\]\\{\\},:=;\\.]");
	var doubleOperators = new RegExp("^((<>)|(<=)|(>=))");
	var identifiers = new RegExp("^[_A-Za-zА-ЯЁа-яё][_A-Za-z0-9А-ЯЁа-яё]*");	

	if(lang=='en'){
		var opening = wordRegexp(openingKeywords.en);
		var middle  = wordRegexp(middleKeywords.en);
		var doubleClosing = wordRegexp(doubleClosing.en);
		var keywords = wordRegexp(commonKeywords.en);
		var types = wordRegexp(commontypes.en);
		var wordOperators = wordRegexp(operatorKeywords.en);
	}else{
		var opening = wordRegexp(openingKeywords.ru);
		var middle  = wordRegexp(middleKeywords.ru);
		var doubleClosing = wordRegexp(doubleClosing.ru);
		var keywords = wordRegexp(commonKeywords.ru);
		var types = wordRegexp(commontypes.ru);
		var wordOperators = wordRegexp(operatorKeywords.ru);
	}	

	//var wordOperators = wordRegexp(operatorKeywordsEng.concat(operatorKeywordsRus));
	//var keywords = wordRegexp(commonKeywordsEng.concat(commonKeywordsRus));
	//var types = wordRegexp(commontypesEng.concat(commontypesRus));
	
	//var opening = wordRegexp(openingKeywordsEng.concat(openingKeywordsRus));
	//var middle = wordRegexp(middleKeywordsEng.concat(middleKeywordsRus));
	//var doubleClosing = wordRegexp(doubleClosingEng.concat(doubleClosingRus));
	//var doOpening = wordRegexp(['do', 'пока']);

	var Code1CStream = function(string) {
		this.pos = this.start = 0;
		this.string = string;
		this.poslineBegin = 0;
	  	this.lineNum   = 0;
	}

	var charEndLine   = '\n';
	var charSemiColon = ';';
	var stringPrefixes = '"';
	var stringNewLine  = '|';

	Code1CStream.prototype = {
		eol: function() {return this.pos >= this.string.length},
		//sol: function() {return this.pos == this.lineStart},
		peek: function() {return this.string.charAt(this.pos) || undefined},
		prev: function() {return this.string.charAt(this.pos-1) || undefined},
		next: function() {
			if (this.pos < this.string.length)
				{ return this.string.charAt(this.pos++) }
		},
		eat: function(match) {
			var ch = this.string.charAt(this.pos);
			var ok;
			if (typeof match == "string") { ok = ch == match }
				else { ok = ch && (match.test ? match.test(ch) : match(ch)) }
					if (ok) {++this.pos; return ch}
			},
		eatWhile: function(match) {
			var start = this.pos
			while (this.eat(match)){}
				return this.pos > start
		},
		eatSpace: function() {
			var this$1 = this;

			var start = this.pos
			while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) { ++this$1.pos }
				return this.pos > start
		},
		skipToEnd: function() {this.pos = this.string.length},
		skipToEndLine: function() { 
			while (!stream.eol() ){ 
				if(this.string.charAt(this.pos++)==charEndLine){
					this.lineNum++;
					this.poslineBegin = this.pos;	
					return;	
				} 
			}
		},
		tokenBase: function(){},
		match: function(pattern) {
			var match = this.string.slice(this.pos).match(pattern)
			if (match && match.index > 0) { return null; }
				if (match) { this.pos += match[0].length }
					return match
		},
		current: function(){return this.string.slice(this.start, this.pos)},
		readToken: function(){
			var state = { name: "", desc: "", pos: this.pos-this.poslineBegin, row: this.lineNum };

			

			if (this.eatSpace()) {
				state.name = "space";
				return state;
			}

			var ch = this.peek();
            var prev = this.prev();  

			// Handle new line
			// if(ch == charEndLine){
			// 	this.lineNum++;
			// 	this.poslineBegin = this.pos;
			// 	this.pos++;
			// 	state.name = "new line";
	  //       	return state;
			// }
			// if(prev == charEndLine){
			// 	this.lineNum++;
			// 	this.lineStart = this.pos;
			// 	this.pos++;
			// 	state.name = "new line";
	  //       	return state;
			// }


	        //handle Comments = //
	        if (ch === "/") {
	        	var ch_next = string.charAt(stream.pos+1) || undefined;
	        	if (ch_next === "/") {
	        		this.skipToEndLine();
	        		state.name = "comment";
	        		return state;
	        	}
	        }

	        //handle meta = &OnClient or #If
	        if (ch === '&' || ch === '#') {
	        	this.skipToEndLine();
	        	state.name = "meta";
	        	return state;
	        }

	        //~nameLabel
	        // if (ch === "~"){
	        //     next();
	        //     match(identifiers);
	        //     state.name = 'label';
	        //     return state;
	        // }
	        
	        // Handle Number Literals
	        if (this.match(/^\.?[0-9]{1,}/i, false)) {
	        	var floatLiteral = false;
	            // Floats
	            if (this.match(/^\d*\.\d+F?/i)) { floatLiteral = true; }
	            else if (this.match(/^\d+\.\d*F?/)) { floatLiteral = true; }
	            else if (this.match(/^\.\d+F?/)) { floatLiteral = true; }

	            if (floatLiteral) {
	                // Float literals may be "imaginary"
	                this.eat(/J/i);
	                state.name = 'number';
	                return state;
	            }
	            // Integers
	            var intLiteral = false;
	            // Hex
	            if (this.match(/^&H[0-9a-f]+/i)) { intLiteral = true; }
	            // Octal
	            else if (this.match(/^&O[0-7]+/i)) { intLiteral = true; }
	            // Decimal
	            else if (this.match(/^[1-9]\d*F?/)) {
	                // Decimal literals may be "imaginary"
	                this.eat(/J/i);
	                // TODO - Can you have imaginary longs?
	                intLiteral = true;
	            }
	            // Zero by itself with no other piece of number.
	            else if (this.match(/^0(?![\dx])/i)) { intLiteral = true; }
	            if (intLiteral) {
	                // Integer literals may be "long"
	                this.eat(/L/i);
	                state.name = 'number';
	                return state;
	            }
	        }

	        // Handle strings
	        if (this.match(stringPrefixes)) {
	        	//state.tokenize = tokenStringFactory(stringPrefixes);
	        	//return state.tokenize(stream, state);
	        	while (!stream.eol()) {
					stream.eatWhile(/[^'"]/);
					if (stream.match(stringPrefixes)) {
						state.name = "string";
						return state;
					} else {
						state.name = "error";
						state.desc = "Expected end of string";
						next();
						return state;
					}
				}
	        }
	        // if (this.match(stringNewLine)) {
	        // 	state.tokenize = tokenStringFactory(stringPrefixes);
	        // 	return state.tokenize(stream, state);
	        // }

	        // Handle operator
	        if (this.match(doubleOperators)
	        	|| this.match(singleOperators)
	        	|| this.match(wordOperators)) {
	        	state.name = 'operator';
	        	return state;
	    	}
		    if (this.match(singleDelimiters)) {
		    	state.name = 'delimiter';
		    	return state;
		    }
		    // if (this.match(doOpening)) {
		    // 	// indent(stream,state);
		    // 	// state.doInCurrentLine = true;
		    // 	state.name = 'keyword';
		    // 	return state;
		    // }
		    if (stream.match(opening)) {
		    	// if (! state.doInCurrentLine)
		    	// 	indent(stream,state);
		    	// else
		    	// 	state.doInCurrentLine = false;
		    	state.name = 'keyword';
		    	return state;
		    }
		    if (stream.match(middle)) {
		    	state.name = 'keyword';
		    	return state;
		    }

		    if (this.match(doubleClosing)) {
		            //dedent(stream,state);
		            //dedent(stream,state);
		            state.name = 'keyword';
		            return state;
		        }
		        // if (this.match(closing)) {
		        // 	//dedent(stream,state);
		        // 	state.name = 'keyword';
		        // 	return state;
		        // }

		        if (this.match(types)) {
		        	state.name = 'keyword';
		        	return state;
		        }

		        if (this.match(keywords)) {
		        	state.name = 'keyword';
		        	return state;
		        }	


		        if (this.match(identifiers)) {
		        	state.name = 'variable';
		        	return state;
		        }

				// Handle non-detected items
				if( state.name === ""){
					state.name = "error";
					state.desc = "Undefine variable";
					next();
					return state;
				}
		},
		
        trasferKeyword: function(keyword){
			function findKeyword(age) {
    			return keyword.indexOf(age) == 0;
			}
			var lastChar = '';
			if(keyword.length>1) lastChar = keyword[keyword.length-1];
			//switch(lastChar){
			//	case 	
			//} 
			//if(lastChar==' ') lastChar = ' ';
			//if(lastChar==charEndLine) lastChar = charEndLine;
			//if(lastChar==charSemiColon) lastChar = charSemiColon;
						
			var index = KeywordsRus.findIndex(findKeyword);
			if(index==-1) return keyword;
			else return KeywordsJS[index]+lastChar;
        },

        transferFunction: function(keyword){

        	if(lang=='en'){
        		if(keyword=='Left'){;}

        	}else{
        		if(keyword=='Лев'){
        			this.next();
        			stream.start = stream.pos;
        			this.eatWhile(/[^,]/);
        			var str = this.trasferVariable(this.current());
        			this.next();
        			stream.start = stream.pos;
        			//this.eatWhile(/[^)]/);
        			//var len = this.trasferVariable(this.current());
        			return str+'.substring(0,';
        		}
        	}	

			return keyword;
        },

        trasferVariable: function(keyword){
			
        	var result = '';	

            if( this.peek() == '(') return this.transferFunction(keyword);

			for (var i = keyword.length-1; i >= 0; i--) {
				var index = LetterRus.indexOf(keyword[i]);
				if(index==-1)  result = keyword[i] + result;	
			 	else result = LetterEng[LetterRus.indexOf(keyword[i])] + result;
			} 
			return result;
		},


		// Main function
	    trasfer: function(){

	    	var output_js = "";
	    	if(string == "") return output_js;

	    	this.lineNum = 0;
	    	while (!stream.eol()) {
	    		var token = this.readToken();

	    		//if( string[this.pos-1] == charEndLine) output_js += '\n';	
	    		//if(token.name) output_js += this.current();

	    		switch(token.name){
	    			case 'keyword': 
	    			  output_js += this.trasferKeyword(this.current());
	    			  break;
	    			//case 'new line': output_js += '\n';
	    			//  break;  
	    			case 'variable':
	    			  output_js += this.trasferVariable(this.current());
	    			  break;
	    		//	case 'number':
	    		//	case 'keyword': 
	    		//	output_js += this.current();
	    		//	break;
	    			default: 
	    			  output_js += this.current();
	    			  break;
	    		}
	    		stream.start = stream.pos;
	    	}
	    	return output_js;	
	    }
	} 

	var stream = new Code1CStream(string);
	return stream.trasfer();	
} 