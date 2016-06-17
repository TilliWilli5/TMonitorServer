PRAGMA foreign_keys = ON;
--users table
CREATE TABLE IF NOT EXISTS users(
	rowid INTEGER PRIMARY KEY,
	login TEXT,
	password TEXT,
	email TEXT,
	privilege TEXT,--admin|viewer|user
	created DATETIME DEFAULT (datetime('now', 'localtime')),
	project_access_field TEXT--Array of rowid of projects in in wich user has access [1, 11, 13, 15] - access to 4 projects by id / [5] - access only to one specific project
);
--projects table
CREATE TABLE IF NOT EXISTS projects(
	rowid INTEGER PRIMARY KEY,
	name TEXT,
	description TEXT,
	ticket TEXT,
	created DATETIME DEFAULT (datetime('now', 'localtime'))
);
--installations table
CREATE TABLE IF NOT EXISTS installations(
	rowid INTEGER PRIMARY KEY,
	name TEXT,
	description TEXT,
	token TEXT,
	created DATETIME DEFAULT (datetime('now', 'localtime')),
	project_id INT NOT NULL,
	FOREIGN KEY(project_id) REFERENCES projects(rowid)
);
--telemetry data table
CREATE TABLE IF NOT EXISTS telemetry(
	installation_id INT NOT NULL,
	created DATETIME DEFAULT (datetime('now', 'localtime')),
	type INT,
	creating_time TEXT,
	point TEXT,
	FOREIGN KEY(installation_id) REFERENCES installations(rowid)
);
--ping messages table
CREATE TABLE IF NOT EXISTS pings(
	installation_id INT NOT NULL,--Reference to rowid of `installations`,
	last_update DATETIME DEFAULT (datetime('now', 'localtime')),
	FOREIGN KEY(installation_id) REFERENCES installations(rowid)
);
--orders for installations
CREATE TABLE IF NOT EXISTS orders(
	installation_id INT,
	created DATETIME DEFAULT (datetime('now', 'localtime')),
	name TEXT,
	FOREIGN KEY(installation_id) REFERENCES installations(rowid)
);
CREATE TABLE IF NOT EXISTS sessions(
	user_id INTEGER NOT NULL,
	usid TEXT NOT NULL,
	created DATETIME DEFAULT (datetime('now', 'localtime')),
	expired DATETIME,
	FOREIGN KEY(user_id) REFERENCES users(rowid)
);