exports.findByLoginId = "SELECT * FROM users WHERE login_id = ? AND status > 0 LIMIT 1";
