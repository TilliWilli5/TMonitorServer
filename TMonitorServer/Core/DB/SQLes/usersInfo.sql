--Insert
INSERT INTO users(login, password, email, privilege, project_access_field) VALUES ("tilli","visuals11","tilliwilli@gmail.com","admin","1 2 3 4");
INSERT INTO users(login, password, email, privilege, project_access_field) VALUES ("cybermix","visuals11","m@visualsinmotion.ru","admin","1 2 3 4");
INSERT INTO users(login, password, email, privilege, project_access_field) VALUES ("rusimp","rusimp","hello@rusimp.org","user","1");
--Получение информации об юзере по его сессии
SELECT
	users.rowid,
	users.login,
	users.password,
	users.privilege,
	users.created,
	users.project_access_field,
	sessions.usid,
	sessions.created,
	sessions.expired
FROM
	users JOIN sessions
ON
	users.rowid=sessions.user_id
	AND
	sessions.usid='9e5ba740-347a-11e6-b989-eb12ef5e6599';