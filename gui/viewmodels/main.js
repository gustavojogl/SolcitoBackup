function SmartBackup() {
	var self = this;

	this.plainPassword = ko.observable();
	this.password = ko.computed({
		read: function () {
			return encodeURIComponent(self.plainPassword());
		},
		write: function (value) {
			self.plainPassword(value);
		}
	});
	this.alerts = ko.observableArray();

	this.modalBox = ko.observable(null);
	this.privateKeyPanel = ko.observable(null);

	/* Panels */
	this.passwordPanel = ko.observable();
	this.globalError = ko.observable();
	this.newBackupPanel = ko.observable(null);
	this.browseBackupsPanel = ko.observable(null);
	this.quickBackupPanel = ko.observable(null);
	this.restoringBackup = ko.observable(false);
	this.creatingBackup = ko.observable(false);

	/* Methods */
	this.hidePasswordPanel = function () {
		self.passwordPanel(null);
		self.showBrowseBackupsPanel(true);
	};

	this.showNewBackupPanel = function () {
		self.hideBrowseBackupsPanel();
		self.hideRestoringBackupPanel(true);
		self.hideCreatingBackupPanel(true);
		self.hideQuickBackupPanel(true);
		self.newBackupPanel(new NewBackupPanel());
	};
	this.hideNewBackupPanel = function (limited) {
		self.newBackupPanel(null);

		if (!limited)
			self.showBrowseBackupsPanel();
	};

	this.showQuickBackupPanel = function () {
		self.hideBrowseBackupsPanel();
		self.hideRestoringBackupPanel(true);
		self.hideCreatingBackupPanel(true);
		self.hideNewBackupPanel(true);
		self.quickBackupPanel(new QuickBackupPanel());
	};
	this.hideQuickBackupPanel = function (limited) {
		self.quickBackupPanel(null);

		if (!limited)
			self.showBrowseBackupsPanel();
	};

	this.showBrowseBackupsPanel = function () {
		self.hideNewBackupPanel(true);
		self.hideRestoringBackupPanel(true);
		self.hideCreatingBackupPanel(true);
		self.hideQuickBackupPanel(true);
		self.browseBackupsPanel(new BrowseBackupsPanel());
	};
	this.hideBrowseBackupsPanel = function () {
		self.browseBackupsPanel(null);
	};

	this.showRestoringBackupPanel = function () {
		self.hideNewBackupPanel(true);
		self.hideBrowseBackupsPanel();
		self.hideCreatingBackupPanel(true);
		self.hideQuickBackupPanel(true);

		self.restoringBackup(true);
	};
	this.hideRestoringBackupPanel = function (limited) {
		self.restoringBackup(false);

		if (!limited)
			self.showBrowseBackupsPanel();
	};

	this.showCreatingBackupPanel = function () {
		self.hideNewBackupPanel(true);
		self.hideBrowseBackupsPanel();
		self.hideRestoringBackupPanel(true);
		self.hideQuickBackupPanel(true);

		self.creatingBackup(true);
	};
	this.hideCreatingBackupPanel = function (limited) {
		self.creatingBackup(false);

		if (!limited)
			self.showBrowseBackupsPanel();
	};

	this.editBackup = function (title) {
		$.getJSON('api/index.php?path=/backups/get&title=' + title + '&key=' + self.password(), function (data) {
			self.newBackupPanel(new NewBackupPanel(data));

			self.hideBrowseBackupsPanel();
		});
	};

	this.back = function () {
		self.showBrowseBackupsPanel();
	};

	this.alert = function (title, message, type) {
		this.alerts.push({title: title, message: message, type: type});

		$('body').scrollTop(0);
	};

	this.showDialog = function (title, message, buttons) {
		function btnClick() {
			$('#modal-box').modal('hide');
		}

		for (var i = buttons.length - 1; i >= 0; i--) {
			buttons[i].click = (function(callback) {
				return function () {
					callback();

					btnClick();
				};
			})(buttons[i].click);
		};

		this.modalBox({
			title: title,
			message: message,
			buttons: buttons
		});

		$('#modal-box').modal({
			keyboard: false
		});
	};

	/* Computables */
	this.isIndex = ko.computed(function(){
		return self.newBackupPanel() === null && self.browseBackupsPanel() === null;
	});

	this.stats = ko.observable({
		freeSpace: 'n/a',
		backups: 'n/a',
		backupJobs: 'n/a',
		lastBackup: 'n/a'
	});

	/* Constructor */
	this.passwordPanel(new PasswordPanel());

	this.onLogin = function () {
		jQuery.getJSON('api/index.php?path=/checkInstall&key=' + self.password(), function (data) {
			var alerts = data.alerts;

			for (var i = alerts.length - 1; i >= 0; i--) {
				self.alert(alerts[i].title, alerts[i].message, alerts[i].type);
			}

			/*var stats = data.stats;
			stats.freeSpace = prettySize(stats.freeSpace);

			self.stats(stats);*/
		});
	};
}

function prettySize(bytes)
{
	var i = 0;
	var byteUnits = [' bytes' , ' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];

	while (bytes > 1024) {
		bytes = bytes / 1024;
		i++;
	}

	if (i > 0)
		return bytes.toFixed(1) + byteUnits[i];
	else
		return bytes + byteUnits[i];
}

KnockoutComponents.basePath = 'gui/components/';
KnockoutComponents.defaultSuffix = '.html';

Application = new SmartBackup();
$(function($) {
	// Disable AJAX cache
	$.ajaxSetup({
		cache: false
	});

	ko.applyBindings(Application);

	// Remove closed alerts from the Application.alerts array
	$('#alertsContainer .alert').live('closed', function () {
		Application.alerts.remove(ko.dataFor(this));
	});
});