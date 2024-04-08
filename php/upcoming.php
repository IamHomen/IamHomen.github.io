<?php
// Get the page and perPage from the URL search parameters
if (isset($_GET['page']) && isset($_GET['perPage'])) {
    $page = $_GET['page'];
    $perPage = $_GET['perPage'];

    // GraphQL query
    $query = <<<GRAPHQL
    {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC, status: NOT_YET_RELEASED) {
          id
          seasonYear
          format
          coverImage {
            extraLarge
          }
          title {
            english
            userPreferred
            romaji
          }
        }
      }
    }
GRAPHQL;

    // Set up cURL
    $ch = curl_init('https://graphql.anilist.co');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['query' => $query]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
    ]);

    // Execute the request
    $response = curl_exec($ch);

    // Check for errors
    if ($response === false) {
        echo 'Error: ' . curl_error($ch);
    } else {
        // Decode the JSON response
        $data = json_decode($response, true);

        // Output the result as JSON
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    // Close cURL
    curl_close($ch);
} else {
    // Parameters not found in URL search parameters
    echo 'Error: Parameters not found in URL.';
}
?>
