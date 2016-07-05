SELECT projects.rowid, projects.name, projects.ticket, tm.name, tm.token, tm.project_id, tm.hits, tm.dates, tm.installation_id, tm.type, tm.point, tm.ping
FROM
	projects
	JOIN
	(
		SELECT installations.name, installations.token, project_id, tm.hits, tm.dates, tm.installation_id, tm.type, tm.point, tm.ping
		FROM
			installations
		JOIN
			(
				SELECT COUNT(point) AS hits, date(creating_time) as dates, telemetry.installation_id, type, point, last_update AS ping
				FROM telemetry JOIN pings
				ON telemetry.installation_id = pings.installation_id
				WHERE type != 14
				GROUP BY dates, telemetry.installation_id, type, point
			) AS tm
		ON installations.rowid = tm.installation_id
	) AS tm
	ON tm.project_id = projects.rowid;