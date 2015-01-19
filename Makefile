all: gravitas.js

gravitas.js: src/*.js
	@(cd src; browserify -o ../gravitas.js -s Gravitas index.js)

clean:
	@rm gravitas.js
