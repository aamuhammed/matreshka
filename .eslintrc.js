module.exports = {
    root: true,
    extends: 'airbnb',
    plugins: ["output-todo-comments"],
    parser: 'babel-eslint',
    rules: {
        indent: ['error', 4, { 'SwitchCase': 1 }],
        'no-var': 'error',
        'prefer-rest-params': 0, // arguments work faster
        'no-param-reassign': 0, // hard to follow
        'no-underscore-dangle': 0, // for some hacks and array methods underscore prefix/suffix is required
        'no-use-before-define': 0, // impossible to follow
        'global-require': 0, // allow to fix circular refs
        'new-cap': ['error', {"capIsNewExceptions": ['Class']}],
        'comma-dangle': ["error", "never"], // personal preference
        'output-todo-comments/output-todo-comments': [
            'warn', {
                terms: ['todo'],
                location: 'start',
            }
        ]
    },
    env: {
        jasmine: true
    },
    globals: {
        nofn: true,
        window: true
    }
};
