CREATE DATABASE IF NOT EXISTS hti_ss;
CREATE DATABASE IF NOT EXISTS hti_ss_account;
CREATE USER 'hti'@'%' IDENTIFIED BY 'db_password';
GRANT ALL PRIVILEGES ON hti_ss.* TO 'hti'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON hti_ss_account.* TO 'hti'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;