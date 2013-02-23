<?php
  header ("Content-Type:text/xml");  
	function gzuncompress_crc32($data) {
    $f = tempnam('/tmp', 'gz_fix');
    file_put_contents($f, "\x1f\x8b\x08\x00\x00\x00\x00\x00" . $data);
    return file_get_contents('compress.zlib://' . $f);
	}
	
  if (!isset($_GET["tid"])) {
    echo "Tournament ID not set!";
    exit;
  }
  $id = $_GET["tid"];
  $url = "http://livescore.tournamentsoftware.com/livescore.aspx?id=$id";
  $compressed = file_get_contents($url);
  $uncompressed = gzuncompress_crc32($compressed);
  echo $uncompressed;
?>