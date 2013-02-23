TournamentSoftwareLiveScore
==============
TournamentSoftware is the standard platform for managing badminton tournaments and publishing the results. One mayor feature is the capability to provide an unrivaled livescore. Nevertheless one problem is, that the livescore doesn't support mobile devices at all.

This simple PHP/jQuery code enables you to display the current livescore for a given tournament-id as plane html on any device.

Requirements
------------
* PHP
* PHP-extension zlib (http://www.php.net/manual/en/intro.zlib.php)

Usage
------------
the url-parameters for index.php are:

* tid ==> tournament-id, for example: F2C4D636-7B1D-4AF7-8BC5-5D9090F9E1E6
* pids ==> json-encoded array of bwf player-ids, which should get highlighted
* visible ==> decide whether all games/courts are displayed or only these where filtered players are on

Example
------------
index.php?tid=F2C4D636-7B1D-4AF7-8BC5-5D9090F9E1E6&pids=["89785","10319"]&visible=false

* opens the Austria Open 2013 livescore
* highlights the game/field when Kento Momota (89785) or Eric Pang (10319) are playing 
* only fields where Momota or Pang are playing gets displayed