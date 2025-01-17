<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'vendor/autoload.php';

try {
    $client = new MongoDB\Client(
        "mongodb+srv://Pavithra:Pavi2209@sustainabilitytracker.c6wt7.mongodb.net/",
        [
            'serverSelectionTimeoutMS' => 5000,
            'retryWrites' => true
        ]
    );
    
    $database = $client->Smart_Recipe_Recommender;
    
    // Test the connection
    $database->command(['ping' => 1]);
    
} catch (MongoDB\Driver\Exception\ConnectionTimeoutException $e) {
    die("Connection timeout: " . $e->getMessage());
} catch (MongoDB\Driver\Exception\AuthenticationException $e) {
    die("Authentication failed: " . $e->getMessage());
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>