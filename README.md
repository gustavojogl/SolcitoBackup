Solcito Backup

### Requerimientos:

### Instalación:

Ejemplo en un servidor apache en raiz

```PHP
cd /var/www/html/
```
Clonar Repositorio:

```PHP
git clone https://github.com/gustavojogl/SolcitoBackup.git app/
```
Permisos:

```PHP
chmod 777 logs/ temp/ -R
chown www-data:www-data
```

Setear Clave de Acceso:
Editar el archivo settings.php y cambiar el valor 'password' => 'solcito' 

Cron:
Setear en el cron cada 5 minutos 

*/5 * * * * root $(which php) /var/www/html/app/cron.php > /var/log/solbackup.log
	
Acceso:

http://ipdetuservidor/app/


Por futuras actualizaciones consulte a la [Documentación Oficial](http://www.idibox.com).

