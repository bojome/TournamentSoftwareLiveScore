<?php

class HTML {

  static function printHeader() {
    $id = uniqid();
    echo "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">
      <html>
      <head>
    	<meta name=\"viewport\" content=\"width=320px\" />
      <title></title>
      <script type=\"text/javascript\" src=\"http://code.jquery.com/jquery-1.7.1.min.js\"></script>
      <script type=\"text/javascript\" src=\"js/ticker.js?$id\"></script>
      <link rel=\"stylesheet\" type=\"text/css\" href=\"css/main.css?$id\">
      </head>";
  }
  
  static function printBody() {
    echo "<body><table id=\"tableResult\"></table></body>";
  }
  
  static function printFooter() {
  	echo "</html>";
  }
}

?>