const AuthorizationError = require('./AuthorizationError');
const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread karena property yang dibutuhkan tidak ada'),
  'THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'THREAD_REPOSITORY_POSTGRESS.THREAD_ID_DOES_NOT_EXIST': new NotFoundError('Thread yang anda minta tidak ada.'),
  'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment karena property yang dibutuhkan tidak ada'),
  'COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'DELETE_COMMENT.DOES_NOT_CONTAIN_NEEDED_DATA': new InvariantError('tidak dapat membuat delete comment data karena property yang dibutuhkan tidak ada'),
  'DELETE_COMMENT.DOES_NOT_MEET_DATA_TYPE_SPESIFICATION': new InvariantError('tidak dapat membuat delete comment data karena tipe data tidak sesuai'),
  'COMMENT_REPOSITORY_POSTGRES.COMMENT_OWNER_DOES_NOT_VALID': new AuthorizationError('tidak bisa menghapus comment yang bukan milik sendiri'),
  'COMMENT_REPOSITORY_POSTGRES.COMMENT_ID_DOES_NOT_EXIST': new NotFoundError('comment yang dihapus tidak valid'),
  'GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPESIFICATION': new InvariantError('tidak dapat mendapatkan thread karena, tipe data tidak sesuai'),
  'REPLY.NOT_CONTAIN_NEEDED_PROPERTIES': new InvariantError('tidak dapat membuat balasan karena property yang dibutuhkan tidak ada'),
};

module.exports = DomainErrorTranslator;
