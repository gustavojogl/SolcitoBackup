function PasswordPanel() {
	var self = this;
	
	this.title = ko.observable("Acceso requerido");
	this.password = ko.observable("");
	
	this.submit = function() {
		amplify.request({
			resourceId: "checkPassword",
			data: {
				password: self.password()	
			},
			success: function (data) {
				if (data.result) {
					Application.password(self.password());
					Application.onLogin();
					Application.hidePasswordPanel();
				} else {
					self.title('Clave error');
				}
			},
			error: function (data) {
				Application.passwordPanel(null);
				Application.globalError({ title: "Connection error!", text: "Error conectando con el server." });
			}
		});
	};
	
	/* Constructor */
	amplify.request({
		resourceId: "hasPassword",
		data: {},
		success: function (data) {
			if (!data.result) {
				Application.passwordPanel(null);
				Application.globalError({ title: "Configuration error!", text: "Cambiar Clave!" });
			}
		},
		error: function (data) {
			Application.passwordPanel(null);
			Application.globalError({ title: "Connection error!", text: "Refrescar pagina." });
		}
	});
}
