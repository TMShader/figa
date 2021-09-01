function isLoggedIn(callback) {
	if (localStorage.getItem("token") != undefined) {
		fetch("../../../api/user/me", {
			headers: {
				token: localStorage.getItem("token"),
			},
			method: "GET",
		}).then((response) => {
			response.text().then((json) => {
				var res = JSON.parse(json);
				console.log(res)
				if (response.ok) {
					return callback(
						valid = true,
						status = 200,
						message = res.message,
					);
				} else if (response.status == 400 && typeof token === "undefined") {
					return callback(
						valid = false,
						status = 401,
					);
				} else if (response.status == 400 && !(typeof token === "undefined")) {
					return callback(
						valid = false,
						status = 400,
					);
				} else {
					console.log(response.status);
					console.log(response);
				}
			});
		});
	} else {
		return callback(
			valid = false,
			status = 400,
		);
	}
}