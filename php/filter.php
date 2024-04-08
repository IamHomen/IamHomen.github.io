<?php
if (isset($_GET['keyword']) && isset($_GET['page'])) {
    $keyword = $_GET['keyword'];
    $page = $_GET['page'];

    $search_path = "https://anitaku.to/filter.html?keyword=$keyword&sort=title_az&page=$page";

    try {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $search_path);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $response = curl_exec($curl);
        curl_close($curl);

        $doc = new DOMDocument();
        @$doc->loadHTML($response);
        $xpath = new DOMXPath($doc);

        $items = $xpath->query('//div[contains(@class, "last_episodes")]/ul/li');
        $list = [];
        foreach ($items as $item) {
            $animeId = explode('/', $item->getElementsByTagName('p')[0]->getElementsByTagName('a')[0]->getAttribute('href'))[2];
            $animeTitle = $item->getElementsByTagName('p')[0]->getElementsByTagName('a')[0]->getAttribute('title');
            $animeImg = $item->getElementsByTagName('div')[0]->getElementsByTagName('a')[0]->getElementsByTagName('img')[0]->getAttribute('src');
            $releasedDate = trim($item->getElementsByTagName('p')[1]->textContent);

            $list[] = [
                'animeId' => $animeId,
                'animeTitle' => $animeTitle,
                'animeImg' => $animeImg,
                'releasedDate' => $releasedDate
            ];
        }

        echo json_encode($list, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    } catch (Exception $e) {
        echo $e->getMessage();
        return ['error' => $e->getMessage()];
    }
}
?>