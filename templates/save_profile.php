<?php
require_once 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Collect form data
        $profileData = [
            'username' => $_POST['username'],
            'email' => $_POST['email'],
            'skills' => [],
            'address' => $_POST['address'],
            'location' => [
                'type' => 'Point',
                'coordinates' => [
                    (float)$_POST['longitude'],
                    (float)$_POST['latitude']
                ]
            ],
            'created_at' => new MongoDB\BSON\UTCDateTime()
        ];

        // Process skills
        foreach ($_POST['skills'] as $index => $skill) {
            $profileData['skills'][] = [
                'name' => $skill,
                'level' => $_POST['skillLevels'][$index]
            ];
        }

        // Insert into MongoDB
        $result = $collection->insertOne($profileData);

        if ($result->getInsertedCount() > 0) {
            $response = [
                'success' => true,
                'message' => 'Profile created successfully!'
            ];
        } else {
            throw new Exception('Failed to create profile');
        }

    } catch (Exception $e) {
        $response = [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ];
    }

    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}