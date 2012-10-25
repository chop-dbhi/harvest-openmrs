{% include "cilantro/_config.js" %}

require.paths = {
    'project': '{{ JAVASCRIPT_URL }}'
};

App.defaults.dataview = {
    columns: [10, 1, 2, 48, 50, 8],
    ordering: [[10, 'asc']]
};
