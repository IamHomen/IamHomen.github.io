<?php
if (isset($_GET['page']) && isset($_GET['type'])) {
    $page = $_GET['page'];
    $type = $_GET['type'];

  $recent_release_url = 'https://ajax.gogocdn.net/ajax/page-recent-release.html?page=$page&type=$type';
  $BASE_URL = 'https://anitaku.to/';

  try {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $recent_release_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($curl);
    curl_close($curl);

    $doc = new DOMDocument();
    @$doc->loadHTML($response);
    $xpath = new DOMXPath($doc);

    $items = $xpath->query('//div[contains(@class, "last_episodes loaddub")]/ul/li');
    foreach ($items as $item) {
      $animeId = explode('-', explode('/', $item->getElementsByTagName('p')[0]->getElementsByTagName('a')[0]->getAttribute('href'))[1])[0];
      $episodeId = explode('/', $item->getElementsByTagName('p')[0]->getElementsByTagName('a')[0]->getAttribute('href'))[1];
      $animeTitle = $item->getElementsByTagName('p')[0]->getElementsByTagName('a')[0]->getAttribute('title');
      $episodeNum = str_replace('Episode ', '', trim($item->getElementsByTagName('p')[1]->textContent));
      $subOrDub = str_replace('type ic-', '', $item->getElementsByTagName('div')[0]->getElementsByTagName('a')[0]->getElementsByTagName('div')[0]->getAttribute('class'));
      $animeImg = $item->getElementsByTagName('div')[0]->getElementsByTagName('a')[0]->getElementsByTagName('img')[0]->getAttribute('src');

      $list[] = [
        'animeId' => $animeId,
        'episodeId' => $episodeId,
        'animeTitle' => $animeTitle,
        'episodeNum' => $episodeNum,
        'subOrDub' => $subOrDub,
        'animeImg' => $animeImg
      ];
    }
    
    echo json_encode($list, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); 
  } catch (Exception $e) {
    echo $e->getMessage();
    return ['error' => $e->getMessage()];
  }
}
?>