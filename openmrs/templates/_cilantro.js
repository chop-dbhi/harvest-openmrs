var require = {
        baseUrl: '{{ STATIC_URL }}cilantro/js'
    },

    cilantro = {
        url: '{% url "serrano:root" %}',
        main: '#content',
        root: '{{ request.META.SCRIPT_NAME }}'
    };
