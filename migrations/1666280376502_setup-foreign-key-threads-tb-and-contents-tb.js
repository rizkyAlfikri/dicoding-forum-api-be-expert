/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.addConstraint('threads', 'fk_threads.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

    pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
       
    pgm.dropConstraint('threads', 'fk_threads.owner_users.id');

    pgm.dropConstraint('comments', 'fk_comments.owner_users.id');
};
