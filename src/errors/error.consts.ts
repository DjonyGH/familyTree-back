// USERS
export const USER_NOT_FOUND = 'Пользователь не найден';
export const USER_FORBIDDEN = 'Пользователь не доступен';
export const USER_NOT_AUTH = 'Пользователь не авторизован';
export const ERROR_OF_USER_ALREADY_EXIST =
  'Пользователь с таким логином уже существует';

export const ERROR_OF_USER_CREATE = 'Ошибка создания пользователя';
export const ERROR_OF_USER_AS_OWNER_CREATE =
  'Ошибка! Нельзя создать пользователя с ролью владельца аккаунта';

export const ERROR_OF_USER_UPDATE = 'Ошибка обновления пользователя';
export const ERROR_OF_OWNER_UPDATE =
  'Ошибка! Изменять пользователя "Владелец аккаунта" может только он сам';
export const ERROR_OF_OWNER_ROLE_UPDATE =
  'Ошибка! Нельзя изменить роль у владельца аккаунта';
export const ERROR_OF_IS_OWNER_ROLE_TO_USER_UPDATE =
  'Ошибка! Нельзя присвоить роль "Владелец аккаунта" обычному пользователю';

export const ERROR_OF_USER_DELETION = 'Ошибка удаления пользователя';
export const ERROR_OF_OWNER_DELETION =
  'Ошибка! Нельзя удалить владельца аккаунта';

// ROLES
export const ROLE_NOT_FOUND = 'Роль не найдена';
export const ERROR_OF_ROLE_ALREADY_EXIST =
  'Роль с таким наименованием уже существует';
export const ERROR_OF_ROLE_CREATE = 'Ошибка создания роли';
export const ERROR_OF_ROLE_UPDATE =
  'Ошибка обновления роли. Данная роль не найдена';
export const ERROR_OF_IS_OWNER_ROLE_UPDATE =
  'Ошибка! Изменить роль "Владелец аккаунта" может только он сам';
export const ERROR_OF_ROLE_DELETION = 'Ошибка удаления роли';
export const ERROR_OF_IS_OWNER_ROLE_DELETION =
  'Ошибка! Нельзя удалить роль "Владелец аккаунта"';

// AUTH
export const LOGIN_OR_PASSWORD_ERROR = 'Неверный логин или пароль';
export const TOKEN_NOT_FOUND = 'Токен не найден';
export const TOKEN_REVOKED = 'Токен отозван';
export const TOKEN_ERROR = 'Неверный токен';

// PERMISSION
export const FORBIDDEN = 'Нет доступа к данной операции';

// GENERAL
export const UNKNOWN_ERROR = 'Неизвестная ошибка';
