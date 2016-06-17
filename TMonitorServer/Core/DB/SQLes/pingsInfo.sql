--Initialization
INSERT INTO pings(installation_id) VALUES (1);
INSERT INTO pings(installation_id) VALUES (2);
INSERT INTO pings(installation_id) VALUES (3);
INSERT INTO pings(installation_id) VALUES (4);
INSERT INTO pings(installation_id) VALUES (5);
INSERT INTO pings(installation_id) VALUES (6);
INSERT INTO pings(installation_id) VALUES (7);
INSERT INTO pings(installation_id) VALUES (8);
INSERT INTO pings(installation_id) VALUES (9);
INSERT INTO pings(installation_id) VALUES (10);

--Updating
UPDATE pings SET last_update = datetime('now', 'localtime') WHERE installation_id=3;