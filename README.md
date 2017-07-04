Solcito Backup

Requerimientos:


Instalación:

Ejemplo en un servidor apache en raiz

cd /var/www/html/

Clonar Repositorio:
git clone https://github.com/gustavojogl/SolcitoBackup.git app/

Permisos:
chmod 777 logs/ temp/ -R
chown www-data:www-data

Setear Clave de Acceso:
Editar el archivo settings.php y cambiar el valor 'password' => 'solcito' 

Cron:
Setear en el cron cada 5 minutos 

*/5 * * * * root $(which php) /var/www/html/app/cron.php > /var/log/solbackup.log
	
Acceso:

http://ipdetuservidor/app/


### Usage Instructions
```PHP
// As an instance...
$queue->push('SendEmail', array('message' => $message));

// If setAsGlobal has been called...
Queue::push('SendEmail', array('message' => $message));
```

For further documentation on using the queue, consult the [Laravel framework documentation](https://laravel.com/docs).

