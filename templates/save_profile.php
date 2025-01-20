<?php
// Set header to JSON
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    require_once __DIR__ . '/templates/db.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Validate and sanitize input data
        $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $address = filter_var($_POST['address'], FILTER_SANITIZE_STRING);
        $latitude = filter_var($_POST['latitude'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $longitude = filter_var($_POST['longitude'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

        // Validate required fields
        if (empty($username) || empty($email) || empty($address)) {
            throw new Exception("Required fields cannot be empty");
        }

        // Process skills array
        $skills = [];
        if (isset($_POST['skills']) && is_array($_POST['skills'])) {
            foreach ($_POST['skills'] as $key => $skill) {
                $skills[] = [
                    'name' => filter_var($skill, FILTER_SANITIZE_STRING),
                    'level' => filter_var($_POST['skillLevels'][$key], FILTER_SANITIZE_STRING)
                ];
            }
        }

        // Create user document
        $userDocument = [
            'username' => $username,
            'email' => $email,
            'skills' => $skills,
            'location' => [
                'address' => $address,
                'coordinates' => [
                    'latitude' => (float)$latitude,
                    'longitude' => (float)$longitude
                ]
            ],
            'created_at' => new MongoDB\BSON\UTCDateTime(time() * 1000)
        ];

        // Insert document into collection
        $result = $collection->insertOne($userDocument);

        if ($result->getInsertedCount() === 1) {
            echo json_encode([
                'success' => true,
                'message' => 'Profile created successfully!',
                'userId' => (string)$result->getInsertedId()
            ]);
        } else {
            throw new Exception("Failed to insert user document");
        }
    } else {
        throw new Exception("Invalid request method");
    }
} catch (Exception $e) {
    // Return error in JSON format
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>