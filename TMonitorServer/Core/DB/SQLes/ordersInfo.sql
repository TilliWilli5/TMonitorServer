--Inserting
INSERT INTO orders(installation_id, name) VALUES(8, 'quit');
--How to check order existence
SELECT rowid FROM orders WHERE installation_id=8 AND name='quit';
--How to flush/clear orders for certain installation
DELETE FROM orders WHERE installation_id=8;