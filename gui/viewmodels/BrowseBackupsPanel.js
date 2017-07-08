function BrowseBackupsPanel() {
	var self = this;

	/* Properties */
	this.data = ko.observableArray([]);

	/* Methods */
	this.load = function () {
		$.getJSON('api/index.php?path=/backups/get&key=' + Application.password(), function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
				var obj = data[i];

				obj.archives = ko.observableArray([]);
				obj.removeConfirm = (function(obj){
					return function () {
						self.removeConfirm(obj.title);
					};
				})(obj);
				obj.backup = (function(obj){
					return function () {
						self.backup(obj.title);
					}
				})(obj);
			};

			self.data(data);
			self.loadArchives();
		});
	};

	this.loadArchives = function(){
		for (var i = self.data().length - 1; i >= 0; i--) {
			var obj = self.data()[i];

			(function(obj){
				$.getJSON('api/index.php?path=/backups/getArchives&title=' + obj.title + '&key=' + Application.password(),
					function(data) {
						for (var i = data.length - 1; i >= 0; i--) {
							(function(archive) {
								archive.prettySize = ko.computed(function(){
									var i = 0;
									var byteUnits = [' bytes' , ' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];

									while (archive.size > 1024) {
										archive.size = archive.size / 1024;
										i++;
									}

									if (i > 0)
										return archive.size.toFixed(1) + byteUnits[i];
									else
										return archive.size + byteUnits[i];
								});

								archive.remove = function() {
									Application.showDialog('Seriously?', 'Are you sure you want to remove this archive?',
									[{
									text: 'Delete permanently',
									styles: {'btn-danger': true},
									click: function() {
										$.getJSON('api/index.php?path=/archives/remove&title=' + encodeURIComponent(obj.title) + '&fileName=' + encodeURIComponent(archive.name) + '&key=' + Application.password(), function(info) {
											Application.alert("Hecho!", "The archive was removed.", 'success');

											self.load();
										}).error(function (xhr) {
											//if (xhr.status == 400)
											Application.alert("Error!", "There was an error trying to delete the archive!", 'error');
										});
									}
									}]);
								};

								archive.download = function() {
									window.location = 'api/index.php?path=/archives/download&title=' + encodeURIComponent(obj.title) + '&fileName=' + encodeURIComponent(archive.name) + '&key=' + Application.password();
								};

								archive.restore = function() {
									var archiveRestore = function(withDb, withFiles) {
										Application.showRestoringBackupPanel();

										$.getJSON('api/index.php?path=/archives/restore&title=' + encodeURIComponent(obj.title) + '&fileName=' + encodeURIComponent(archive.name) + '&database=' + (withDb ? 'true' : 'false') + '&files' + (withFiles ? 'true' : 'false') + '&key=' + Application.password(), function(info) {
											Application.alert("Hecho!", "The archive was restored.", 'success');

											Application.hideRestoringBackupPanel();
										}).error(function (xhr) {
											//if (xhr.status == 400)
											Application.alert("Error!", "There was an error trying to restore the archive!", 'error');

											Application.hideRestoringBackupPanel();
										});
									};


									Application.showDialog('Seriously?', 'Are you sure you want to restore this archive? The files in this archive will override your files but will keep the files which are not backuped. Please choose what to restore from the archive.',
									[{
										text: 'Files only',
										styles: {'btn-danger': true},
										click: function() {
											archiveRestore(false, true);
										}
									},
									{
										text: 'Database only',
										styles: {'btn-danger': true},
										click: function() {
											archiveRestore(true, false);
										}
									},
									{
										text: 'Files AND database',
										styles: {'btn-danger': true},
										click: function() {
											archiveRestore(true, true);
										}
									}]);
								};
							})(data[i]);
						};

						/*data.sort(function(a, b) {
							return Date.parse(a.date) - Date.parse(b.date);
						});*/

						obj.archives(data);
					}
				);
			})(obj);
		};
	};

	this.removeConfirm = function (title) {
		Application.showDialog("Eliminar este trabajo?", "Esta seguro de eliminar este trabajo? " +
			"The already created backup archives will not be deleted.",
			[{
				text: 'Remove',
				styles: {'btn-danger': true},
				click: function () {
					self.remove(title);
				}
			}]);
	};

	this.remove = function (title) {
		$.get('api/index.php?path=/backups/remove&title=' + title + '&key=' + Application.password(),
			function () {
				Application.alert("Hecho!", "Backup Eliminado.", 'success');

				self.load();
			}).error(function (xhr) {
				//if (xhr.status == 400)
				Application.alert("Error!", "There was an error trying to delete the backup!", 'error');
			});
	};

	this.backup = function (title) {
		Application.showCreatingBackupPanel();

		$.getJSON('api/index.php?path=/backups/backup&title=' + title + '&key=' + Application.password(),
			function (data) {
				Application.alert("Hecho!", "Backup Creado.", 'success');

				for (var i = data.warnings.length - 1; i >= 0; i--) {
					Application.alert("Warning!", data.warnings[i], 'warning');
				}

				Application.hideCreatingBackupPanel();
			}).error(function (xhr) {
				Application.alert("Error!", "There was an error trying to create a backup!", 'error');

				Application.hideCreatingBackupPanel();
			});
	};

	/* Constructor */
	this.load();
}
