const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    //Convert to empty string to be tested
    data.text = !isEmpty(data.text) ? data.text : '';

    if(!Validator.isLength(data.text, { min: 10, max: 300 }))
        errors.text = 'Comment must be between 10 and 300 characters';

    if (Validator.isEmpty(data.text))
        errors.text = 'Comment content is required';

    return { errors, isValid: isEmpty(errors) }
}