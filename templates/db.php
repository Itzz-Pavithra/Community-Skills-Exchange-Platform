<?php
require_once __DIR__ . '/vendor/autoload.php';

try {
    // Create a MongoDB client
    $client = new MongoDB\Client("mongodb://localhost:27017");
    
    // Select database and collection
    $database = $client->Skills_Exchange;
    $collection = $database->users;
    
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>