class Neterror {
	status_code;
	error;
	error_description;
	
	constructor(status_code, error, error_description) {
		this.status_code = status_code;
		this.error = error;
		this.error_description = error_description;
	}
}

module.exports = Neterror;
