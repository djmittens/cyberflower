.PHONY: setup build run clean lint test

PUBLIC_DIR := public
SRC_DIR := src
CONTENT_DIR := content

setup:
	@echo "No external dependencies required. Ensure Node 18+ and Python 3 are installed."

build:
	@node scripts/build.mjs

run:
	@echo "Serving ./public at http://localhost:5173"
	@python3 -m http.server 5173 -d $(PUBLIC_DIR)

clean:
	rm -rf $(PUBLIC_DIR)

lint:
	@echo "No linters configured yet. Consider adding prettier/eslint if desired."

test:
	@echo "No tests yet. Add tests under tests/."

