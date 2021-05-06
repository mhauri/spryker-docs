const Suggestions = {
    searchClient: null,
    defaultHitsPerPage: 5,
    init(searchClient, indicesConfig, autocompleteConfig) {
        this.searchClient = searchClient;
        const sources = indicesConfig.map(indexConfig => this.createSource(indexConfig));
        const {searchInput, options} = autocompleteConfig;
        autocomplete(searchInput, options, sources);
        this.bindSearchEvents(searchInput);
    },
    createSource(indexConfig) {
        return {
            source: autocomplete.sources.hits(
                this.searchClient.initIndex(indexConfig.name),
                {
                    hitsPerPage: indexConfig.hitsPerPage || this.defaultHitsPerPage
                }
            ),
            name: indexConfig.name,
            templates: {
                header: `<div>${indexConfig.title}</div>`,
                suggestion(suggestion) {
                    let title = suggestion._highlightResult.title
                        ? suggestion._highlightResult.title.value
                        : suggestion.title;

                    if (typeof title === 'undefined') {
                        title = suggestion.slug;
                    }

                    return `<a href="${suggestion.url}">${title}</a>`;
                },
                empty: '<p>No matching results</p>',
            },
        };
    },
    bindSearchEvents(searchInput) {
        $(document).keyup(function(event) {
            if (event.which == 27) {
                $("body").removeClass("search-active");
            }
        });

        $(searchInput).on("keypress", function(event) {
            let value = autocomplete.escapeHighlightedString(
                event.target.value
            );

            if (!value) {
                return;
            }

            if (event.which == 13) {
                window.location = $(this).closest('form').attr('action') + `?query=${value}`;
            }
        });
    }
};