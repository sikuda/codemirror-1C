function Transfer1CJS(string){

	var Code1CStream = function(string) {
		this.pos = this.start = 0;
		this.string = string;
		this.lineStart = 0;
	  	this.lineNum   = 0;
	}

	Code1CStream.prototype = {
		eol: function() {return this.pos >= this.string.length},
		sol: function() {return this.pos == this.lineStart},
		peek: function() {return this.string.charAt(this.pos) || undefined},
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
		tokenBase: function(){},
		match: function(pattern) {
			var match = this.string.slice(this.pos).match(pattern)
			if (match && match.index > 0) { return null; }
				if (match) { this.pos += match[0].length }
					return match
		},
		current: function(){return this.string.slice(this.start, this.pos)},
		readToken: function(){
			var state = { name: "", desc: "", pos: this.pos-this.lineStart, row: this.lineNum };

			function wordRegexp(words) {
				return new RegExp("^((" + words.join(")|(") + "))([ ;\\/\\n\\t]|$)", "i"); 
			}	

			var singleOperators = new RegExp("^[\\+\\-\\*/%&<>=]");
			var singleDelimiters = new RegExp("^[\\(\\)\\[\\]\\{\\},:=;\\.]");
			var doubleOperators = new RegExp("^((<>)|(<=)|(>=))");
			var identifiers = new RegExp("^[_A-Za-zА-ЯЁа-яё][_A-Za-z0-9А-ЯЁа-яё]*");	

			var openingKeywords = ['если', 'if', 'пока', 'while', 'для', 'for', 'процедура', 'procedure', 'функция', 'function', 'попытка', 'try'];
			var middleKeywords = ['иначе', 'else', 'иначеесли', 'elsif', 'исключение', 'except'];
			var doubleClosing = wordRegexp(['конецесли', 'endif', 'конеццикла',  'конецпроцедуры', 'endprocedure', 'конецфункции', 'endfunction', 'конецпопытки', 'endtry']);
			var endKeywords = ['loop'];
			var operatorKeywords = ['and', 'or', 'not', 'xor', 'in'];
			var commonKeywords = ['новый', 'new', 'каждого', 'each', 'из', 'from', 'цикл', 'do', 'или', 'or', 'не', 'not', 'ложь', 'false', 'истина', 'true', 'и','and', 'возврат', 'return', 'тогда', 'then', 'экспорт', 'export', 'неопределено', 'undefined', 'продолжить', 'continue', 'прервать', 'break', 'перейти', 'goto', 'по', 'to' , 'null'];
			var commontypes = ['перем', 'var'];

			var wordOperators = wordRegexp(operatorKeywords);
			var keywords = wordRegexp(commonKeywords);
			var types = wordRegexp(commontypes);
			var stringPrefixes = '"';
			var stringNewLine  = '|';

			var opening = wordRegexp(openingKeywords);
			var middle = wordRegexp(middleKeywords);
			var closing = wordRegexp(endKeywords);
			var doOpening = wordRegexp(['do', 'пока']);

			if (this.eatSpace()) {
				state.name = "space";
				return state;
			}

			var ch = this.peek();

			// Handle new line
			if(ch == '\n'){
				this.lineNum++;
				this.lineStart = pos;
				this.pos++;
				state.name = "new line";
	        	return state;
			}	

	        // Handle Comments
	        if (ch === "/") {
	        	var ch_next = string.charAt(stream.pos+1) || undefined;
	        	if (ch_next === "/") {
	        		this.skipToEnd();
	        		state.name = "comment";
	        		return state;
	        	}
	        }

	        //handle meta - &OnClient or #If
	        if (ch === "&" || ch === "#") {
	        	this.skipToEnd();
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
		    if (this.match(doOpening)) {
		    	// indent(stream,state);
		    	// state.doInCurrentLine = true;
		    	state.name = 'keyword';
		    	return state;
		    }
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
		        if (this.match(closing)) {
		        	//dedent(stream,state);
		        	state.name = 'keyword';
		        	return state;
		        }

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
		
		// Main function
	    trasfer: function(){

	    	var output_js = "";
	    	if(string == "") return output_js;

	    	this.lineNum = 0;
	    	while (!stream.eol()) {
	    		var token = this.readToken();
	    		switch(token.name){
	    			case "variable": 
	    			output_js += this.current();
	    			break;
	    			default: break;
	    		}
	    		stream.start = stream.pos
	    	}
	    	return output_js;	
	    }
	} 

	var stream = new Code1CStream(string);
	return stream.trasfer();	

} 