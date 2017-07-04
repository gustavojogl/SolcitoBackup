<?php
if (!defined('STORM_LOADED'))
{
	header('HTTP/1.1 404 Not Found', true, 404);
	exit;
}

$settings = array(
	
	'password' => 'solcito',
	'update_checks' => true
);
