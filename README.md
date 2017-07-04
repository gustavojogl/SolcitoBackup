Solcito Backup

Requerimientos:


Instalación:

Ejemplo en un servidor apache en raiz

cd /var/www/html/

git clone https://github.com/gustavojogl/SolcitoBackup.git app/

chmod 777 logs/ temp/ -R
chonw www-data:www-data


Cron:

Setear en el cron cada 5 minutos 

*/5 * * * * root $(which php) /var/www/html/app/cron.php > /var/log/solbackup.log
	
Acceso:

http://ipdetuservidor/app/
