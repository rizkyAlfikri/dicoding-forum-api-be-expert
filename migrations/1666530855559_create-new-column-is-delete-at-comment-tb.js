/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn('comments', {
        is_delete: {
            type: 'BOOLEAN',
        }
    });
};

exports.down = pgm => {
    pgm.dropColumn('is_delete', 'addColumn');
};
