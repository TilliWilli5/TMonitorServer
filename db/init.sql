--users table
CREATE TABLE IF NOT EXISTS users(
	name TEXT,
	password TEXT,
	email TEXT,
	privilege TEXT,--admin|viewer|user
	created DATETIME DEFAULT (datetime('now', 'localtime')),
	project_access_field TEXT--Array of rowid of projects in in wich user has access [1, 11, 13, 15] - access to 4 projects by id / [5] - access only to one specific project
);
--projects table
CREATE TABLE IF NOT EXISTS projects(
	name TEXT,
	description TEXT,
	created DATETIME DEFAULT (datetime('now', 'localtime'))
);
--installations table
CREATE TABLE IF NOT EXISTS installations(
	name TEXT,
	description TEXT,
	token TEXT,
	created DATETIME DEFAULT (datetime('now', 'localtime')),
	projectID INT--Reference to `projects.rowid`
);
--telemetry data table
CREATE TABLE IF NOT EXISTS telemetry(
	installationID INT,--Reference to rowid of `installations`,
	created DATETIME DEFAULT (datetime('now', 'localtime')),
	type INT,
	creatingTime TEXT,
	point TEXT
);
--ping messages table
CREATE TABLE IF NOT EXISTS pings(
	installationID INT,--Reference to rowid of `installations`,
	created DATETIME DEFAULT (datetime('now', 'localtime'))
);
--orders for installations
CREATE TABLE IF NOT EXISTS orders(
	installationID INT,--Reference to rowid of `installations`,
	created DATETIME DEFAULT (datetime('now', 'localtime')),
	name TEXT
);