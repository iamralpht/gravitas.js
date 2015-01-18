all: gravitas.js

gravitas.js: src/*.js
	@(cd src; browserify -o ../gravitas.js index.js)

clean:
	@rm gravitas.js
