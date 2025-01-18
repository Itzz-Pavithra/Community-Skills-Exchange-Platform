<?php
require_once __DIR__ . '/../vendor/autoload.php';

try {
    // Connect to MongoDB
    $client = new MongoDB\Client("mongodb://localhost:27017");
    
    // Select database and collection
    $database = $client->skillshare_community;
    $collection = $database->user_profiles;
    
} catch (Exception $e) {
    die("Error connecting to MongoDB: " . $e->getMessage());
}