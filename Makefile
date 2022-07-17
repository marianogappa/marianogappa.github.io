update_pdf_from_current_online_cv: ## cv must be updated online
	@"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --print-to-pdf http://marianogappa.github.io/cv/ --crash-dumps-dir=/tmp
	@mv output.pdf cv/cv.pdf

copy_cv: ## copy cv from ~/Code/cv/* to cv/ so latest version is updated on the site
	@cp -rf ~/Code/cv/* cv/

serve: ## serve to localhost
	bundle exec jekyll serve --livereload

build: ## build into _site (still have to run something else to deploy)
	bundle exec jekyll build

help: ## prints this help
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

.PHONY: serve build help copy_cv update_pdf_from_current_online_cv
