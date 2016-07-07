SELECT
	projects.name as projectName, ticket, instaName, token, project_id, installation_id, last_update
FROM
	projects
	JOIN
	(
		SELECT
			name AS instaName, token, project_id, installation_id, last_update
		FROM
			installations
			JOIN
			(
				SELECT
					*
				FROM
					pings
			)
		ON
			installation_id = installations.rowid
	)
	ON
		project_id = projects.rowid;